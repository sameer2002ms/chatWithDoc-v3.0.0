import pdfplumber
from langchain_core.documents import Document
from datetime import datetime
from typing import List


def load_pdf(file_path: str) -> List[Document]:
    """
    Load a PDF file and return LangChain Documents.
    NO document_id logic here.
    """
    documents: List[Document] = []

    with pdfplumber.open(file_path) as pdf:
        total_pages = len(pdf.pages)

        for page_number, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()
            if not text:
                continue

            metadata = {
                "source_type": "pdf",
                "source_name": file_path,
                "page_number": page_number,
                "total_pages": total_pages,
                "ingested_at": datetime.utcnow().isoformat(),
            }

            documents.append(
                Document(
                    page_content=text,
                    metadata=metadata,
                )
            )

    return documents
