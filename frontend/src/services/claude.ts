import type { ClaudeResponse } from '../types'
import { apiJson } from './api'

export async function translateText(
  text: string,
  from: string = 'pt',
  to: string = 'it',
): Promise<ClaudeResponse> {
  return apiJson<ClaudeResponse>('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, from, to }),
  })
}
