from langchain_text_splitters import TokenTextSplitter
from langchain_core.documents import Document


def langchain_token_chunker(
    text: str,
    metadata: dict,
    chunk_size: int = 500,
    overlap: int = 50
):
    splitter = TokenTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
    )

    documents = [
        Document(page_content=text, metadata=metadata)
    ]

    chunked_docs = splitter.split_documents(documents)

    # Add explicit chunk_index for parity
    for i, doc in enumerate(chunked_docs):
        doc.metadata["chunk_index"] = i

    return chunked_docs
