import { useState } from 'react'
import { useMediaRecorder } from '../hooks/useMediaRecorder'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { cloneVoice, synthesizeSpeech } from '../services/elevenlabs'
import AudioVisualizer from './AudioVisualizer'
import MicButton from './MicButton'
import type { Language } from '../types/languages'

const SAMPLE_TEXT = `Eu tenho uma teoria: ninguém realmente sabe pedir comida em outro idioma. A gente finge. Você aponta, sorri, faz cara de quem entendeu, e torce pra não chegar um prato com tentáculos.

Foi exatamente o que aconteceu comigo em Nápoles. Pedi o que eu jurava ser uma margherita. Chegou uma travessa de frutos do mar que eu não conseguia nem identificar. Comi tudo, claro — porque recusar comida na Itália é praticamente um crime internacional.

O melhor de aprender italiano é que cada erro vira uma história que você conta rindo no jantar. Tipo aquela vez que eu disse "sono caldo" achando que tava dizendo "estou quente" e o garçom quase caiu de rir. Aparentemente eu tinha acabado de dizer que sou um caldo. De carne, provavelmente.`

/** Preview phrase per target language */
const PREVIEW_PHRASES: Record<string, string> = {
  'it': 'Ciao, sono io!',
  'en': 'Hello, it\'s me!',
  'es': '¡Hola, soy yo!',
  'fr': 'Bonjour, c\'est moi !',
  'pt': 'Olá, sou eu!',
  'zh': '你好，是我！',
  'ru': 'Привет, это я!',
  'nl': 'Hallo, ik ben het!',
}

interface VoiceOnboardingProps {
  onComplete: (voiceId: string) => void
  onSkip: () => void
  targetLang?: Language
}

type OnboardingStep = 'intro' | 'recording' | 'review' | 'cloning' | 'preview' | 'done'

