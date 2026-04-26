import { useState, useEffect, useCallback, useMemo } from 'react'
import VoiceOnboarding from './components/VoiceOnboarding'
import PartnerOnboarding from './components/PartnerOnboarding'
import LanguageSelector from './components/LanguageSelector'
import MicButton from './components/MicButton'
import TranscriptCard from './components/TranscriptCard'
import AudioVisualizer from './components/AudioVisualizer'
import HistoryList from './components/HistoryList'
import ConversationMode from './components/ConversationMode'
import HelpModal from './components/HelpModal'
import HelpButton from './components/HelpButton'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { translateText } from './services/claude'
import { synthesizeSpeech, speakWithFallback } from './services/elevenlabs'
import {
  findLang,
  loadLanguagePair,
  saveLanguagePair,
  hasStoredLanguagePair,
  type LanguagePair,
} from './types/languages'
import {
  loadVoiceProfile,
  saveVoiceProfile,
  clearVoiceProfile,
  markVoiceSkipped,
  wasVoiceSkipped,
  loadHistory,
  saveHistory,
  loadPartner,
  savePartner,
  clearPartner,
  loadConversation,
  saveConversation,
  hasSeenTutorial,
  markTutorialSeen,
} from './services/voiceStorage'
import { getStrings } from './i18n/strings'
import type {
  Translation,
  AppTab,
  TranslationStep,
  VoiceProfile,
  ConversationPartner,
  ConversationTurn,
} from './types'

