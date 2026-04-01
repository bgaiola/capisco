export interface Translation {
  id: string
  originalText: string
  translatedText: string
  notes: string
  audioUrl?: string
  timestamp: number
}

export interface VoiceProfile {
  voiceId: string
  name: string
  createdAt: number
}

export type AppTab = 'voice' | 'text' | 'history'

export type TranslationStep =
  | 'idle'
  | 'recording'
  | 'transcribing'
  | 'translating'
  | 'synthesizing'
  | 'playing'
  | 'done'
  | 'error'

export interface ClaudeResponse {
  traducao: string
  notas: string
}

export interface SpeechRecognitionHook {
  isListening: boolean
  transcript: string
  error: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

export interface MediaRecorderHook {
  isRecording: boolean
  audioBlob: Blob | null
  duration: number
  audioLevel: number
  startRecording: () => void
  stopRecording: () => void
  resetRecording: () => void
}

export interface AudioPlayerHook {
  isPlaying: boolean
  play: (src: string | Blob) => void
  stop: () => void
}
