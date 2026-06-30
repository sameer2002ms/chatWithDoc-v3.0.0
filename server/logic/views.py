from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
from django.conf import settings

from rag_pipeline.pipelines.upload_pipeline import ingest_document
from logic.models import Document

from .serializers import LangChainAskSerializer, UploadDocumentSerializer
from rag_pipeline.vectorstores.qdrant_store import get_vectorstore
from rag_pipeline.chains.rag_chain import build_answer_chain
from rag_pipeline.vectorstores.qdrant_store import retrieve_by_document_id


class LangChainUploadAPIView(APIView):

    def post(self, request):
        serializer = UploadDocumentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        source_type = data["source_type"]
        doc = None

        try:
            # 1️⃣ Create document in UPLOADING state
            doc = Document.objects.create(
                source_type=source_type,
                source_name=(
                    data.get("url") if source_type == "url" else data["file"].name
                ),
                file=data.get("file") if source_type != "url" else None,
                status="UPLOADING",
            )

            # 2️⃣ Resolve source
            source_value = data["url"] if source_type == "url" else doc.file.path

            # 3️⃣ Ingest
            ingest_document(
                document_id=doc.id,
                source_type=source_type,
                source_value=source_value,
                collection_name="langchain_rag_collection",
            )

            # 4️⃣ Delete original file after processing (save disk space)
            if source_type != "url" and doc.file:
                doc.file.delete(save=False)

            # 5️⃣ Mark READY
            doc.status = "READY"
            doc.save(update_fields=["status"])

            return Response(
                {
                    "document_id": doc.id,
                    "message": "Document uploaded and indexed successfully",
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as exc:
            if doc:
                # Clean up file if processing failed
                if hasattr(doc, "file") and doc.file and source_type != "url":
                    doc.file.delete(save=False)
                doc.status = "FAILED"
                doc.save(update_fields=["status"])

            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
class LangChainAskAPIView(APIView):

    def post(self, request):
        serializer = LangChainAskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = serializer.validated_data["question"]
        top_k = max(1, serializer.validated_data.get("top_k", 5))

        # 1️⃣ Latest READY document (Postgres is source of truth)
        latest_doc = (
            Document.objects
            .filter(status="READY")
            .order_by("-created_at")
            .first()
        )

        if not latest_doc:
            return Response(
                {"error": "No document available to answer questions"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2️⃣ Retrieve using STRICT document_id filter
        vectorstore = get_vectorstore("langchain_rag_collection")

        retrieved_docs = retrieve_by_document_id(
            vectorstore=vectorstore,
            query=question,
            document_id=latest_doc.id,
            k=top_k,
        )

        if not retrieved_docs:
            return Response(
                {"answer": "I don't know based on the provided document."},
                status=status.HTTP_200_OK,
            )

        # 3️⃣ Context
        context = "\n\n".join(doc.page_content for doc in retrieved_docs)

        # 4️⃣ Runnable chain invocation
        chain = build_answer_chain()
        answer = chain.invoke(
            {
                "context": context,
                "question": question,
            }
        )

        return Response(
            {
                "document_id": latest_doc.id,
                "question": question,
                "answer": answer,
            },
            status=status.HTTP_200_OK,
        )


class RateLimitTestAPIView(APIView):
    """
    Temporary endpoint for testing the rate limiter.
    """

    def get(self, request):
        return Response(
            {
                "message": "Rate limiter is working!",
            }
        )