from lc_logic.models import Document
from langchain_rag.vectorstores.qdrant_store import (
    get_vectorstore,
    retrieve_by_document_id,
)
from langchain_rag.chains.rag_chain import build_answer_chain


def run_langchain_rag(
    *,
    question: str,
    collection_name: str,
    top_k: int = 5,
) -> str:
    """
    Ask-time RAG execution.
    Always answers from the latest READY document.
    """

    # 1️⃣ Get latest READY document from Postgres
    latest_doc = (
        Document.objects
        .filter(status="READY")
        .order_by("-created_at")
        .first()
    )

    if not latest_doc:
        return "No document available to answer the question."

    document_id = latest_doc.id

    # 2️⃣ Vector store
    vectorstore = get_vectorstore(collection_name)

    # 3️⃣ Retrieve chunks scoped by document_id
    retrieved_docs = retrieve_by_document_id(
        vectorstore=vectorstore,
        query=question,
        document_id=document_id,
        k=top_k,
    )

    if not retrieved_docs:
        return "I don't know based on the provided document."

    # 4️⃣ Build context
    context = "\n\n".join(doc.page_content for doc in retrieved_docs)

    # 5️⃣ Generate answer
    chain = build_answer_chain()

    answer = chain.invoke(
        {
            "context": context,
            "question": question,
        }
    )

    return answer
