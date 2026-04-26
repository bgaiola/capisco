import { useCallback, useEffect, useRef, useState } from 'react'
import MicButton from './MicButton'
import AudioVisualizer from './AudioVisualizer'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { translateText } from '../services/claude'
import { synthesizeSpeech, speakWithFallback } from '../services/elevenlabs'
import { findLang, type Language } from '../types/languages'
import type { UIStrings } from '../i18n/strings'
import type {
  ConversationPartner,
  ConversationSpeaker,
  ConversationTurn,
  TranslationStep,
  VoiceProfile,
} from '../types'

interface ConversationModeProps {
  myLanguage: Language
  myVoice: VoiceProfile | null
  partner: ConversationPartner | null
  partnerLanguage: Language | null
  conversation: ConversationTurn[]
  setConversation: React.Dispatch<React.SetStateAction<ConversationTurn[]>>
  onAddPartner: () => void
  onChangePartner: () => void
  onSetUpMyVoice: () => void
  strings: UIStrings
}

export default function ConversationMode({
  myLanguage,
  myVoice,
  partner,
  partnerLanguage,
  conversation,
  setConversation,
  onAddPartner,
  onChangePartner,
  onSetUpMyVoice,
  strings: t,
}: ConversationModeProps) {
  const [activeSpeaker, setActiveSpeaker] = useState<ConversationSpeaker>('me')
  const [step, setStep] = useState<TranslationStep>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)

  // Speech recognition language follows whoever is the active speaker
  const recognitionLang =
    activeSpeaker === 'me' ? myLanguage.speechCode : partnerLanguage?.speechCode ?? myLanguage.speechCode

  const {
    isListening,
    transcript,
    error: speechError,
    errorCode: speechErrorCode,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition(recognitionLang)
  const { isPlaying, play } = useAudioPlayer()

  const localizedSpeechError = (() => {
    switch (speechErrorCode) {
      case 'unsupported':
        return t.speechNotSupported
      case 'no-speech':
        return t.noSpeechDetected
      case 'not-allowed':
        return t.micPermissionDenied
      case 'other':
        return speechError
      default:
        return null
    }
  })()

  // ===== Pre-conditions: voice / partner not set =====

  if (!myVoice) {
    return (
      <div className="flex flex-col items-center text-center pt-8 pb-4 animate-fade-up">
        <div className="text-5xl mb-4 animate-float-soft">🎙️</div>
        <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">{t.conversationModeTitle}</h2>
        <p className="text-warm-gray max-w-sm leading-relaxed mb-2">{t.conversationIntro}</p>
        <p className="text-terracotta text-sm font-medium mt-4 mb-3">{t.needYourVoiceFirst}</p>
        <button
          onClick={onSetUpMyVoice}
          className="px-6 py-3.5 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark active:scale-95 transition-all font-medium cursor-pointer touch-target shadow-[0_10px_24px_-12px_rgba(196,96,58,0.6)]"
        >
          {t.setUpYourVoice}
        </button>
      </div>
    )
  }

  if (!partner || !partnerLanguage) {
    return (
      <div className="flex flex-col items-center text-center pt-8 pb-4 animate-fade-up">
        <div className="text-5xl mb-4 animate-float-soft">👥</div>
        <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">{t.conversationModeTitle}</h2>
        <p className="text-warm-gray max-w-sm leading-relaxed mb-6">{t.conversationIntro}</p>

        {/* Mini tutorial card */}
        <div className="w-full glass-card rounded-2xl p-4 sm:p-5 mb-6 text-left">
          {t.conversationTutorialSteps.map((s, i) => (
            <div key={i} className={`flex items-start gap-3 ${i > 0 ? 'mt-3 pt-3 border-t border-warm-gray-light/20' : ''}`}>
              <div className="text-2xl shrink-0 w-9 h-9 rounded-lg bg-terracotta/10 flex items-center justify-center">
                {s.emoji}
              </div>
              <div className="min-w-0">
                <p className="font-display text-base text-ink leading-tight">{s.title}</p>
                <p className="text-xs text-warm-gray mt-0.5 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onAddPartner}
          className="w-full max-w-xs px-6 py-3.5 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark active:scale-95 transition-all font-medium cursor-pointer touch-target shadow-[0_10px_24px_-12px_rgba(196,96,58,0.6)]"
        >
          {t.addPartnerCta}
        </button>
      </div>
    )
  }

  // ===== Active conversation =====
  return (
    <ActiveConversation
      myLanguage={myLanguage}
      myVoice={myVoice}
      partner={partner}
      partnerLanguage={partnerLanguage}
      conversation={conversation}
      setConversation={setConversation}
      onChangePartner={onChangePartner}
      strings={t}
      activeSpeaker={activeSpeaker}
      setActiveSpeaker={setActiveSpeaker}
      step={step}
      setStep={setStep}
      errorMsg={errorMsg}
      setErrorMsg={setErrorMsg}
      usedFallback={usedFallback}
      setUsedFallback={setUsedFallback}
      isListening={isListening}
      transcript={transcript}
      localizedSpeechError={localizedSpeechError}
      startListening={startListening}
      stopListening={stopListening}
      resetTranscript={resetTranscript}
      isPlaying={isPlaying}
      play={play}
    />
  )
}

// Split out so the hooks above (useSpeechRecognition) only run when conversation is active.
interface ActiveProps extends Required<Omit<ConversationModeProps, 'partner' | 'partnerLanguage' | 'onAddPartner' | 'onSetUpMyVoice' | 'myVoice'>> {
  partner: ConversationPartner
  partnerLanguage: Language
  myVoice: VoiceProfile
  activeSpeaker: ConversationSpeaker
  setActiveSpeaker: React.Dispatch<React.SetStateAction<ConversationSpeaker>>
  step: TranslationStep
  setStep: React.Dispatch<React.SetStateAction<TranslationStep>>
  errorMsg: string | null
  setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>
  usedFallback: boolean
  setUsedFallback: React.Dispatch<React.SetStateAction<boolean>>
  isListening: boolean
  transcript: string
  localizedSpeechError: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  isPlaying: boolean
  play: (src: string | Blob) => void
}

function ActiveConversation({
  myLanguage,
  myVoice,
  partner,
  partnerLanguage,
  conversation,
  setConversation,
  onChangePartner,
  strings: t,
  activeSpeaker,
  setActiveSpeaker,
  step,
  setStep,
  errorMsg,
  setErrorMsg,
  usedFallback,
  setUsedFallback,
  isListening,
  transcript,
  localizedSpeechError,
  startListening,
  stopListening,
  resetTranscript,
  isPlaying,
  play,
}: ActiveProps) {
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new turns
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [conversation.length, step])

  const speakerLanguage = activeSpeaker === 'me' ? myLanguage : partnerLanguage
  const speakerVoice = activeSpeaker === 'me' ? myVoice : partner
  const targetLanguage = activeSpeaker === 'me' ? partnerLanguage : myLanguage

  const processTurn = useCallback(
    async (text: string) => {
      if (!text.trim()) return
      const speaker = activeSpeaker
      const fromLang = speaker === 'me' ? myLanguage : partnerLanguage
      const toLang = speaker === 'me' ? partnerLanguage : myLanguage
      const voice = speaker === 'me' ? myVoice : partner

      setErrorMsg(null)
      setUsedFallback(false)

      try {
        setStep('translating')
        const result = await translateText(text, fromLang.code, toLang.code)

        const turn: ConversationTurn = {
          id: Date.now().toString(),
          speaker,
          originalText: text,
          translatedText: result.traducao,
          timestamp: Date.now(),
        }

        setConversation((prev) => [...prev, turn])

        setStep('synthesizing')
        try {
          const audioBlob = await synthesizeSpeech(result.traducao, voice.voiceId)
          turn.audioUrl = URL.createObjectURL(audioBlob)
          setStep('playing')
          play(audioBlob)
        } catch {
          setUsedFallback(true)
          setStep('playing')
          try {
            await speakWithFallback(result.traducao, toLang.ttsCode)
          } catch {
            // even fallback failed
          }
        }

        setStep('done')
        // Auto-flip to the other speaker for the reply
        setActiveSpeaker(speaker === 'me' ? 'partner' : 'me')
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
        setStep('error')
      }
    },
    [activeSpeaker, myLanguage, partnerLanguage, myVoice, partner, play, setConversation, setActiveSpeaker, setStep, setErrorMsg, setUsedFallback],
  )

  // When listening ends with a transcript, kick off translation
  useEffect(() => {
    if (!isListening && transcript && (step === 'transcribing' || step === 'recording')) {
      processTurn(transcript)
    }
  }, [isListening, transcript, step, processTurn])

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
      setStep('transcribing')
    } else {
      resetTranscript()
      setErrorMsg(null)
      setStep('recording')
      startListening()
    }
  }

  const handleSpeakerSelect = (speaker: ConversationSpeaker) => {
    if (isListening) stopListening()
    setActiveSpeaker(speaker)
    resetTranscript()
    setStep('idle')
  }

  const handleReplay = (turn: ConversationTurn) => {
    if (turn.audioUrl) {
      play(turn.audioUrl)
      return
    }
    const voice = turn.speaker === 'me' ? myVoice : partner
    const targetLang = turn.speaker === 'me' ? partnerLanguage : myLanguage
    synthesizeSpeech(turn.translatedText, voice.voiceId)
      .then((blob) => play(blob))
      .catch(() => speakWithFallback(turn.translatedText, targetLang.ttsCode))
  }

  const handleClear = () => {
    if (window.confirm(t.confirmClearConversation)) {
      setConversation([])
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Speaker toggle pills */}
      <div className="glass-card rounded-2xl p-2 mb-4">
        <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider text-center mb-2 mt-1">
          {t.tapWhoSpeaks}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <SpeakerPill
            flag={myLanguage.flag}
            name={t.you}
            language={myLanguage.label}
            active={activeSpeaker === 'me'}
            disabled={isListening && activeSpeaker !== 'me'}
            onClick={() => handleSpeakerSelect('me')}
          />
          <SpeakerPill
            flag={partnerLanguage.flag}
            name={partner.name || t.partner}
            language={partnerLanguage.label}
            active={activeSpeaker === 'partner'}
            disabled={isListening && activeSpeaker !== 'partner'}
            onClick={() => handleSpeakerSelect('partner')}
          />
        </div>
      </div>

      {/* Chat history */}
      <div className="flex-1 mb-4">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-3xl mb-3 opacity-60">💬</div>
            <p className="font-display text-lg text-ink">{t.noExchangesYet}</p>
            <p className="text-xs sm:text-sm text-warm-gray mt-2 max-w-xs">{t.noExchangesHint}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversation.map((turn) => (
              <ChatBubble
                key={turn.id}
                turn={turn}
                myLanguage={myLanguage}
                partnerLanguage={partnerLanguage}
                onReplay={() => handleReplay(turn)}
              />
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Status / errors */}
      {step !== 'idle' && step !== 'done' && step !== 'error' && (
        <StatusLine step={step} t={t} />
      )}

      {(step === 'recording' || (step === 'playing' && isPlaying)) && (
        <div className="w-full mb-3">
          <AudioVisualizer isActive={true} level={0.6} />
        </div>
      )}

      {transcript && step === 'recording' && (
        <p className="text-warm-gray text-center italic mb-3 text-sm animate-fade-up px-2">
          "{transcript}"
        </p>
      )}

      {localizedSpeechError && (
        <p className="text-red-500 text-xs sm:text-sm text-center mb-3">{localizedSpeechError}</p>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 animate-fade-up">
          <p className="text-red-600 text-xs sm:text-sm">❌ {errorMsg}</p>
        </div>
      )}
      {usedFallback && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 mb-3 animate-fade-up">
          <p className="text-gold text-xs sm:text-sm">⚠️ {t.fallbackWarning}</p>
        </div>
      )}

      {/* Big mic + footer actions */}
      <div className="flex flex-col items-center mt-2 mb-2">
        <p className="font-mono text-[10px] text-terracotta uppercase tracking-wider mb-2">
          {activeSpeaker === 'me' ? t.yourTurn : t.partnersTurn} · {speakerLanguage.flag} {speakerLanguage.label}
        </p>
        <MicButton
          isActive={isListening}
          onClick={handleMicClick}
          disabled={step === 'translating' || step === 'synthesizing'}
          size="lg"
        />
        <p className="text-xs sm:text-sm text-warm-gray mt-3 text-center max-w-xs">
          {isListening
            ? t.listening
            : `${speakerVoice.name || (activeSpeaker === 'me' ? t.you : t.partner)} → ${targetLanguage.flag} ${targetLanguage.label}`}
        </p>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-warm-gray-light/20">
        <button
          onClick={onChangePartner}
          className="text-xs text-warm-gray hover:text-terracotta transition-colors cursor-pointer"
        >
          {t.changePartner}
        </button>
        {conversation.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-warm-gray hover:text-red-500 transition-colors cursor-pointer"
          >
            {t.clearConversation}
          </button>
        )}
      </div>
    </div>
  )
}

