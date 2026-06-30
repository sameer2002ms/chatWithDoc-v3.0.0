
from langchain_community.document_loaders import Docx2txtLoader
from datetime import datetime

def load_word(file_path: str, doc_id: str):
    loader = Docx2txtLoader(file_path)
    docs = loader.load()

    for doc in docs:
        doc.metadata.update({
            "doc_id": doc_id,
            "source_type": "word",
            "source_name": file_path,
            "ingested_at": datetime.utcnow().isoformat(),
        })

    return docs
