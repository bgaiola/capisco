import { apiFetch, ApiError } from './api'

export async function cloneVoice(
  audioBlob: Blob,
  options: { label?: 'self' | 'partner'; langSpeechCode?: string } = {},
): Promise<{ voiceId: string; label: 'self' | 'partner' }> {
  const formData = new FormData()
  formData.append('label', options.label ?? 'self')
  if (options.langSpeechCode) formData.append('langSpeechCode', options.langSpeechCode)
  formData.append('audio', audioBlob, 'voice-sample.webm')

  // Clone can take longer, give it 60s
  const response = await apiFetch('/api/clone-voice', { method: 'POST', body: formData }, 60000)

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new ApiError(
      err.message || `Could not clone voice (HTTP ${response.status})`,
      response.status,
      err.error || 'clone_failed',
    )
  }

  return response.json()
}

export async function synthesizeSpeech(text: string, voiceId: string): Promise<Blob> {
  const response = await apiFetch('/api/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceId }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new ApiError(
      err.message || `Synthesis error (HTTP ${response.status})`,
      response.status,
      err.error || 'synth_failed',
    )
  }

  return response.blob()
}

/**
 * Fallback: use Web Speech Synthesis API with a voice matching the target language
 */
export function speakWithFallback(text: string, lang: string = 'it-IT'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'))
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9

    const langPrefix = lang.split('-')[0]
    const voices = speechSynthesis.getVoices()
    const matchingVoice =
      voices.find((v) => v.lang === lang) || voices.find((v) => v.lang.startsWith(langPrefix))
    if (matchingVoice) utterance.voice = matchingVoice

    utterance.onend = () => resolve()
    utterance.onerror = () => reject(new Error('Speech synthesis error'))

    speechSynthesis.speak(utterance)
  })
}
