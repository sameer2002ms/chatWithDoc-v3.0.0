# 📄 RAG-based Document Question Answering System (LangChain + Qdrant)

## Version 2 of the chatWithDoc (RAG Document Assistant) with LangChain integration, multi-format ingestion, Runnable chains, and metadata-scoped retrieval.

## Previous Version (V1)

This project is the upgraded evolution of the original RAG backend implementation:

➡️ https://github.com/sameer2002ms/chatWithDoc

The V1 project focused on:

* Basic PDF ingestion
* Core RAG pipeline
* OpenAI embeddings + Qdrant integration
* Django REST backend
* Grounded document question answering

This V2 version extends the architecture with:

* LangChain Runnable chains
* Multi-format ingestion
* Metadata-scoped retrieval
* Improved modularity and scalability
* Better production-oriented design

This project is designed with **clean architecture, cost efficiency, and interview readiness** in mind.

---

## 🚀 Features

- 📄 **Multi-format ingestion**
  - PDF
  - Word (`.docx`)
  - HTML
  - Public URLs

- ✂️ **Token-based chunking with overlap** (LangChain)
- 🧠 **OpenAI embeddings** (`text-embedding-3-small`)
- 📦 **Vector storage using Qdrant**
- 🔍 **Semantic retrieval scoped to the latest READY document**
- 🤖 **GPT-based grounded answer generation** (LangChain Runnable chains)
- 🛡️ **Hallucination-controlled prompting**
- 💸 **Cost-optimized ingestion & retrieval**
- 🐳 **Fully Dockerized setup** (Backend, PostgreSQL, Qdrant)


---

## 🏗️ Architecture Overview

```
Client
 └──> Django REST API
        ├── /api/upload
        │     ├── Load document (PDF / Word / HTML / URL)
        │     ├── Token-based chunking
        │     ├── Embedding generation (OpenAI)
        │     └── Store vectors in Qdrant (with metadata)
        │
        └── /api/ask
              ├── Fetch latest READY document (PostgreSQL)
              ├── Semantic retrieval (Qdrant, metadata-scoped)
              ├── Context assembly
              └── Answer generation (GPT via LangChain)

```

---

## 🛠️ Tech Stack

### Backend

* Python 3.11
* Django
* Django REST Framework

### GenAI

GenAI / RAG

* LangChain (Runnable-based chains, v0.2+)

OpenAI API

* text-embedding-3-small

* gpt-4.1-mini

Vector Database

* Qdrant (payload-based filtering with metadata)

Storage

* PostgreSQL

Document lifecycle & metadata

Source of truth for “latest document”

Infrastructure

* Docker

* Docker Compose

---

## ⚙️ Prerequisites

* Docker
* Docker Compose
* OpenAI API Key

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4.1-mini
```

---

## ▶️ How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

---

### 2️⃣ Start Services Using Docker

```bash
docker-compose up --build
```

This will start:

* Django backend (`http://localhost:8000`)
* PostgreSQL
* Qdrant (`http://localhost:6333/dashboard`)

---

### 3️⃣ Apply Database Migrations

```bash
docker exec -it rag_backend bash
python manage.py migrate
```

---

## 📤 API Usage

### 🔹 1. Ingest PDF

**Endpoint**

```
POST /api/upload/
```

**Request**

* `multipart/form-data`
* Field: `files` (PDF)

**Response**

```json
{
  "documents": [
    {
     {
    "document_id": 12,
    "message": "Document uploaded and indexed successfully"
    }
}
  ]
}
```

---

### 🔹 2. Ask Question

**Endpoint**

```
POST /api/ask/
```

**Request Body**

```json
{
  "question": "What technologies does the candidate know?",
  "top_k": 3
}
```

**Response**

```json
{
    "document_id": 12,
    "question": "from which college Sameer graduated ?",
    "answer": "Sameer graduated from Kalinga Institute of Industrial Technology (KIIT) Bhubaneswar, Odisha."
}
```


## 👨‍💻 Author

Built as a **resume-grade GenAI system** with a focus on clean backend architecture, explainability, cost efficiency, and interview readiness.


