from langchain_text_splitters import TokenTextSplitter
from langchain_core.documents import Document
from typing import List


def chunk_documents(
    documents: List[Document],
    chunk_size: int = 500,
    chunk_overlap: int = 50,
) -> List[Document]:
    """
    Token-based chunking.
    Metadata is preserved and enriched with chunk_index.
    """
    splitter = TokenTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )

    chunked_docs = splitter.split_documents(documents)

    for i, doc in enumerate(chunked_docs):
        doc.metadata["chunk_index"] = i

    return chunked_docs
