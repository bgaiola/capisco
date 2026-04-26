import { useState, useRef, useCallback } from 'react'
import type { SpeechRecognitionHook } from '../types'

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

/**
 * Stable error codes emitted by this hook. The UI is responsible for
 * mapping them to localized strings.
 */
export type SpeechErrorCode =
  | 'unsupported'
  | 'no-speech'
  | 'not-allowed'
  | 'other'

export function useSpeechRecognition(lang: string = 'pt-BR'): SpeechRecognitionHook & {
  errorCode: SpeechErrorCode | null
} {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<SpeechErrorCode | null>(null)
  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef('')

  const startListening = useCallback(() => {
    setError(null)
    setErrorCode(null)
    setTranscript('')
    finalTranscriptRef.current = ''

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser. Use Chrome.')
      setErrorCode('unsupported')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = ''
      let interimText = ''

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interimText = result[0].transcript
        }
      }

      if (finalText) {
        finalTranscriptRef.current = finalText.trim()
        setTranscript(finalText.trim())
      } else if (interimText) {
        setTranscript(interimText.trim())
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech') {
        setError('No speech detected. Try again.')
        setErrorCode('no-speech')
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow access.')
        setErrorCode('not-allowed')
      } else if (event.error !== 'aborted') {
        setError(`Recognition error: ${event.error}`)
        setErrorCode('other')
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      if (finalTranscriptRef.current) {
        setTranscript(finalTranscriptRef.current)
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [lang])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
    setErrorCode(null)
    finalTranscriptRef.current = ''
  }, [])

  return {
    isListening,
    transcript,
    error,
    errorCode,
    startListening,
    stopListening,
    resetTranscript,
  }
}
