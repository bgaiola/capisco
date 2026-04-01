import { useState, useEffect, useCallback } from 'react'
import VoiceOnboarding from './components/VoiceOnboarding'
import MicButton from './components/MicButton'
import TranscriptCard from './components/TranscriptCard'
import AudioVisualizer from './components/AudioVisualizer'
import HistoryList from './components/HistoryList'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { translateText } from './services/claude'
import { synthesizeSpeech, speakWithFallback } from './services/elevenlabs'
import type { Translation, AppTab, TranslationStep, VoiceProfile } from './types'

function App() {
  // Voice profile
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(true)

  // Tabs
  const [activeTab, setActiveTab] = useState<AppTab>('voice')

  // Translation state
  const [step, setStep] = useState<TranslationStep>('idle')
  const [currentTranslation, setCurrentTranslation] = useState<Translation | null>(null)
  const [textInput, setTextInput] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)

  // History
  const [history, setHistory] = useState<Translation[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)

  // Hooks
  const { isListening, transcript, error: speechError, startListening, stopListening, resetTranscript } =
    useSpeechRecognition()
  const { isPlaying, play } = useAudioPlayer()

  // Load voice profile and history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('capisco_voice')
    if (saved) {
      try {
        const profile = JSON.parse(saved) as VoiceProfile
        setVoiceProfile(profile)
        setShowOnboarding(false)
      } catch {
        // Invalid data
      }
    }

    const savedHistory = localStorage.getItem('capisco_history')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch {
        // Invalid data
      }
    }

    // Check if user skipped onboarding
    if (!saved && localStorage.getItem('capisco_skipped_voice')) {
      setShowOnboarding(false)
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('capisco_history', JSON.stringify(history))
    }
  }, [history])

  const handleOnboardingComplete = (voiceId: string) => {
    const profile: VoiceProfile = {
      voiceId,
      name: 'CAPISCO User',
      createdAt: Date.now(),
    }
    setVoiceProfile(profile)
    setShowOnboarding(false)
  }

  const handleSkipOnboarding = () => {
    setVoiceProfile(null)
    setShowOnboarding(false)
    localStorage.setItem('capisco_skipped_voice', 'true')
  }

  const handleResetVoice = () => {
    setVoiceProfile(null)
    localStorage.removeItem('capisco_voice')
    localStorage.removeItem('capisco_skipped_voice')
    setShowOnboarding(true)
  }

  // Core translation flow
  const processTranslation = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      setErrorMsg(null)
      setUsedFallback(false)
      setCurrentTranslation(null)

      try {
        // Step 2: Translate
        setStep('translating')
        const result = await translateText(text)

        const translation: Translation = {
          id: Date.now().toString(),
          originalText: text,
          translatedText: result.traducao,
          notes: result.notas,
          timestamp: Date.now(),
        }

        setCurrentTranslation(translation)

        // Step 3: Synthesize
        setStep('synthesizing')
        try {
          if (voiceProfile) {
            const audioBlob = await synthesizeSpeech(result.traducao, voiceProfile.voiceId)
            translation.audioUrl = URL.createObjectURL(audioBlob)
            setStep('playing')
            play(audioBlob)
          } else {
            // No cloned voice — use Web Speech fallback
            setUsedFallback(true)
            setStep('playing')
            await speakWithFallback(result.traducao)
          }
        } catch {
          // Fallback to Web Speech Synthesis
          setUsedFallback(true)
          setStep('playing')
          try {
            await speakWithFallback(result.traducao)
          } catch {
            // Even fallback failed
          }
        }

        // Save to history
        setHistory((prev) => [translation, ...prev])
        setStep('done')
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Erro desconhecido')
        setStep('error')
      }
    },
    [voiceProfile, play],
  )

  // Handle voice mode: when speech recognition ends with a transcript
  useEffect(() => {
    if (!isListening && transcript && (step === 'transcribing' || step === 'recording')) {
      processTranslation(transcript)
    }
  }, [isListening, transcript, step, processTranslation])

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
      // step will transition via useEffect above when isListening becomes false
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
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleTextSubmit()
    }
  }

  const handlePlayHistory = (translation: Translation) => {
    setPlayingId(translation.id)

    if (translation.audioUrl) {
      play(translation.audioUrl)
      setTimeout(() => setPlayingId(null), 3000)
    } else if (voiceProfile) {
      // Re-synthesize with cloned voice
      synthesizeSpeech(translation.translatedText, voiceProfile.voiceId)
        .then((blob) => {
          play(blob)
          setTimeout(() => setPlayingId(null), 3000)
        })
        .catch(() => {
          speakWithFallback(translation.translatedText).finally(() => setPlayingId(null))
        })
    } else {
      speakWithFallback(translation.translatedText).finally(() => setPlayingId(null))
    }
  }

  const handlePlayCurrent = () => {
    if (!currentTranslation) return
    if (currentTranslation.audioUrl) {
      play(currentTranslation.audioUrl)
    } else if (voiceProfile) {
      synthesizeSpeech(currentTranslation.translatedText, voiceProfile.voiceId)
        .then((blob) => play(blob))
        .catch(() => speakWithFallback(currentTranslation.translatedText))
    } else {
      speakWithFallback(currentTranslation.translatedText)
    }
  }

  // Show onboarding if no voice profile
  if (showOnboarding) {
    return <VoiceOnboarding onComplete={handleOnboardingComplete} onSkip={handleSkipOnboarding} />
  }

  return (
    <div className="h-full flex flex-col max-w-lg mx-auto relative">
      {/* Header — compact on mobile */}
      <header className="px-4 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 sm:pb-4 text-center shrink-0">
        <h1 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">CAPISCO</h1>
        <p className="font-mono text-[10px] sm:text-xs text-warm-gray mt-0.5">português → italiano</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${voiceProfile ? 'bg-green-500' : 'bg-warm-gray-light'}`} />
          <span className="font-mono text-[10px] text-warm-gray">
            {voiceProfile ? 'Voz clonada ativa' : 'Voz do sistema'}
          </span>
          <button
            onClick={handleResetVoice}
            className="font-mono text-[10px] text-terracotta/60 hover:text-terracotta underline underline-offset-2 cursor-pointer ml-1"
          >
            {voiceProfile ? 'resetar' : 'configurar voz'}
          </button>
        </div>
      </header>

      {/* Tab Bar — top on desktop, bottom fixed on mobile */}
      <nav className="hidden sm:flex px-6 gap-1 mb-6 shrink-0">
        {[
          { id: 'voice' as AppTab, label: 'Voz', icon: '🎤' },
          { id: 'text' as AppTab, label: 'Texto', icon: '✏️' },
          { id: 'history' as AppTab, label: 'Histórico', icon: '📜' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-xl font-body text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-terracotta text-white shadow-sm'
                : 'text-warm-gray hover:bg-warm-gray/10'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content — scrollable area */}
      <main className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 pb-24 sm:pb-8">
        {/* ===== VOICE MODE ===== */}
        {activeTab === 'voice' && (
          <div className="flex flex-col items-center">
            {/* Status */}
            <StatusBadge step={step} />

            {/* Audio Visualizer */}
            {(step === 'recording' || step === 'playing') && (
              <div className="w-full mb-4 sm:mb-6">
                <AudioVisualizer isActive={step === 'recording' || isPlaying} level={0.6} />
              </div>
            )}

            {/* Transcript preview */}
            {transcript && step === 'recording' && (
              <p className="text-warm-gray text-center italic mb-4 sm:mb-6 text-sm sm:text-base animate-fade-up px-2">
                "{transcript}"
              </p>
            )}

            {/* Mic Button */}
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
                ? 'Ouvindo... toque para parar'
                : step === 'idle' || step === 'done' || step === 'error'
                  ? 'Toque no microfone e fale em português'
                  : ''}
            </p>

            {/* Speech Recognition Error */}
            {speechError && (
              <p className="text-red-500 text-xs sm:text-sm text-center mb-4">{speechError}</p>
            )}

            {/* Error */}
            {errorMsg && (
              <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4 animate-fade-up">
                <p className="text-red-600 text-xs sm:text-sm">❌ {errorMsg}</p>
              </div>
            )}

            {/* Fallback warning */}
            {usedFallback && (
              <div className="w-full bg-gold/10 border border-gold/30 rounded-xl p-3 sm:p-4 mb-4 animate-fade-up">
                <p className="text-gold text-xs sm:text-sm">
                  ⚠️ Não foi possível usar sua voz clonada. Usando voz do sistema.
                </p>
              </div>
            )}

            {/* Result */}
            {currentTranslation && (
              <div className="w-full">
                <TranscriptCard
                  translation={currentTranslation}
                  onPlayAudio={handlePlayCurrent}
                  isPlaying={isPlaying}
                />
              </div>
            )}
          </div>
        )}

        {/* ===== TEXT MODE ===== */}
        {activeTab === 'text' && (
          <div className="flex flex-col">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-warm-gray-light/30 p-3 sm:p-4 mb-4">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleTextKeyDown}
                placeholder="Digite uma frase em português..."
                rows={3}
                className="w-full bg-transparent resize-none font-body text-ink placeholder-warm-gray-light focus:outline-none text-base sm:text-lg"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-warm-gray-light/20">
                <span className="text-[10px] sm:text-xs text-warm-gray-light font-mono hidden sm:inline">
                  {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter para enviar
                </span>
                <button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim() || step === 'translating' || step === 'synthesizing'}
                  className="px-5 sm:px-6 py-2.5 sm:py-2 rounded-xl bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer sm:ml-auto w-full sm:w-auto touch-target"
                >
                  Traduzir
                </button>
              </div>
            </div>

            {/* Status */}
            {step !== 'idle' && step !== 'done' && step !== 'error' && <StatusBadge step={step} />}

            {/* Error */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4 animate-fade-up">
                <p className="text-red-600 text-xs sm:text-sm">❌ {errorMsg}</p>
              </div>
            )}

            {/* Fallback warning */}
            {usedFallback && (
              <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 sm:p-4 mb-4 animate-fade-up">
                <p className="text-gold text-xs sm:text-sm">
                  ⚠️ Não foi possível usar sua voz clonada. Usando voz do sistema.
                </p>
              </div>
            )}

            {/* Result */}
            {currentTranslation && (
              <TranscriptCard
                translation={currentTranslation}
                onPlayAudio={handlePlayCurrent}
                isPlaying={isPlaying}
              />
            )}
          </div>
        )}

        {/* ===== HISTORY ===== */}
        {activeTab === 'history' && (
          <HistoryList
            translations={history}
            onPlay={handlePlayHistory}
            playingId={playingId}
          />
        )}
      </main>

      {/* Bottom Tab Bar — mobile only, fixed */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-crema/90 backdrop-blur-md border-t border-warm-gray-light/20 safe-bottom z-50">
        <div className="flex max-w-lg mx-auto">
          {[
            { id: 'voice' as AppTab, label: 'Voz', icon: '🎤' },
            { id: 'text' as AppTab, label: 'Texto', icon: '✏️' },
            { id: 'history' as AppTab, label: 'Histórico', icon: '📜' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 pt-3 cursor-pointer transition-colors touch-target ${
                activeTab === tab.id
                  ? 'text-terracotta'
                  : 'text-warm-gray'
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-[10px] font-medium mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

function StatusBadge({ step }: { step: TranslationStep }) {
  const labels: Record<TranslationStep, string> = {
    idle: '',
    recording: '🎙️ Gravando...',
    transcribing: '📝 Transcrevendo...',
    translating: '🔄 Traduzindo...',
    synthesizing: '🎵 Sintetizando voz...',
    playing: '🔊 Reproduzindo...',
    done: '✅ Pronto!',
    error: '❌ Erro',
  }

  if (step === 'idle') return null

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
        {labels[step]}
      </span>
    </div>
  )
}

export default App
