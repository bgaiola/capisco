/**
 * Base URL for API calls.
 * In development, calls go directly to the backend server.
 * In production, use relative URLs (same origin).
 */
export const API_BASE = import.meta.env.DEV
  ? 'http://localhost:3001'
  : ''

/**
 * Wrapper around fetch with timeout and better error handling.
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
      ...options,
      signal: controller.signal,
    })
    return response
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Tempo esgotado. Verifique se o servidor está rodando.')
    }
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3001.')
  } finally {
    clearTimeout(timer)
  }
}
