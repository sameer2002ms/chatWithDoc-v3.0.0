import os
from functools import lru_cache
from langchain_openai import OpenAIEmbeddings
from typing import List


@lru_cache
def get_embeddings() -> OpenAIEmbeddings:
    """
    Singleton OpenAI embeddings instance.
    Shared by ingestion and retrieval.
    """
    return OpenAIEmbeddings(
        model=os.getenv(
            "OPENAI_EMBEDDING_MODEL",
            "text-embedding-3-small",
        )
    )


def embed_texts_langchain(texts: List[str]) -> List[List[float]]:
    """
    Used ONLY during ingestion.
    """
    embeddings = get_embeddings()
    return embeddings.embed_documents(texts)
