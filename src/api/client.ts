export type ApiError = Error & {
  status?: number
  details?: unknown
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api'

const buildUrl = (path: string) => {
  const base = API_BASE_URL.replace(/\/$/, '')
  const endpoint = path.replace(/^\//, '')

  return `${base}/${endpoint}`
}

export const apiRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok || payload?.success === false) {
    const error = new Error(payload?.message || `Request failed with status ${response.status}`) as ApiError
    error.status = response.status
    error.details = payload
    throw error
  }

  return (payload?.data ?? payload) as T
}
