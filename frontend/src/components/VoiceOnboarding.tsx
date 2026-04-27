import { useState, useMemo } from 'react'
import { useMediaRecorder } from '../hooks/useMediaRecorder'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { cloneVoice, synthesizeSpeech } from '../services/elevenlabs'
import AudioVisualizer from './AudioVisualizer'
import MicButton from './MicButton'
import type { Language } from '../types/languages'
import type { UIStrings } from '../i18n/strings'
import { pickSampleText, PREVIEW_PHRASES } from '../i18n/sampleTexts'

interface VoiceOnboardingProps {
  onComplete: (voiceId: string) => void
  onSkip: () => void
  targetLang: Language
  nativeLang: Language
  strings: UIStrings
}

type OnboardingStep = 'intro' | 'recording' | 'review' | 'cloning' | 'preview'

export default function VoiceOnboarding({
  onComplete,
  onSkip,
  targetLang,
  nativeLang,
  strings: t,
}: VoiceOnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('intro')
  const [error, setError] = useState<string | null>(null)
  const [voiceId, setVoiceId] = useState<string | null>(null)
  const [sampleSeed, setSampleSeed] = useState(0)

  // Pick a fresh sample text for each onboarding session.
  const sampleText = useMemo(
    () => pickSampleText(nativeLang.code),
    // sampleSeed forces a re-pick when the user re-records
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nativeLang.code, sampleSeed],
  )

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
    setSampleSeed((s) => s + 1)
    setStep('intro')
  }

  const handleConfirm = async () => {
    if (!audioBlob) return
    setStep('cloning')
    setError(null)

    try {
      const result = await cloneVoice(audioBlob, { label: 'self' })
      setVoiceId(result.voiceId)

      const previewPhrase = PREVIEW_PHRASES[targetLang.code] ?? "Hello, it's me!"
      setStep('preview')
      try {
        const audioData = await synthesizeSpeech(previewPhrase, result.voiceId)
        play(audioData)
      } catch {
        // Preview failed but clone succeeded
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voice cloning error')
      setStep('review')
    }
  }

  const handleFinish = () => {
    if (voiceId) onComplete(voiceId)
  }

  const previewPhrase = PREVIEW_PHRASES[targetLang.code] ?? "Hello, it's me!"

  return (
    <div className="h-full overflow-y-auto overscroll-contain flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 max-w-lg mx-auto safe-top safe-bottom">
      <h1 className="font-display text-4xl sm:text-5xl text-ink mb-1 sm:mb-2 tracking-tight mt-4 sm:mt-0">
        CAPPISCO
      </h1>
      <p className="font-mono text-xs sm:text-sm text-warm-gray mb-8 sm:mb-12">{t.voiceSetupTagline}</p>

      {step === 'intro' && (
        <div className="animate-fade-up text-center w-full">
          <div className="glass-card rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8">
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-3 sm:mb-4">
              {t.letsCloneYourVoice}
            </h2>
            <p className="text-warm-gray leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              {t.readBelowOutLoud}{' '}
              <strong className="text-terracotta">{t.needAtLeast30s}</strong>
            </p>
            <div className="bg-crema/70 rounded-xl p-4 sm:p-6 text-left max-h-48 sm:max-h-60 overflow-y-auto border border-warm-gray-light/20">
              <p className="font-body text-ink leading-relaxed text-sm whitespace-pre-line">
                {sampleText}
              </p>
            </div>
          </div>

          <MicButton isActive={false} onClick={handleStartRecording} size="lg" />
          <p className="text-xs sm:text-sm text-warm-gray mt-4">{t.tapToStartRecording}</p>

          <button
            onClick={onSkip}
            className="mt-6 text-xs sm:text-sm text-warm-gray/60 underline underline-offset-4 hover:text-warm-gray transition-colors cursor-pointer"
          >
            {t.skipUseSystemVoice}
          </button>
        </div>
      )}

      {step === 'recording' && (
        <div className="animate-fade-up text-center w-full">
          <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="font-body text-ink leading-relaxed text-xs sm:text-sm mb-4 sm:mb-6 max-h-32 sm:max-h-48 overflow-y-auto whitespace-pre-line">
              {sampleText}
            </p>
          </div>

          <AudioVisualizer isActive={isRecording} level={audioLevel} />

          <div className="mt-3 sm:mt-4 mb-4 sm:mb-6">
            <span className="font-mono text-2xl sm:text-3xl text-ink">{formatDuration(duration)}</span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  duration >= 30 ? 'bg-green-500' : 'bg-terracotta animate-pulse'
                }`}
              />
              <span className="text-xs sm:text-sm text-warm-gray">
                {duration >= 30 ? t.enoughTime : t.minimum30s}
              </span>
            </div>
          </div>

          <MicButton isActive={true} onClick={handleStopRecording} size="lg" />
          <p className="text-xs sm:text-sm text-warm-gray mt-4">{t.tapToStop}</p>
        </div>
      )}

      {step === 'review' && (
        <div className="animate-fade-up text-center w-full">
          <div className="glass-card rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8">
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-3 sm:mb-4">{t.recordingComplete}</h2>
            <p className="text-warm-gray mb-4">
              {t.durationLabel}: <strong className="font-mono">{formatDuration(duration)}</strong>
            </p>

            {duration < 30 && (
              <p className="text-terracotta text-sm mb-4">⚠️ {t.recommend30s}</p>
            )}

            {error && <p className="text-red-500 text-sm mb-4">❌ {error}</p>}

            {audioBlob && (
              <button
                onClick={() => play(audioBlob)}
                className="flex items-center gap-2 mx-auto px-4 py-2 rounded-full bg-warm-gray/10 text-warm-gray hover:bg-warm-gray/20 transition-colors text-sm font-medium cursor-pointer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {isPlaying ? t.playing : t.listenToRecording}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleReRecord}
              className="flex-1 px-5 sm:px-6 py-3 rounded-xl border border-warm-gray-light/50 text-warm-gray hover:bg-warm-gray/10 active:scale-95 transition-all font-medium cursor-pointer touch-target"
            >
              {t.reRecord}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-5 sm:px-6 py-3 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark active:scale-95 transition-all font-medium cursor-pointer touch-target shadow-[0_10px_24px_-12px_rgba(196,96,58,0.6)]"
            >
              {t.confirm}
            </button>
          </div>
        </div>
      )}

      {step === 'cloning' && (
        <div className="animate-fade-up text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin mx-auto mb-5 sm:mb-6" />
          <h2 className="font-display text-xl sm:text-2xl text-ink mb-2">{t.cloningVoice}</h2>
          <p className="text-warm-gray text-xs sm:text-sm">{t.cloningTakesAFewSeconds}</p>
        </div>
      )}

      {step === 'preview' && (
        <div className="animate-fade-up text-center w-full">
          <div className="glass-card rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 animate-float-soft">🎉</div>
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-3 sm:mb-4">{t.voiceCloned}</h2>
            <p className="text-warm-gray mb-4 sm:mb-6 text-sm sm:text-base">
              {t.hearYourVoiceIn(targetLang.label)}
            </p>
            <p className="font-display text-2xl sm:text-3xl text-terracotta italic">
              "{previewPhrase}"
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
            <p className="font-mono text-[10px] text-warm-gray mt-5">{t.voiceSavedOnThisDevice}</p>
          </div>

          <button
            onClick={handleFinish}
            className="w-full px-6 py-4 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark active:scale-95 transition-all font-medium text-base sm:text-lg cursor-pointer touch-target shadow-[0_10px_30px_-12px_rgba(196,96,58,0.6)]"
          >
            {t.startUsing}
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