function App() {
  const [langPair, setLangPair] = useState<LanguagePair>(loadLanguagePair)
  const [showLangSelector, setShowLangSelector] = useState(() => !hasStoredLanguagePair())
  const t = useMemo(() => getStrings(langPair.native.code), [langPair.native.code])

  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPartnerOnboarding, setShowPartnerOnboarding] = useState(false)

  const [partner, setPartner] = useState<ConversationPartner | null>(null)
  const [conversation, setConversation] = useState<ConversationTurn[]>([])

  const [activeTab, setActiveTab] = useState<AppTab>('voice')
  const [helpOpen, setHelpOpen] = useState(false)

  const [step, setStep] = useState<TranslationStep>('idle')
  const [currentTranslation, setCurrentTranslation] = useState<Translation | null>(null)
  const [textInput, setTextInput] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)

  const [history, setHistory] = useState<Translation[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)

  const {
    isListening,
    transcript,
    error: speechError,
    errorCode: speechErrorCode,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition(langPair.native.speechCode)
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

  // Restore persisted state once
  useEffect(() => {
    setVoiceProfile(loadVoiceProfile())
    setHistory(loadHistory<Translation>())
    setPartner(loadPartner())
    setConversation(loadConversation())
  }, [])

  useEffect(() => {
    if (!showLangSelector) {
      const profile = loadVoiceProfile()
      if (!profile && !wasVoiceSkipped()) setShowOnboarding(true)
    }
  }, [showLangSelector])

  useEffect(() => {
    if (history.length > 0) saveHistory(history)
  }, [history])

  useEffect(() => {
    saveConversation(conversation)
  }, [conversation])

  // Auto-open the help modal first time the user visits each mode
  useEffect(() => {
    if (showLangSelector || showOnboarding || showPartnerOnboarding) return
    const tutKey = `tab_${activeTab}`
    if (!hasSeenTutorial(tutKey)) {
      // Avoid showing the help modal on the empty-history view (it has no tutorial)
      if (activeTab === 'history') {
        markTutorialSeen(tutKey)
        return
      }
      setHelpOpen(true)
      markTutorialSeen(tutKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, showLangSelector, showOnboarding, showPartnerOnboarding])

  const partnerLanguage = useMemo(
    () => (partner ? findLang(partner.langSpeechCode) ?? null : null),
    [partner],
  )

  const handleLangConfirm = (pair: LanguagePair) => {
    setLangPair(pair)
    saveLanguagePair(pair)
    setShowLangSelector(false)
  }

  const handleOnboardingComplete = (voiceId: string) => {
    const profile: VoiceProfile = {
      voiceId,
      name: 'CAPPISCO User',
      createdAt: Date.now(),
    }
    saveVoiceProfile(profile)
    setVoiceProfile(profile)
    setShowOnboarding(false)
  }

  const handleSkipOnboarding = () => {
    markVoiceSkipped()
    setVoiceProfile(null)
    setShowOnboarding(false)
  }

  const handleResetVoice = () => {
    clearVoiceProfile()
    setVoiceProfile(null)
    setShowOnboarding(true)
  }

  const handlePartnerComplete = (newPartner: ConversationPartner) => {
    savePartner(newPartner)
    setPartner(newPartner)
    setShowPartnerOnboarding(false)
  }

  const handleChangePartner = () => {
    if (!window.confirm(t.changePartner + '?')) return
    clearPartner()
    setPartner(null)
    setShowPartnerOnboarding(true)
  }

  const processTranslation = useCallback(
    async (text: string) => {
      if (!text.trim()) return
      setErrorMsg(null)
      setUsedFallback(false)
      setCurrentTranslation(null)

      try {
        setStep('translating')
        const result = await translateText(text, langPair.native.code, langPair.target.code)
        const translation: Translation = {
          id: Date.now().toString(),
          originalText: text,
          translatedText: result.traducao,
          notes: result.notas,
          timestamp: Date.now(),
        }
        setCurrentTranslation(translation)

        setStep('synthesizing')
        try {
          if (voiceProfile) {
            const audioBlob = await synthesizeSpeech(result.traducao, voiceProfile.voiceId)
            translation.audioUrl = URL.createObjectURL(audioBlob)
            setStep('playing')
            play(audioBlob)
          } else {
            setUsedFallback(true)
            setStep('playing')
            await speakWithFallback(result.traducao, langPair.target.ttsCode)
          }
        } catch {
          setUsedFallback(true)
          setStep('playing')
          try {
            await speakWithFallback(result.traducao, langPair.target.ttsCode)
          } catch {
            // even fallback failed
          }
        }

        setHistory((prev) => [translation, ...prev])
        setStep('done')
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
        setStep('error')
      }
    },
    [voiceProfile, play, langPair],
  )

  useEffect(() => {
    if (!isListening && transcript && (step === 'transcribing' || step === 'recording') && activeTab === 'voice') {
      processTranslation(transcript)
    }
  }, [isListening, transcript, step, processTranslation, activeTab])

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
      setStep('transcribing')
    } else {
      resetTranscript()
      setCurrentTranslation(null)
      setErrorMsg(null)
      setStep('recording')
      startListening()
    }
  }

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      processTranslation(textInput.trim())
      setTextInput('')
    }
  }

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleTextSubmit()
  }

  const handlePlayHistory = (translation: Translation) => {
    setPlayingId(translation.id)
    if (translation.audioUrl) {
      play(translation.audioUrl)
      setTimeout(() => setPlayingId(null), 3000)
    } else if (voiceProfile) {
      synthesizeSpeech(translation.translatedText, voiceProfile.voiceId)
        .then((blob) => {
          play(blob)
          setTimeout(() => setPlayingId(null), 3000)
        })
        .catch(() => {
          speakWithFallback(translation.translatedText, langPair.target.ttsCode).finally(() =>
            setPlayingId(null),
          )
        })
    } else {
      speakWithFallback(translation.translatedText, langPair.target.ttsCode).finally(() =>
        setPlayingId(null),
      )
    }
  }

  const handlePlayCurrent = () => {
    if (!currentTranslation) return
    if (currentTranslation.audioUrl) {
      play(currentTranslation.audioUrl)
    } else if (voiceProfile) {
      synthesizeSpeech(currentTranslation.translatedText, voiceProfile.voiceId)
        .then((blob) => play(blob))
        .catch(() => speakWithFallback(currentTranslation.translatedText, langPair.target.ttsCode))
    } else {
      speakWithFallback(currentTranslation.translatedText, langPair.target.ttsCode)
    }
  }

  if (showLangSelector) {
    return <LanguageSelector pair={langPair} onConfirm={handleLangConfirm} strings={t} />
  }

  if (showOnboarding) {
    return (
      <VoiceOnboarding
        onComplete={handleOnboardingComplete}
        onSkip={handleSkipOnboarding}
        targetLang={langPair.target}
        nativeLang={langPair.native}
        strings={t}
      />
    )
  }

  if (showPartnerOnboarding) {
    return (
      <PartnerOnboarding
        myLanguage={langPair.native}
        defaultPartnerLanguage={langPair.target}
        onComplete={handlePartnerComplete}
        onCancel={() => setShowPartnerOnboarding(false)}
        strings={t}
      />
    )
  }

  const tabItems: { id: AppTab; label: string; icon: string }[] = [
    { id: 'voice', label: t.tabVoice, icon: '🎤' },
    { id: 'conversation', label: t.tabConversation, icon: '💬' },
    { id: 'text', label: t.tabText, icon: '✏️' },
    { id: 'history', label: t.tabHistory, icon: '📜' },
  ]

  const statusLabels: Record<TranslationStep, string> = {
    idle: '',
    recording: `🎙️ ${t.recording}`,
    transcribing: `📝 ${t.transcribing}`,
    translating: `🔄 ${t.translating}`,
    synthesizing: `🎵 ${t.synthesizing}`,
    playing: `🔊 ${t.playingStatus}`,
    done: `✅ ${t.done}`,
    error: `❌ ${t.errorStatus}`,
  }

  const tutorialFor = (tab: AppTab) => {
    switch (tab) {
      case 'voice':
        return { title: t.voiceTutorialTitle, steps: t.voiceTutorialSteps }
      case 'conversation':
        return { title: t.conversationTutorialTitle, steps: t.conversationTutorialSteps }
      case 'text':
        return { title: t.textTutorialTitle, steps: t.textTutorialSteps }
      default:
        return null
    }
  }
  const tutorial = tutorialFor(activeTab)

  return (
    <div className="h-full flex flex-col max-w-lg mx-auto relative">
      <header className="px-4 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 sm:pb-4 text-center shrink-0">
        <h1 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">CAPPISCO</h1>
        <button
          onClick={() => setShowLangSelector(true)}
          className="font-mono text-[10px] sm:text-xs text-warm-gray mt-0.5 hover:text-terracotta transition-colors cursor-pointer"
        >
          {langPair.native.flag} {langPair.native.label} → {langPair.target.flag} {langPair.target.label}
        </button>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${
              voiceProfile ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-warm-gray-light'
            }`}
          />
          <span className="font-mono text-[10px] text-warm-gray">
            {voiceProfile ? t.clonedVoice : t.systemVoice}
          </span>
          <button
            onClick={handleResetVoice}
            className="font-mono text-[10px] text-terracotta/60 hover:text-terracotta underline underline-offset-2 cursor-pointer ml-1"
          >
            {voiceProfile ? t.resetVoice : t.setUpVoice}
          </button>
        </div>
      </header>

      {/* Desktop tabs */}
      <nav className="hidden sm:flex px-6 gap-1 mb-6 shrink-0 items-center">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-3 rounded-xl font-body text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-terracotta text-white shadow-[0_8px_24px_-12px_rgba(196,96,58,0.6)]'
                : 'text-warm-gray hover:bg-warm-gray/10'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        {tutorial && (
          <div className="ml-1">
            <HelpButton onClick={() => setHelpOpen(true)} label={t.showHelp} />
          </div>
        )}
      </nav>

      {/* Mobile help button — top-right of content area */}
      {tutorial && (
        <div className="sm:hidden flex justify-end px-4 -mb-2 shrink-0">
          <HelpButton onClick={() => setHelpOpen(true)} label={t.showHelp} />
        </div>
      )}

      <main className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 pb-24 sm:pb-8">
        {activeTab === 'voice' && (
          <div className="flex flex-col items-center">
            <StatusBadge step={step} label={statusLabels[step]} />

            {(step === 'recording' || step === 'playing') && (
              <div className="w-full mb-4 sm:mb-6">
                <AudioVisualizer isActive={step === 'recording' || isPlaying} level={0.6} />
              </div>
            )}

            {transcript && step === 'recording' && (
              <p className="text-warm-gray text-center italic mb-4 sm:mb-6 text-sm sm:text-base animate-fade-up px-2">
                "{transcript}"
              </p>
            )}

            <div className="my-6 sm:my-8">
              <MicButton
                isActive={isListening}
                onClick={handleMicClick}
                disabled={step === 'translating' || step === 'synthesizing'}
                size="lg"
              />
            </div>

            <p className="text-xs sm:text-sm text-warm-gray text-center mb-6 sm:mb-8">
              {isListening
                ? t.listening
                : step === 'idle' || step === 'done' || step === 'error'
                  ? t.tapAndSpeak(langPair.native.label)
                  : ''}
            </p>

            {localizedSpeechError && (
              <p className="text-red-500 text-xs sm:text-sm text-center mb-4">{localizedSpeechError}</p>
            )}

            {errorMsg && (
              <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4 animate-fade-up">
                <p className="text-red-600 text-xs sm:text-sm">❌ {errorMsg}</p>
              </div>
            )}

            {usedFallback && (
              <div className="w-full bg-gold/10 border border-gold/30 rounded-xl p-3 sm:p-4 mb-4 animate-fade-up">
                <p className="text-gold text-xs sm:text-sm">⚠️ {t.fallbackWarning}</p>
              </div>
            )}

            {currentTranslation && (
              <div className="w-full">
                <TranscriptCard
                  translation={currentTranslation}
                  onPlayAudio={handlePlayCurrent}
                  isPlaying={isPlaying}
                  nativeLang={langPair.native}
                  targetLang={langPair.target}
                  strings={t}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'conversation' && (
          <ConversationMode
            myLanguage={langPair.native}
            myVoice={voiceProfile}
            partner={partner}
            partnerLanguage={partnerLanguage}
            conversation={conversation}
            setConversation={setConversation}
            onAddPartner={() => setShowPartnerOnboarding(true)}
            onChangePartner={handleChangePartner}
            onSetUpMyVoice={handleResetVoice}
            strings={t}
          />
        )}

        {activeTab === 'text' && (
          <div className="flex flex-col">
            <div className="glass-card rounded-2xl p-3 sm:p-4 mb-4">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleTextKeyDown}
                placeholder={t.typeAPhrase(langPair.native.label)}
                rows={3}
                className="w-full bg-transparent resize-none font-body text-ink placeholder-warm-gray-light focus:outline-none text-base sm:text-lg"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-warm-gray-light/20">
                <span className="text-[10px] sm:text-xs text-warm-gray-light font-mono hidden sm:inline">
                  {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
                </span>
                <button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim() || step === 'translating' || step === 'synthesizing'}
                  className="px-5 sm:px-6 py-2.5 sm:py-2 rounded-xl bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer sm:ml-auto w-full sm:w-auto touch-target shadow-[0_8px_20px_-12px_rgba(196,96,58,0.6)]"
                >
                  {t.translate}
                </button>
              </div>
            </div>

            {step !== 'idle' && step !== 'done' && step !== 'error' && (
              <StatusBadge step={step} label={statusLabels[step]} />
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4 animate-fade-up">
                <p className="text-red-600 text-xs sm:text-sm">❌ {errorMsg}</p>
              </div>
            )}

            {usedFallback && (
              <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 sm:p-4 mb-4 animate-fade-up">
                <p className="text-gold text-xs sm:text-sm">⚠️ {t.fallbackWarning}</p>
              </div>
            )}

            {currentTranslation && (
              <TranscriptCard
                translation={currentTranslation}
                onPlayAudio={handlePlayCurrent}
                isPlaying={isPlaying}
                nativeLang={langPair.native}
                targetLang={langPair.target}
                strings={t}
              />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryList
            translations={history}
            onPlay={handlePlayHistory}
            playingId={playingId}
            strings={t}
          />
        )}
      </main>

      {/* Mobile tab bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-crema/85 backdrop-blur-xl border-t border-warm-gray-light/20 safe-bottom z-50">
        <div className="flex max-w-lg mx-auto">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 pt-3 cursor-pointer transition-colors touch-target ${
                activeTab === tab.id ? 'text-terracotta' : 'text-warm-gray'
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-[10px] font-medium mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {tutorial && (
        <HelpModal
          open={helpOpen}
          onClose={() => setHelpOpen(false)}
          title={tutorial.title}
          steps={tutorial.steps}
          strings={t}
        />
      )}
    </div>
  )
}

function StatusBadge({ step, label }: { step: TranslationStep; label: string }) {
  if (step === 'idle' || !label) return null
  return (
    <div className="flex items-center justify-center mb-6 animate-fade-up">
      <span
        className={`font-mono text-sm px-4 py-2 rounded-full ${
          step === 'error'
            ? 'bg-red-50 text-red-600'
            : step === 'done'
              ? 'bg-green-50 text-green-700'
              : 'bg-terracotta/10 text-terracotta'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

export default App
