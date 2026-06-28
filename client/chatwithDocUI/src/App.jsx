import { useState } from 'react'
import './App.css'
import { askQuestion, uploadDocument } from './api'
import AskPanel from './components/AskPanel'
import UploadPanel from './components/UploadPanel'

function App() {
  const [uploading, setUploading] = useState(false)
  const [asking, setAsking] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [uploadError, setUploadError] = useState('')
  const [askResult, setAskResult] = useState(null)
  const [askError, setAskError] = useState('')

  const handleUpload = async ({ sourceType, file, url }) => {
    setUploading(true)
    setUploadError('')
    setUploadResult(null)

    try {
      const result = await uploadDocument({ sourceType, file, url })
      setUploadResult(result)
    } catch (error) {
      setUploadError(error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleAsk = async ({ question, topK }) => {
    setAsking(true)
    setAskError('')
    setAskResult(null)

    try {
      const result = await askQuestion({ question, topK })
      setAskResult(result)
    } catch (error) {
      setAskError(error.message)
    } finally {
      setAsking(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_45%),linear-gradient(135deg,_#f8fafc,_#eef2ff)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">
            LangChain RAG Studio
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Upload documents and ask questions instantly.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            This interface connects to your Django backend to ingest a document, index it, and answer questions from the most recent ready document.
          </p>
        </header>

        <main className="grid gap-8 lg:grid-cols-2">
          <UploadPanel
            onUpload={handleUpload}
            isUploading={uploading}
            result={uploadResult}
            error={uploadError}
          />
          <AskPanel
            onAsk={handleAsk}
            isAsking={asking}
            result={askResult}
            error={askError}
          />
        </main>
      </div>
    </div>
  )
}

export default App
