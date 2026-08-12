import os
from functools import lru_cache

from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http.models import (
    VectorParams,
    Distance,
    Filter,
    FieldCondition,
    MatchValue,
    PayloadSchemaType,
)

from rag_pipeline.embeddings.openai_embedding import get_embeddings


@lru_cache
def get_qdrant_client() -> QdrantClient:
    url = os.getenv("QDRANT_URL")

    if url:
        return QdrantClient(
            url=url,
            api_key=os.getenv("QDRANT_API_KEY"),
            check_compatibility=False,
        )

    return QdrantClient(
        host="qdrant",
        port=6333,
    )


def get_vectorstore(collection_name: str) -> QdrantVectorStore:
    """
    Returns a Qdrant-backed LangChain vector store.
    Ensures collection exists (idempotent).
    """
    client = get_qdrant_client()
    embeddings = get_embeddings()

    # Get embedding dimension safely
    embedding_dim = len(embeddings.embed_query("dimension_check"))

     # Create payload index for filtering
    try:
        client.create_payload_index(
            collection_name=collection_name,
            field_name="metadata.document_id",
            field_schema=PayloadSchemaType.INTEGER,
        )
    except Exception:
        # Index already exists
        pass

    return QdrantVectorStore(
        client=client,
        collection_name=collection_name,
        embedding=embeddings,
    )


def retrieve_by_document_id(
    *,
    vectorstore: QdrantVectorStore,
    query: str,
    document_id: int,
    k: int,
):
    """
    Retrieve chunks strictly scoped to a single document_id.
    """
    qdrant_filter = Filter(
        must=[
            FieldCondition(
                key="metadata.document_id",  # ✅ IMPORTANT FIX
                match=MatchValue(value=document_id),
            )
        ]
    )

    return vectorstore.similarity_search(
        query=query,
        k=k,
        filter=qdrant_filter,
    )
