import { useState } from 'react'
import { useMediaRecorder } from '../hooks/useMediaRecorder'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { cloneVoice, synthesizeSpeech } from '../services/elevenlabs'
import AudioVisualizer from './AudioVisualizer'
import MicButton from './MicButton'
import type { Language } from '../types/languages'

/** Sample texts for voice cloning — one per native language */
const SAMPLE_TEXTS: Record<string, string> = {
  'pt': `Eu tenho uma teoria: ninguém realmente sabe pedir comida em outro idioma. A gente finge. Você aponta, sorri, faz cara de quem entendeu, e torce pra não chegar um prato com tentáculos.

Foi exatamente o que aconteceu comigo em Nápoles. Pedi o que eu jurava ser uma margherita. Chegou uma travessa de frutos do mar que eu não conseguia nem identificar. Comi tudo, claro — porque recusar comida na Itália é praticamente um crime internacional.

O melhor de aprender italiano é que cada erro vira uma história que você conta rindo no jantar. Tipo aquela vez que eu disse "sono caldo" achando que tava dizendo "estou quente" e o garçom quase caiu de rir. Aparentemente eu tinha acabado de dizer que sou um caldo. De carne, provavelmente.`,

  'en': `I have a theory: nobody actually knows how to order food in a foreign language. We all just pretend. You point, smile, nod like you understood, and pray they don't bring you a plate of tentacles.

That's exactly what happened to me in Naples. I ordered what I was absolutely certain was a margherita pizza. What arrived was a seafood platter with creatures I couldn't even identify. I ate everything, of course — because refusing food in Italy is basically an international crime.

The best part of learning a new language is that every mistake becomes a dinner party story. Like the time I told a waiter "sono caldo" thinking I was saying "I'm hot" and he nearly fell over laughing. Apparently I had just announced that I am a broth. Beef broth, probably.`,

  'es': `Tengo una teoría: nadie sabe realmente pedir comida en otro idioma. Todos fingimos. Señalas, sonríes, pones cara de que entendiste, y rezas para que no te traigan un plato con tentáculos.

Eso fue exactamente lo que me pasó en Nápoles. Pedí lo que juraba era una margherita. Llegó una bandeja de mariscos con criaturas que no podía ni identificar. Me lo comí todo, claro — porque rechazar comida en Italia es prácticamente un crimen internacional.

Lo mejor de aprender un idioma nuevo es que cada error se convierte en una anécdota para la cena. Como aquella vez que dije "sono caldo" pensando que estaba diciendo "tengo calor" y el camarero casi se cae de la risa. Aparentemente acababa de decir que soy un caldo. De carne, probablemente.`,

  'fr': `J'ai une théorie : personne ne sait vraiment commander à manger dans une langue étrangère. On fait tous semblant. Tu pointes du doigt, tu souris, tu fais comme si tu avais compris, et tu pries pour qu'on ne t'apporte pas une assiette de tentacules.

C'est exactement ce qui m'est arrivé à Naples. J'ai commandé ce que je jurais être une margherita. Ce qui est arrivé, c'était un plateau de fruits de mer avec des créatures que je ne pouvais même pas identifier. J'ai tout mangé, évidemment — parce que refuser de la nourriture en Italie, c'est pratiquement un crime international.

Le meilleur quand on apprend une nouvelle langue, c'est que chaque erreur devient une histoire qu'on raconte en riant au dîner. Comme la fois où j'ai dit « sono caldo » en pensant dire « j'ai chaud » et le serveur a failli tomber de rire. Apparemment, je venais de déclarer que je suis un bouillon. De bœuf, probablement.`,

  'it': `Ho una teoria: nessuno sa davvero ordinare da mangiare in una lingua straniera. Facciamo tutti finta. Indichi, sorridi, fai la faccia di chi ha capito, e preghi che non ti portino un piatto di tentacoli.

È esattamente quello che mi è successo a Napoli. Ho ordinato quella che giuravo fosse una margherita. È arrivato un vassoio di frutti di mare con creature che non riuscivo nemmeno a identificare. Ho mangiato tutto, ovviamente — perché rifiutare il cibo in Italia è praticamente un crimine internazionale.

La cosa migliore dell'imparare una lingua nuova è che ogni errore diventa una storia da raccontare ridendo a cena. Come quella volta che ho detto "soy caliente" in Spagna pensando di dire "ho caldo" e il cameriere è quasi caduto dal ridere. A quanto pare avevo appena dichiarato di essere attraente. O una zuppa. Non sono ancora sicuro.`,

  'zh': `我有一个理论：没有人真正知道怎么用外语点餐。我们都在假装。你指着菜单，微笑，装出听懂了的样子，然后祈祷他们不会端上一盘触手。

这正是我在那不勒斯经历的事情。我点了我发誓是一份玛格丽特披萨的东西。结果端上来的是一大盘海鲜，里面的生物我连名字都叫不出来。我当然全吃了——因为在意大利拒绝食物基本上就是国际犯罪。

学习新语言最棒的地方在于，每个错误都会变成一个让你在晚餐时笑着讲述的故事。比如那次我对服务员说"sono caldo"，以为我在说"我很热"，结果服务员差点笑到摔倒。显然我刚刚宣布自己是一碗肉汤。大概是牛肉汤吧。`,

  'ru': `У меня есть теория: никто на самом деле не умеет заказывать еду на иностранном языке. Мы все притворяемся. Ты показываешь пальцем, улыбаешься, делаешь вид, что всё понял, и молишься, чтобы тебе не принесли тарелку с щупальцами.

Именно это и случилось со мной в Неаполе. Я заказал то, что был абсолютно уверен — маргариту. Принесли поднос с морепродуктами и существами, которых я даже не мог опознать. Я всё съел, конечно — потому что отказаться от еды в Италии — это практически международное преступление.

Лучшее в изучении нового языка — каждая ошибка превращается в историю для ужина. Как тот раз, когда я сказал официанту «sono caldo», думая, что говорю «мне жарко», и он чуть не упал от смеха. Оказывается, я только что объявил, что я — бульон. Говяжий, наверное.`,

  'nl': `Ik heb een theorie: niemand weet echt hoe je eten moet bestellen in een vreemde taal. We doen allemaal alsof. Je wijst, glimlacht, doet alsof je het begrepen hebt, en bidt dat ze geen bord met tentakels brengen.

Dat is precies wat mij overkwam in Napels. Ik bestelde wat ik zeker wist een margherita was. Wat er kwam was een schaal zeevruchten met wezens die ik niet eens kon identificeren. Ik at alles op, natuurlijk — want eten weigeren in Italië is praktisch een internationaal misdrijf.

Het beste van een nieuwe taal leren is dat elke fout een verhaal wordt dat je lachend vertelt bij het avondeten. Zoals die keer dat ik "sono caldo" zei tegen de ober, denkend dat ik zei "ik heb het warm" en hij bijna omviel van het lachen. Blijkbaar had ik net verklaard dat ik een bouillon ben. Runderbouillon, waarschijnlijk.`,
}

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
  nativeLang?: Language
}

type OnboardingStep = 'intro' | 'recording' | 'review' | 'cloning' | 'preview' | 'done'

export default function VoiceOnboarding({ onComplete, onSkip, targetLang, nativeLang }: VoiceOnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('intro')
  const [error, setError] = useState<string | null>(null)
  const [voiceId, setVoiceId] = useState<string | null>(null)

  // Pick sample text based on native language (fallback to English)
  const nativeCode = nativeLang?.code ?? 'pt'
  const sampleText = SAMPLE_TEXTS[nativeCode] ?? SAMPLE_TEXTS['en'] ?? ''

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
                {sampleText}
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
              {sampleText}
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
