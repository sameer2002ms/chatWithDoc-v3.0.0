const API_BASE_URL = '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.error || 'Request failed'
    throw new Error(message)
  }

  return data
}

export async function uploadDocument(payload) {
  const formData = new FormData()
  formData.append('source_type', payload.sourceType)

  if (payload.sourceType === 'url') {
    formData.append('url', payload.url)
  } else if (payload.file) {
    formData.append('file', payload.file)
  }

  return request('/upload/', {
    method: 'POST',
    body: formData,
  })
}

export async function askQuestion(payload) {
  return request('/ask/', {
    method: 'POST',
    body: JSON.stringify({
      question: payload.question,
      top_k: payload.topK,
    }),
  })
}
