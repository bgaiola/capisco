import type { ClaudeResponse } from '../types'
import { apiFetch } from './api'

export async function translateText(
  text: string,
  from: string = 'pt',
  to: string = 'it',
): Promise<ClaudeResponse> {
  const response = await apiFetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, from, to }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || `Erro ao traduzir (HTTP ${response.status})`)
  }

  return response.json()
}
