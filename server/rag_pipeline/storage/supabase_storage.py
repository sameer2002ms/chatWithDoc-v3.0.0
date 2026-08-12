"""
rag_pipeline/storage/supabase_storage.py

Thin wrapper around Supabase Storage for uploading/fetching/deleting PDFs.
Uses the service_role key — this runs server-side only, never expose it
to a frontend. Django's own auth/permissions still gate who can call
the upload endpoint in the first place.
"""

import os
from functools import lru_cache
from supabase import create_client, Client
from django.conf import settings

BUCKET_NAME = "documents"


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY,
    )


def upload_pdf_bytes(storage_path: str, content: bytes) -> str:
    """Upload raw PDF bytes to the 'documents' bucket. Returns the storage path."""
    client = get_supabase_client()
    client.storage.from_(BUCKET_NAME).upload(
        path=storage_path,
        file=content,
        file_options={"content-type": "application/pdf"},
    )
    return storage_path


def download_pdf_to_path(storage_path: str, local_path: str) -> str:
    """Download a PDF from Supabase Storage to a local path for processing."""
    client = get_supabase_client()
    data = client.storage.from_(BUCKET_NAME).download(storage_path)
    with open(local_path, "wb") as f:
        f.write(data)
    return local_path


def delete_pdf(storage_path: str) -> None:
    """Best-effort delete; swallow errors so cleanup never masks the real failure."""
    try:
        client = get_supabase_client()
        client.storage.from_(BUCKET_NAME).remove([storage_path])
    except Exception:
        pass


def get_signed_url(storage_path: str, expires_in: int = 3600) -> str:
    client = get_supabase_client()
    result = client.storage.from_(BUCKET_NAME).create_signed_url(storage_path, expires_in)
    return result["signedURL"]