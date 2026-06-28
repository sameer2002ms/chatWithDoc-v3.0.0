import { useState } from 'react'

function AskPanel({ onAsk, isAsking, result, error }) {
  const [question, setQuestion] = useState('')
  const [topK, setTopK] = useState(5)

  const handleSubmit = (event) => {
    event.preventDefault()
    onAsk({ question, topK })
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
          Step 2
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Ask a question</h2>
        <p className="mt-2 text-sm text-slate-600">
          Query the most recently uploaded and indexed document.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="question-input">
            Question
          </label>
          <textarea
            id="question-input"
            rows="4"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="What does this document say about..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="top-k">
            Top matching chunks
          </label>
          <input
            id="top-k"
            type="number"
            min="1"
            max="10"
            value={topK}
            onChange={(event) => setTopK(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={isAsking || !question.trim()}
          className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isAsking ? 'Thinking...' : 'Ask the document'}
        </button>
      </form>

      {(error || result) && (
        <div className={`mt-5 rounded-2xl border p-4 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {error ? error : result?.answer}
          {result?.document_id && (
            <div className="mt-2 text-xs font-medium">Document ID: {result.document_id}</div>
          )}
        </div>
      )}
    </section>
  )
}

export default AskPanel
