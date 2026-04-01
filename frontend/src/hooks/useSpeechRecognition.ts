import { useState, useRef, useCallback } from 'react'
import type { SpeechRecognitionHook } from '../types'

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

export function useSpeechRecognition(lang: string = 'pt-BR'): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef('')

  const startListening = useCallback(() => {
    setError(null)
    setTranscript('')
    finalTranscriptRef.current = ''

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser. Use Chrome.')
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
      // With continuous=false, there's typically one result.
      // We still handle multiple results defensively.
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
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow access.')
      } else if (event.error !== 'aborted') {
        setError(`Recognition error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      // Ensure we have the final transcript available
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
    finalTranscriptRef.current = ''
  }, [])

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}