function SpeakerPill({
  flag,
  name,
  language,
  active,
  disabled,
  onClick,
}: {
  flag: string
  name: string
  language: string
  active: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all touch-target text-left cursor-pointer ${
        active
          ? 'bg-terracotta text-white shadow-[0_8px_20px_-12px_rgba(196,96,58,0.7)]'
          : 'bg-white/40 text-ink hover:bg-white/70'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <span className="text-2xl shrink-0">{flag}</span>
      <div className="min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        <p className={`text-[10px] truncate ${active ? 'text-white/80' : 'text-warm-gray'}`}>{language}</p>
      </div>
    </button>
  )
}

function ChatBubble({
  turn,
  myLanguage,
  partnerLanguage,
  onReplay,
}: {
  turn: ConversationTurn
  myLanguage: Language
  partnerLanguage: Language
  onReplay: () => void
}) {
  const fromMe = turn.speaker === 'me'
  const fromLang = fromMe ? myLanguage : partnerLanguage
  const toLang = fromMe ? partnerLanguage : myLanguage

  return (
    <div className={`flex ${fromMe ? 'justify-end' : 'justify-start'} animate-fade-up`}>
      <div className={`max-w-[85%] ${fromMe ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 ${
            fromMe
              ? 'bg-terracotta text-white rounded-br-sm'
              : 'glass-card text-ink rounded-bl-sm'
          }`}
        >
          <p className={`text-[10px] font-mono uppercase tracking-wider ${fromMe ? 'text-white/70' : 'text-warm-gray'}`}>
            {fromLang.flag} {fromLang.label}
          </p>
          <p className={`text-sm sm:text-base mt-0.5 ${fromMe ? 'text-white' : 'text-ink'}`}>
            {turn.originalText}
          </p>
          <div className={`mt-1.5 pt-1.5 border-t ${fromMe ? 'border-white/20' : 'border-warm-gray-light/30'}`}>
            <p className={`text-[10px] font-mono uppercase tracking-wider ${fromMe ? 'text-white/70' : 'text-terracotta'}`}>
              {toLang.flag} {toLang.label}
            </p>
            <p className={`font-display italic text-base sm:text-lg leading-snug mt-0.5 ${fromMe ? 'text-white' : 'text-ink'}`}>
              {turn.translatedText}
            </p>
          </div>
        </div>
        <button
          onClick={onReplay}
          className={`mt-1 inline-flex items-center gap-1 text-[10px] ${
            fromMe ? 'text-warm-gray' : 'text-warm-gray'
          } hover:text-terracotta transition-colors cursor-pointer`}
          aria-label="Replay"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          replay
        </button>
      </div>
    </div>
  )
}

function StatusLine({ step, t }: { step: TranslationStep; t: UIStrings }) {
  const labels: Record<TranslationStep, string> = {
    idle: '',
    recording: `🎙️ ${t.recording}`,
    transcribing: `📝 ${t.transcribing}`,
    translating: `🔄 ${t.translating}`,
    synthesizing: `🎵 ${t.synthesizing}`,
    playing: `🔊 ${t.playingStatus}`,
    done: '',
    error: `❌ ${t.errorStatus}`,
  }
  if (!labels[step]) return null
  return (
    <div className="flex items-center justify-center mb-3 animate-fade-up">
      <span className="font-mono text-xs px-3 py-1.5 rounded-full bg-terracotta/10 text-terracotta">
        {labels[step]}
      </span>
    </div>
  )
}

// Helper to find a Language by speech code (kept here so the conversation
// component can resolve a partner's language without going through props).
export function languageFromSpeechCode(speechCode: string): Language | null {
  return findLang(speechCode) ?? null
}
