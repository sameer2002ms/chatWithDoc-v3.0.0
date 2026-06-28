import { useState } from 'react'

function UploadPanel({ onUpload, isUploading, result, error }) {
  const [sourceType, setSourceType] = useState('pdf')
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onUpload({ sourceType, file, url })
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
          Step 1
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Upload a document</h2>
        <p className="mt-2 text-sm text-slate-600">
          Send a PDF, Word, HTML file, or a public URL to build the knowledge base.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Source type</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {['pdf', 'word', 'html', 'url'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSourceType(type)}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  sourceType === type
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {type === 'url' ? 'URL' : type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {sourceType === 'url' ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="url-input">
              Document URL
            </label>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/article"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:bg-white"
              required
            />
          </div>
        ) : (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="file-input">
              Upload file
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx,.html"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading || (sourceType === 'url' ? !url : !file)}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isUploading ? 'Uploading...' : 'Upload and index document'}
        </button>
      </form>

      {(error || result) && (
        <div className={`mt-5 rounded-2xl border p-4 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {error ? error : result?.message}
          {result?.document_id && (
            <div className="mt-2 text-xs font-medium">Document ID: {result.document_id}</div>
          )}
        </div>
      )}
    </section>
  )
}

export default UploadPanel
