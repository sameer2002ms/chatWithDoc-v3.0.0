from langchain_community.document_loaders import WebBaseLoader
from datetime import datetime
from urllib.parse import urlparse

def load_url(url: str, doc_id: str):
    loader = WebBaseLoader(url)
    docs = loader.load()

    domain = urlparse(url).netloc

    for doc in docs:
        doc.metadata.update({
            "doc_id": doc_id,
            "source_type": "url",
            "source_name": url,
            "domain": domain,
            "ingested_at": datetime.utcnow().isoformat(),
        })

    return docs
