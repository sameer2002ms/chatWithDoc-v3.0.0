from langchain_rag.loaders.pdf_loader import load_pdf
from langchain_rag.loaders.word_loader import load_word
from langchain_rag.loaders.html_loader import load_html
from langchain_rag.loaders.url_loader import load_url

from langchain_rag.splitters.token_splitter import chunk_documents
from langchain_rag.vectorstores.qdrant_store import get_vectorstore


def ingest_document(
    *,
    document_id: int,        # ✅ FROM POSTGRES (DO NOT CHANGE)
    source_type: str,
    source_value: str,
    collection_name: str,
) -> None:
    """
    Ingests a document into Qdrant.
    Called ONLY during upload.
    """

    # 1️⃣ Load document
    if source_type == "pdf":
        documents = load_pdf(source_value, str(document_id))
    elif source_type == "word":
        documents = load_word(source_value, str(document_id))
    elif source_type == "html":
        documents = load_html(source_value, str(document_id))
    elif source_type == "url":
        documents = load_url(source_value, str(document_id))
    else:
        raise ValueError("Unsupported source_type")

    if not documents:
        raise ValueError("No content extracted from document")

    # 2️⃣ Attach REQUIRED metadata
    for doc in documents:
        doc.metadata["document_id"] = document_id  # ✅ INT
        # ❌ NO is_latest

    # 3️⃣ Chunk
    chunks = chunk_documents(documents)

    # 4️⃣ Store in Qdrant
    vectorstore = get_vectorstore(collection_name)
    vectorstore.add_documents(chunks)
