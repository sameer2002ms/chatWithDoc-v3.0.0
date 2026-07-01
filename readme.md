# 📄 RAG-based Document Question Answering System (LangChain + Qdrant)

## Version 3 of the chatWithDoc (RAG Document Assistant)

A fully integrated frontend + Django REST backend deployment with PDF-first ingestion, LangChain runnable chains, Redis-backed rate limiting, and Qdrant semantic retrieval.

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
* PDF-first document ingestion
* Metadata-scoped retrieval
* Improved modularity and scalability
* Better production-oriented design

This project is designed with **clean architecture, cost efficiency, and interview readiness** in mind.

---

## 🚀 Features

- 📄 **PDF-first ingestion** with exact PDF validation and Supabase upload

- ✂️ **Token-based chunking with overlap** (LangChain)
- 🧠 **OpenAI embeddings** (`text-embedding-3-small`)
- 📦 **Vector storage using Qdrant**
- 🔍 **Semantic retrieval scoped to the latest READY document**
- 🤖 **GPT-based grounded answer generation** (LangChain Runnable chains)
- 🔐 **JWT authentication** with user login, registration, and protected upload/chat flows
- 🛡️ **Hallucination-controlled prompting**
- ⚡ **Redis-backed rate limiting** for safer API usage
- 🌐 **Integrated React frontend** with live Vercel deployment
- 💾 **Supabase Storage for PDF file hosting** and **PostgreSQL** as the metadata source of truth
- 💸 **Cost-optimized ingestion & retrieval**
- 🐳 **Fully Dockerized backend stack** (Django, PostgreSQL, Qdrant, Redis)

---

## 🌍 Live Deployment

- Frontend deployed on Vercel: https://chat-with-doc-v3-0-0.vercel.app

---

## 🏗️ Architecture Overview

```
Client (React + auth)
 └──> Django REST API
        ├── /api/v1/auth/
        │     ├── register/
        │     ├── login/
        │     ├── me/
        │     └── logout/
        ├── /api/v1/upload/
        │     ├── Upload PDF
        │     ├── Save PDF to Supabase Storage
        │     ├── Token-based chunking
        │     ├── Embedding generation (OpenAI)
        │     └── Store vectors in Qdrant (with metadata)
        │
        └── /api/v1/ask/
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
* JWT auth via `djangorestframework-simplejwt`
* Redis-backed rate limiting

### GenAI

* LangChain (Runnable-based chains, v0.2+)
* OpenAI embeddings (`text-embedding-3-small`)
* OpenAI chat model (`gpt-4.1-mini`)

### Vector Search

* Qdrant (payload-based filtering with metadata)

### Storage

* Supabase Storage for PDF uploads
* PostgreSQL for metadata and document state

### Infrastructure

* Docker
* Docker Compose
* Vercel for frontend hosting

---

## 🌐 Platforms & Hosting

- Frontend deployed on Vercel: `https://chat-with-doc-v3-0-0.vercel.app`
- Backend runs on Django with JWT auth and Redis rate limiting
- PDF files are stored in Supabase Storage
- App metadata and document state are persisted in PostgreSQL
- Qdrant powers the semantic retrieval vector store

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
DATABASE_URL=your_postgres_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=documents
RATE_LIMIT=10
RATE_LIMIT_WINDOW=60
REDIS_URL=redis://redis:6379/0
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
* Redis for rate limiting

---

### 2.1️⃣ Run the Frontend Locally

```bash
cd client/chatwithdocUI
npm install
npm run dev
```

Then visit the Vite dev server URL shown in the terminal.

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
POST /api/v1/upload/
```

**Headers**

* `Authorization: Bearer <access_token>`

**Request**

* `multipart/form-data`
* Field: `files` (PDF only, max 1MB)

**Response**

```json
{
  "documents": [
    {
      "document_id": 12,
      "message": "Document uploaded and indexed successfully"
    }
  ]
}
```

---

### 🔹 2. Ask Question

**Endpoint**

```
POST /api/v1/ask/
```

**Headers**

* `Authorization: Bearer <access_token>`

**Request Body**

```json
{
  "question": "What technologies does the candidate know?",
  "top_k": 3
}
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


