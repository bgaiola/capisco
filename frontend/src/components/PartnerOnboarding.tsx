import { useMemo, useState } from 'react'
import { useMediaRecorder } from '../hooks/useMediaRecorder'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { cloneVoice } from '../services/elevenlabs'
import AudioVisualizer from './AudioVisualizer'
import MicButton from './MicButton'
import LanguagePicker from './LanguagePicker'
import { langKey, type Language } from '../types/languages'
import type { UIStrings } from '../i18n/strings'
import { pickSampleText } from '../i18n/sampleTexts'
import type { ConversationPartner } from '../types'

interface PartnerOnboardingProps {
  /** The user's own native language so we exclude it from the partner picker by default. */
  myLanguage: Language
  /** Pre-selected partner language (e.g. user's current target). User can still change it. */
  defaultPartnerLanguage?: Language
  onComplete: (partner: ConversationPartner) => void
  onCancel: () => void
  strings: UIStrings
}

type Step = 'language' | 'intro' | 'recording' | 'review' | 'cloning'

export default function PartnerOnboarding({
  myLanguage,
  defaultPartnerLanguage,
  onComplete,
  onCancel,
  strings: t,
}: PartnerOnboardingProps) {
  const [partnerLang, setPartnerLang] = useState<Language | null>(
    defaultPartnerLanguage && langKey(defaultPartnerLanguage) !== langKey(myLanguage)
      ? defaultPartnerLanguage
      : null,
  )
  const [step, setStep] = useState<Step>(partnerLang ? 'intro' : 'language')
  const [error, setError] = useState<string | null>(null)
  const [sampleSeed, setSampleSeed] = useState(0)

  const sampleText = useMemo(
    () => (partnerLang ? pickSampleText(partnerLang.code) : ''),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [partnerLang?.code, sampleSeed],
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
    if (!audioBlob || !partnerLang) return
    setStep('cloning')
    setError(null)

    try {
      const result = await cloneVoice(audioBlob, {
        label: 'partner',
        langSpeechCode: partnerLang.speechCode,
      })
      const partner: ConversationPartner = {
        voiceId: result.voiceId,
        name: t.partner,
        langSpeechCode: partnerLang.speechCode,
        createdAt: Date.now(),
      }
      onComplete(partner)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voice cloning error')
      setStep('review')
    }
  }

  return (
    <div className="h-full overflow-y-auto overscroll-contain flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 max-w-lg mx-auto safe-top safe-bottom">
      <h1 className="font-display text-4xl sm:text-5xl text-ink mb-1 sm:mb-2 tracking-tight mt-4 sm:mt-0">
        CAPPISCO
      </h1>
      <p className="font-mono text-xs sm:text-sm text-warm-gray mb-6 sm:mb-10">{t.partnerSetupTagline}</p>

      {/* Cancel link */}
      <div className="w-full flex justify-start mb-3">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1 text-xs sm:text-sm text-warm-gray hover:text-terracotta transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t.close}
        </button>
      </div>

      {step === 'language' && (
        <div className="animate-fade-up text-center w-full">
          <div className="glass-card rounded-2xl p-5 sm:p-7 mb-5">
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-2">
              {t.pickPartnerLanguage}
            </h2>
            <p className="text-warm-gray text-sm leading-relaxed mb-4">{t.partnerLanguageHint}</p>

            <LanguagePicker
              selected={partnerLang}
              onSelect={(lang) => {
                setPartnerLang(lang)
                setStep('intro')
              }}
              exclude={[langKey(myLanguage)]}
            />
          </div>
        </div>
      )}

      {step === 'intro' && partnerLang && (
        <div className="animate-fade-up text-center w-full">
          <button
            onClick={() => setStep('language')}
            className="text-xs font-mono text-terracotta hover:text-terracotta-dark mb-3 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-base">{partnerLang.flag}</span>
            <span>{partnerLang.label}</span>
            <span className="text-warm-gray ml-1">({t.swapLanguages.toLowerCase()})</span>
          </button>

          <div className="glass-card rounded-2xl p-5 sm:p-7 mb-6">
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-3">
              {t.letsCloneYourVoice} — {t.partner}
            </h2>
            <p className="text-warm-gray leading-relaxed mb-4 text-sm sm:text-base">
              {t.havePartnerRead}
            </p>
            <div className="bg-crema/70 rounded-xl p-4 sm:p-5 text-left max-h-56 overflow-y-auto border border-warm-gray-light/20">
              <p className="font-body text-ink leading-relaxed text-sm whitespace-pre-line">{sampleText}</p>
            </div>
          </div>

          <MicButton isActive={false} onClick={handleStartRecording} size="lg" />
          <p className="text-xs sm:text-sm text-warm-gray mt-4">{t.tapToStartRecording}</p>
        </div>
      )}

      {step === 'recording' && partnerLang && (
        <div className="animate-fade-up text-center w-full">
          <p className="text-xs font-mono text-terracotta mb-3 inline-flex items-center gap-1.5">
            <span className="text-base">{partnerLang.flag}</span>
            <span>{partnerLang.label}</span>
          </p>

          <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6">
            <p className="font-body text-ink leading-relaxed text-xs sm:text-sm max-h-32 sm:max-h-48 overflow-y-auto whitespace-pre-line">
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
          <div className="glass-card rounded-2xl p-5 sm:p-7 mb-6">
            <h2 className="font-display text-xl sm:text-2xl text-ink mb-3">{t.recordingComplete}</h2>
            <p className="text-warm-gray mb-4">
              {t.durationLabel}: <strong className="font-mono">{formatDuration(duration)}</strong>
            </p>

            {duration < 30 && <p className="text-terracotta text-sm mb-4">⚠️ {t.recommend30s}</p>}
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
          <h2 className="font-display text-xl sm:text-2xl text-ink mb-2">{t.cloningPartnerVoice}</h2>
          <p className="text-warm-gray text-xs sm:text-sm">{t.cloningTakesAFewSeconds}</p>
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
