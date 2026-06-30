import os
import tempfile
import uuid

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rag_pipeline.pipelines.upload_pipeline import ingest_document
from rag_pipeline.storage.supabase_storage import (
    upload_pdf_bytes,
    download_pdf_to_path,
    delete_pdf,
)
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
        storage_path = None
        temp_path = None

        try:
            if source_type == "url":
                # Unchanged: URL-sourced documents don't touch Supabase storage
                doc = Document.objects.create(
                    source_type=source_type,
                    source_name=data["url"],
                    status="UPLOADING",
                )
                source_value = data["url"]

            else:
                uploaded_file = data["file"]
                file_bytes = uploaded_file.read()

                if uploaded_file.content_type != "application/pdf":
                    return Response(
                        {"error": "Only PDF files are accepted"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # 1️⃣ Upload to Supabase Storage first
                storage_path = f"documents/{uuid.uuid4()}_{uploaded_file.name}"
                upload_pdf_bytes(storage_path, file_bytes)

                # 2️⃣ Create the Document record, pointing at the Supabase object
                doc = Document.objects.create(
                    source_type=source_type,
                    source_name=uploaded_file.name,
                    storage_path=storage_path,
                    status="UPLOADING",
                )

                # 3️⃣ Pull the file back down to a temp path for ingestion
                #    (your pipeline reads from a local filesystem path)
                fd, temp_path = tempfile.mkstemp(suffix=".pdf")
                os.close(fd)
                download_pdf_to_path(storage_path, temp_path)
                source_value = temp_path

            # 4️⃣ Ingest
            ingest_document(
                document_id=doc.id,
                source_type=source_type,
                source_value=source_value,
                collection_name="langchain_rag_collection",
            )

            # 5️⃣ Clean up the local temp copy (Supabase keeps the permanent copy)
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

            # 6️⃣ Mark READY
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
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

            if doc:
                # Roll back the Supabase object on failure too
                if storage_path:
                    delete_pdf(storage_path)
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