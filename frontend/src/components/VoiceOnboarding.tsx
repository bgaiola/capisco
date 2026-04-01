import { useState } from 'react'
import { useMediaRecorder } from '../hooks/useMediaRecorder'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { cloneVoice, synthesizeSpeech } from '../services/elevenlabs'
import AudioVisualizer from './AudioVisualizer'
import MicButton from './MicButton'

const SAMPLE_TEXT = `Eu tenho uma teoria: ninguém realmente sabe pedir comida em outro idioma. A gente finge. Você aponta, sorri, faz cara de quem entendeu, e torce pra não chegar um prato com tentáculos.

Foi exatamente o que aconteceu comigo em Nápoles. Pedi o que eu jurava ser uma margherita. Chegou uma travessa de frutos do mar que eu não conseguia nem identificar. Comi tudo, claro — porque recusar comida na Itália é praticamente um crime internacional.

O melhor de aprender italiano é que cada erro vira uma história que você conta rindo no jantar. Tipo aquela vez que eu disse "sono caldo" achando que tava dizendo "estou quente" e o garçom quase caiu de rir. Aparentemente eu tinha acabado de dizer que sou um caldo. De carne, provavelmente.`

interface VoiceOnboardingProps {
  onComplete: (voiceId: string) => void
  onSkip: () => void
}

type OnboardingStep = 'intro' | 'recording' | 'review' | 'cloning' | 'preview' | 'done'

export default function VoiceOnboarding({ onComplete, onSkip }: VoiceOnboardingProps) {
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

      // Preview: synthesize "Ciao, sono io!"
      setStep('preview')
      try {
        const audioData = await synthesizeSpeech('Ciao, sono io!', result.voiceId)
        play(audioData)
      } catch {
        // Preview failed but cloning worked
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao clonar voz')
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
      <p className="font-mono text-xs sm:text-sm text-warm-gray mb-8 sm:mb-12">configuração de voz</p>

      {/* Step: Intro */}
      {step === 'intro' && (
        <div className="animate-fade-up text-center w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-warm-gray-light/30 mb-6 sm:mb-8">
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-3 sm:mb-4">
              Vamos clonar sua voz
            </h2>
            <p className="text-warm-gray leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              Leia o texto abaixo em voz alta e natural. Precisamos de pelo menos{' '}
              <strong className="text-terracotta">30 segundos</strong> de áudio para criar
              uma boa cópia da sua voz.
            </p>
            <div className="bg-crema rounded-xl p-4 sm:p-6 text-left max-h-48 sm:max-h-none overflow-y-auto">
              <p className="font-body text-ink leading-relaxed text-sm">
                {SAMPLE_TEXT}
              </p>
            </div>
          </div>

          <MicButton isActive={false} onClick={handleStartRecording} size="lg" />
          <p className="text-xs sm:text-sm text-warm-gray mt-4">Toque para começar a gravar</p>

          <button
            onClick={onSkip}
            className="mt-6 text-xs sm:text-sm text-warm-gray/60 underline underline-offset-4 hover:text-warm-gray transition-colors cursor-pointer"
          >
            Pular — usar voz do sistema
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
                {duration >= 30 ? 'Tempo suficiente!' : `Mínimo: 30s`}
              </span>
            </div>
          </div>

          <MicButton isActive={true} onClick={handleStopRecording} size="lg" />
          <p className="text-xs sm:text-sm text-warm-gray mt-4">Toque para parar</p>
        </div>
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <div className="animate-fade-up text-center w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-warm-gray-light/30 mb-6 sm:mb-8">
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-3 sm:mb-4">Gravação concluída</h2>
            <p className="text-warm-gray mb-4">
              Duração: <strong className="font-mono">{formatDuration(duration)}</strong>
            </p>

            {duration < 30 && (
              <p className="text-terracotta text-sm mb-4">
                ⚠️ Recomendamos pelo menos 30 segundos para melhor qualidade.
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
                {isPlaying ? 'Reproduzindo...' : 'Ouvir gravação'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleReRecord}
              className="flex-1 px-5 sm:px-6 py-3 rounded-xl border border-warm-gray-light/50 text-warm-gray hover:bg-warm-gray/10 active:scale-95 transition-all font-medium cursor-pointer touch-target"
            >
              Regravar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-5 sm:px-6 py-3 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark active:scale-95 transition-all font-medium cursor-pointer touch-target"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* Step: Cloning */}
      {step === 'cloning' && (
        <div className="animate-fade-up text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin mx-auto mb-5 sm:mb-6" />
          <h2 className="font-display text-xl sm:text-2xl text-ink mb-2">Clonando sua voz...</h2>
          <p className="text-warm-gray text-xs sm:text-sm">Isso pode levar alguns segundos</p>
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && (
        <div className="animate-fade-up text-center w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-warm-gray-light/30 mb-6 sm:mb-8">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎉</div>
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-3 sm:mb-4">Voz clonada!</h2>
            <p className="text-warm-gray mb-4 sm:mb-6 text-sm sm:text-base">
              Ouça como você soa em italiano:
            </p>
            <p className="font-display text-2xl sm:text-3xl text-terracotta italic">
              "Ciao, sono io!"
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
            Começar a usar o CAPISCO
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
