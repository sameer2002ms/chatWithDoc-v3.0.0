from langchain_community.document_loaders import BSHTMLLoader
from datetime import datetime

def load_html(file_path: str, doc_id: str):
    loader = BSHTMLLoader(file_path)
    docs = loader.load()

    for doc in docs:
        doc.metadata.update({
            "doc_id": doc_id,
            "source_type": "html",
            "source_name": file_path,
            "ingested_at": datetime.utcnow().isoformat(),
        })

    return docs