export default function VoiceOnboarding({ onComplete, onSkip, targetLang }: VoiceOnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('intro')
  const [error, setError] = useState<string | null>(null)
  const [voiceId, setVoiceId] = useState<string | null>(null)

  const { isRecording, audioBlob, duration, audioLevel, startRecording, stopRecording, resetRecording } =
    useMediaRecorder()
  const { isPlaying, play } = useAudioPlayer()

  const handleStartRecording = () => {
    resetRecording()
    setError(null)
    startRecording()
    setStep('recording')
  }

  const handleStopRecording = () => {
    stopRecording()
    setStep('review')
  }

  const handleReRecord = () => {
    resetRecording()
    setStep('intro')
  }

  const handleConfirm = async () => {
    if (!audioBlob) return
    setStep('cloning')
    setError(null)

    try {
      const result = await cloneVoice('CAPISCO User', audioBlob)
      setVoiceId(result.voiceId)

      // Save to localStorage
      localStorage.setItem(
        'capisco_voice',
        JSON.stringify({
          voiceId: result.voiceId,
          name: 'CAPISCO User',
          createdAt: Date.now(),
        }),
      )

      // Preview: synthesize a greeting in target language
      const previewPhrase = PREVIEW_PHRASES[targetLang?.code ?? 'it'] ?? 'Ciao, sono io!'
      setStep('preview')
      try {
        const audioData = await synthesizeSpeech(previewPhrase, result.voiceId)
        play(audioData)
      } catch {
        // Preview failed but cloning worked
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voice cloning error')
      setStep('review')
    }
  }

  const handleFinish = () => {
    if (voiceId) {
      onComplete(voiceId)
    }
  }

  return (
    <div className="h-full overflow-y-auto overscroll-contain flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 max-w-lg mx-auto safe-top safe-bottom">
      {/* Logo */}
      <h1 className="font-display text-4xl sm:text-5xl text-ink mb-1 sm:mb-2 tracking-tight mt-4 sm:mt-0">CAPISCO</h1>
      <p className="font-mono text-xs sm:text-sm text-warm-gray mb-8 sm:mb-12">voice setup</p>

      {/* Step: Intro */}
      {step === 'intro' && (
        <div className="animate-fade-up text-center w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-warm-gray-light/30 mb-6 sm:mb-8">
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-3 sm:mb-4">
              Let's clone your voice
            </h2>
            <p className="text-warm-gray leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              Read the text below out loud, naturally. We need at least{' '}
              <strong className="text-terracotta">30 seconds</strong> of audio to create
              a good copy of your voice.
            </p>
            <div className="bg-crema rounded-xl p-4 sm:p-6 text-left max-h-48 sm:max-h-none overflow-y-auto">
              <p className="font-body text-ink leading-relaxed text-sm">
                {SAMPLE_TEXT}
              </p>
            </div>
          </div>

          <MicButton isActive={false} onClick={handleStartRecording} size="lg" />
          <p className="text-xs sm:text-sm text-warm-gray mt-4">Tap to start recording</p>

          <button
            onClick={onSkip}
            className="mt-6 text-xs sm:text-sm text-warm-gray/60 underline underline-offset-4 hover:text-warm-gray transition-colors cursor-pointer"
          >
            Skip — use system voice
          </button>
        </div>
      )}

      {/* Step: Recording */}
      {step === 'recording' && (
        <div className="animate-fade-up text-center w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-warm-gray-light/30 mb-6 sm:mb-8">
            <p className="font-body text-ink leading-relaxed text-xs sm:text-sm mb-4 sm:mb-6 max-h-32 sm:max-h-none overflow-y-auto">
              {SAMPLE_TEXT}
            </p>
          </div>

          {/* Audio Level Visualizer */}
          <AudioVisualizer isActive={isRecording} level={audioLevel} />

          {/* Duration */}
          <div className="mt-3 sm:mt-4 mb-4 sm:mb-6">
            <span className="font-mono text-2xl sm:text-3xl text-ink">{formatDuration(duration)}</span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  duration >= 30 ? 'bg-green-500' : 'bg-terracotta animate-pulse'
                }`}
              />
              <span className="text-xs sm:text-sm text-warm-gray">
                {duration >= 30 ? 'Enough time!' : `Minimum: 30s`}
              </span>
            </div>
          </div>

          <MicButton isActive={true} onClick={handleStopRecording} size="lg" />
          <p className="text-xs sm:text-sm text-warm-gray mt-4">Tap to stop</p>
        </div>
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <div className="animate-fade-up text-center w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-warm-gray-light/30 mb-6 sm:mb-8">
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-3 sm:mb-4">Recording complete</h2>
            <p className="text-warm-gray mb-4">
              Duration: <strong className="font-mono">{formatDuration(duration)}</strong>
            </p>

            {duration < 30 && (
              <p className="text-terracotta text-sm mb-4">
                ⚠️ We recommend at least 30 seconds for best quality.
              </p>
            )}

            {error && (
              <p className="text-red-500 text-sm mb-4">❌ {error}</p>
            )}

            {/* Playback */}
            {audioBlob && (
              <button
                onClick={() => play(audioBlob)}
                className="flex items-center gap-2 mx-auto px-4 py-2 rounded-full bg-warm-gray/10 text-warm-gray hover:bg-warm-gray/20 transition-colors text-sm font-medium cursor-pointer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {isPlaying ? 'Playing...' : 'Listen to recording'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleReRecord}
              className="flex-1 px-5 sm:px-6 py-3 rounded-xl border border-warm-gray-light/50 text-warm-gray hover:bg-warm-gray/10 active:scale-95 transition-all font-medium cursor-pointer touch-target"
            >
              Re-record
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-5 sm:px-6 py-3 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark active:scale-95 transition-all font-medium cursor-pointer touch-target"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Step: Cloning */}
      {step === 'cloning' && (
        <div className="animate-fade-up text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin mx-auto mb-5 sm:mb-6" />
          <h2 className="font-display text-xl sm:text-2xl text-ink mb-2">Cloning your voice...</h2>
          <p className="text-warm-gray text-xs sm:text-sm">This may take a few seconds</p>
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && (
        <div className="animate-fade-up text-center w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-warm-gray-light/30 mb-6 sm:mb-8">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎉</div>
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-3 sm:mb-4">Voice cloned!</h2>
            <p className="text-warm-gray mb-4 sm:mb-6 text-sm sm:text-base">
              Hear how you sound in {targetLang?.label ?? 'another language'}:
            </p>
            <p className="font-display text-2xl sm:text-3xl text-terracotta italic">
              "{PREVIEW_PHRASES[targetLang?.code ?? 'it'] ?? 'Ciao, sono io!'}"
            </p>
            {isPlaying && (
              <div className="flex items-end justify-center gap-0.5 h-6 mt-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-terracotta rounded-full animate-wave-bar"
                    style={{ height: '100%', animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleFinish}
            className="w-full px-6 py-4 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark active:scale-95 transition-all font-medium text-base sm:text-lg cursor-pointer touch-target"
          >
            Start using CAPISCO
          </button>
        </div>
      )}
    </div>
  )
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
