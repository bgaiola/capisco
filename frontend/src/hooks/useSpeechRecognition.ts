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

export function useSpeechRecognition(): SpeechRecognitionHook {
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
      setError('Reconhecimento de voz não suportado neste navegador. Use Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.continuous = true
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
          interimText += result[0].transcript
        }
      }

      // Always keep the latest final transcript
      if (finalText) {
        finalTranscriptRef.current = finalText
      }

      setTranscript(finalText || interimText || finalTranscriptRef.current)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech') {
        setError('Nenhuma fala detectada. Tente novamente.')
      } else if (event.error === 'not-allowed') {
        setError('Permissão de microfone negada. Permita o acesso ao microfone.')
      } else if (event.error !== 'aborted') {
        setError(`Erro no reconhecimento: ${event.error}`)
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
  }, [])

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
