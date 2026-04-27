/**
 * Base URL for API calls.
 * In development, calls go directly to the backend server.
 * In production, use relative URLs (same origin).
 */
export const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''

export class ApiError extends Error {
  status: number
  code: string
  constructor(message: string, status: number, code: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

/**
 * Wrapper around fetch with timeout, credentials, and better error handling.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {},
  timeoutMs = 30000,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      ...options,
      signal: controller.signal,
    })
    return response
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('The request timed out.', 0, 'timeout')
    }
    throw new ApiError('Could not reach the server. Please check your connection.', 0, 'network')
  } finally {
    clearTimeout(timer)
  }
}

export async function apiJson<T = unknown>(
  path: string,
  options: RequestInit = {},
  timeoutMs = 30000,
): Promise<T> {
  const response = await apiFetch(path, options, timeoutMs)
  let body: unknown = null
  if (response.headers.get('content-type')?.includes('application/json')) {
    body = await response.json().catch(() => null)
  }
  if (!response.ok) {
    const b = (body as { error?: string; message?: string } | null) ?? null
    throw new ApiError(b?.message ?? `HTTP ${response.status}`, response.status, b?.error ?? 'http_error')
  }
  return body as T
}
