import type { LangCode } from '../types/languages'

export interface TutorialStep {
  emoji: string
  title: string
  body: string
}

export interface UIStrings {
  // Header / chrome
  chooseLanguagesTagline: string
  voiceSetupTagline: string
  partnerSetupTagline: string
  systemVoice: string
  clonedVoice: string
  resetVoice: string
  setUpVoice: string

  // Tabs
  tabVoice: string
  tabConversation: string
  tabText: string
  tabHistory: string

  // Language selector
  iSpeak: string
  iWantToLearn: string
  selectYourLanguage: string
  selectTargetLanguage: string
  letsGo: string
  swapLanguages: string

  // Voice mode
  tapToStop: string
  tapAndSpeak: (lang: string) => string
  listening: string

  // Text mode
  typeAPhrase: (lang: string) => string
  translate: string

  // Result actions
  listen: string
  playing: string
  copy: string

  // Status
  recording: string
  transcribing: string
  translating: string
  synthesizing: string
  playingStatus: string
  done: string
  errorStatus: string

  // Errors
  errorPrefix: string
  fallbackWarning: string

  // History
  noTranslationsYet: string
  noTranslationsHint: string

  // Voice onboarding
  letsCloneYourVoice: string
  readBelowOutLoud: string
  needAtLeast30s: string
  tapToStartRecording: string
  skipUseSystemVoice: string
  recordingComplete: string
  durationLabel: string
  recommend30s: string
  listenToRecording: string
  reRecord: string
  confirm: string
  cloningVoice: string
  cloningTakesAFewSeconds: string
  voiceCloned: string
  hearYourVoiceIn: (lang: string) => string
  startUsing: string
  enoughTime: string
  minimum30s: string

  // Speech errors
  speechNotSupported: string
  noSpeechDetected: string
  micPermissionDenied: string

  // Persistence
  voiceSavedOnThisDevice: string

  // Help / tutorials
  howItWorks: string
  gotIt: string
  close: string
  showHelp: string
  voiceTutorialTitle: string
  voiceTutorialSteps: TutorialStep[]
  conversationTutorialTitle: string
  conversationTutorialSteps: TutorialStep[]
  textTutorialTitle: string
  textTutorialSteps: TutorialStep[]

  // Conversation mode
  conversationModeTitle: string
  conversationIntro: string
  addPartnerCta: string
  needYourVoiceFirst: string
  setUpYourVoice: string
  you: string
  partner: string
  yourTurn: string
  partnersTurn: string
  tapWhoSpeaks: string
  changePartner: string
  clearConversation: string
  noExchangesYet: string
  noExchangesHint: string
  partnerSpeaks: (lang: string) => string

  // Partner onboarding
  pickPartnerLanguage: string
  partnerLanguageHint: string
  havePartnerRead: string
  partnerVoiceCloned: string
  cloningPartnerVoice: string
  finishPartnerSetup: string

  // Confirmations
  confirmClearConversation: string
}

const en: UIStrings = {
  chooseLanguagesTagline: 'choose your languages',
  voiceSetupTagline: 'voice setup',
  partnerSetupTagline: 'partner setup',
  systemVoice: 'System voice',
  clonedVoice: 'Cloned voice active',
  resetVoice: 'reset',
  setUpVoice: 'set up voice',

  tabVoice: 'Voice',
  tabConversation: 'Talk',
  tabText: 'Text',
  tabHistory: 'History',

  iSpeak: 'I speak',
  iWantToLearn: 'I want to learn',
  selectYourLanguage: 'Select your language',
  selectTargetLanguage: 'Select target language',
  letsGo: "Let's go",
  swapLanguages: 'Swap languages',

  tapToStop: 'Tap to stop',
  tapAndSpeak: (lang) => `Tap the mic and speak in ${lang}`,
  listening: 'Listening… tap to stop',

  typeAPhrase: (lang) => `Type a phrase in ${lang}…`,
  translate: 'Translate',

  listen: 'Listen',
  playing: 'Playing…',
  copy: 'Copy',

  recording: 'Recording…',
  transcribing: 'Transcribing…',
  translating: 'Translating…',
  synthesizing: 'Synthesizing voice…',
  playingStatus: 'Playing…',
  done: 'Done',
  errorStatus: 'Error',

  errorPrefix: 'Error',
  fallbackWarning: 'Could not use cloned voice. Using system voice.',

  noTranslationsYet: 'No translations yet',
  noTranslationsHint: 'Use voice or text mode to get started',

  letsCloneYourVoice: "Let's clone your voice",
  readBelowOutLoud: 'Read the text below out loud, naturally.',
  needAtLeast30s: 'We need at least 30 seconds of audio for a good clone.',
  tapToStartRecording: 'Tap to start recording',
  skipUseSystemVoice: 'Skip — use system voice',
  recordingComplete: 'Recording complete',
  durationLabel: 'Duration',
  recommend30s: 'We recommend at least 30 seconds for best quality.',
  listenToRecording: 'Listen to recording',
  reRecord: 'Re-record',
  confirm: 'Confirm',
  cloningVoice: 'Cloning your voice…',
  cloningTakesAFewSeconds: 'This may take a few seconds',
  voiceCloned: 'Voice cloned!',
  hearYourVoiceIn: (lang) => `Hear how you sound in ${lang}:`,
  startUsing: 'Start using CAPPISCO',
  enoughTime: 'Enough time',
  minimum30s: 'Minimum: 30s',

  speechNotSupported: 'Speech recognition not supported in this browser. Use Chrome.',
  noSpeechDetected: 'No speech detected. Try again.',
  micPermissionDenied: 'Microphone permission denied. Please allow access.',

  voiceSavedOnThisDevice: 'Your cloned voice is saved on this device.',

  howItWorks: 'How it works',
  gotIt: 'Got it',
  close: 'Close',
  showHelp: 'Show help',
  voiceTutorialTitle: 'Voice mode',
  voiceTutorialSteps: [
    { emoji: '🎙️', title: 'Tap the mic', body: "Speak naturally in the language you set as 'I speak'." },
    { emoji: '🔄', title: 'Instant translation', body: 'We translate what you said into the language you want to learn.' },
    { emoji: '🔊', title: 'Hear yourself', body: 'The translation plays back in your own cloned voice.' },
  ],
  conversationTutorialTitle: 'Talk mode',
  conversationTutorialSteps: [
    { emoji: '👥', title: 'Two voices, two languages', body: 'Add a partner — record them once and clone their voice in their own language.' },
    { emoji: '🎙️', title: 'Tap whoever is about to speak', body: "Hand the phone over, or just point at it. The active speaker is highlighted." },
    { emoji: '🔁', title: 'They hear themselves, in your language', body: 'The translation plays in the other person\'s language, in the speaker\'s own voice. We auto-flip to the next person.' },
  ],
  textTutorialTitle: 'Text mode',
  textTutorialSteps: [
    { emoji: '✏️', title: 'Type a phrase', body: 'In your own language. Useful when you can\'t speak out loud.' },
    { emoji: '🔄', title: 'We translate it', body: 'Same translation engine as voice mode.' },
    { emoji: '🔊', title: 'Hear it in your voice', body: 'Tap Listen to play it back with your cloned voice.' },
  ],

  conversationModeTitle: 'Talk mode',
  conversationIntro: 'A real-time, two-way translator. Each person speaks their own language and the other hears it — in the speaker\'s own voice.',
  addPartnerCta: 'Add a conversation partner',
  needYourVoiceFirst: 'First, set up your own voice.',
  setUpYourVoice: 'Set up my voice',
  you: 'You',
  partner: 'Partner',
  yourTurn: 'Your turn',
  partnersTurn: "Partner's turn",
  tapWhoSpeaks: "Tap whoever's about to speak",
  changePartner: 'Change partner',
  clearConversation: 'Clear conversation',
  noExchangesYet: 'Start the conversation',
  noExchangesHint: 'Tap a name above and start speaking. Hand the phone over for replies.',
  partnerSpeaks: (lang) => `speaks ${lang}`,

  pickPartnerLanguage: "Which language does your partner speak?",
  partnerLanguageHint: 'They\'ll speak this language. The translation will play in your language, but in their own voice.',
  havePartnerRead: 'Hand the phone to your partner. They read the text below out loud, naturally, for at least 30 seconds.',
  partnerVoiceCloned: "Partner's voice cloned!",
  cloningPartnerVoice: "Cloning your partner's voice…",
  finishPartnerSetup: 'Start the conversation',

  confirmClearConversation: 'Clear the entire conversation?',
}

const es: UIStrings = {
  chooseLanguagesTagline: 'elige tus idiomas',
  voiceSetupTagline: 'configurar voz',
  partnerSetupTagline: 'configurar compañero',
  systemVoice: 'Voz del sistema',
  clonedVoice: 'Voz clonada activa',
  resetVoice: 'reiniciar',
  setUpVoice: 'configurar voz',

  tabVoice: 'Voz',
  tabConversation: 'Conversar',
  tabText: 'Texto',
  tabHistory: 'Historial',

  iSpeak: 'Yo hablo',
  iWantToLearn: 'Quiero aprender',
  selectYourLanguage: 'Selecciona tu idioma',
  selectTargetLanguage: 'Selecciona el idioma a aprender',
  letsGo: '¡Vamos!',
  swapLanguages: 'Intercambiar idiomas',

  tapToStop: 'Toca para parar',
  tapAndSpeak: (lang) => `Toca el micro y habla en ${lang}`,
  listening: 'Escuchando… toca para parar',

  typeAPhrase: (lang) => `Escribe una frase en ${lang}…`,
  translate: 'Traducir',

  listen: 'Escuchar',
  playing: 'Reproduciendo…',
  copy: 'Copiar',

  recording: 'Grabando…',
  transcribing: 'Transcribiendo…',
  translating: 'Traduciendo…',
  synthesizing: 'Sintetizando voz…',
  playingStatus: 'Reproduciendo…',
  done: 'Hecho',
  errorStatus: 'Error',

  errorPrefix: 'Error',
  fallbackWarning: 'No se pudo usar la voz clonada. Usando la del sistema.',

  noTranslationsYet: 'Aún no hay traducciones',
  noTranslationsHint: 'Usa el modo voz o texto para empezar',

  letsCloneYourVoice: 'Vamos a clonar tu voz',
  readBelowOutLoud: 'Lee el texto de abajo en voz alta, con naturalidad.',
  needAtLeast30s: 'Necesitamos al menos 30 segundos de audio para un buen clon.',
  tapToStartRecording: 'Toca para empezar a grabar',
  skipUseSystemVoice: 'Saltar — usar voz del sistema',
  recordingComplete: 'Grabación completa',
  durationLabel: 'Duración',
  recommend30s: 'Recomendamos al menos 30 segundos para mejor calidad.',
  listenToRecording: 'Escuchar grabación',
  reRecord: 'Volver a grabar',
  confirm: 'Confirmar',
  cloningVoice: 'Clonando tu voz…',
  cloningTakesAFewSeconds: 'Puede tardar unos segundos',
  voiceCloned: '¡Voz clonada!',
  hearYourVoiceIn: (lang) => `Escucha cómo suenas en ${lang}:`,
  startUsing: 'Empezar a usar CAPPISCO',
  enoughTime: '¡Suficiente!',
  minimum30s: 'Mínimo: 30s',

  speechNotSupported: 'Reconocimiento de voz no compatible. Usa Chrome.',
  noSpeechDetected: 'No se detectó voz. Inténtalo de nuevo.',
  micPermissionDenied: 'Permiso de micrófono denegado. Concede el acceso.',

  voiceSavedOnThisDevice: 'Tu voz clonada está guardada en este dispositivo.',

  howItWorks: 'Cómo funciona',
  gotIt: 'Entendido',
  close: 'Cerrar',
  showHelp: 'Mostrar ayuda',
  voiceTutorialTitle: 'Modo voz',
  voiceTutorialSteps: [
    { emoji: '🎙️', title: 'Toca el micro', body: "Habla con naturalidad en el idioma que pusiste como 'Yo hablo'." },
    { emoji: '🔄', title: 'Traducción al instante', body: 'Traducimos lo que dijiste al idioma que quieres aprender.' },
    { emoji: '🔊', title: 'Te escuchas a ti mismo', body: 'La traducción se reproduce con tu voz clonada.' },
  ],
  conversationTutorialTitle: 'Modo conversar',
  conversationTutorialSteps: [
    { emoji: '👥', title: 'Dos voces, dos idiomas', body: 'Añade un compañero — graba su voz una vez y la clonamos en su propio idioma.' },
    { emoji: '🎙️', title: 'Toca a quien va a hablar', body: 'Pasa el móvil o simplemente apunta. El que habla aparece resaltado.' },
    { emoji: '🔁', title: 'Se escucha en tu idioma', body: 'La traducción suena en el idioma del otro, con la voz de quien habla. Pasamos al siguiente automáticamente.' },
  ],
  textTutorialTitle: 'Modo texto',
  textTutorialSteps: [
    { emoji: '✏️', title: 'Escribe una frase', body: 'En tu idioma. Útil cuando no puedes hablar en alto.' },
    { emoji: '🔄', title: 'La traducimos', body: 'Mismo motor que el modo voz.' },
    { emoji: '🔊', title: 'Escúchala con tu voz', body: 'Toca Escuchar para reproducirla con tu voz clonada.' },
  ],

  conversationModeTitle: 'Modo conversar',
  conversationIntro: 'Un traductor en tiempo real para dos personas. Cada uno habla su idioma y el otro lo oye — con la voz de quien habla.',
  addPartnerCta: 'Añadir un compañero',
  needYourVoiceFirst: 'Primero configura tu propia voz.',
  setUpYourVoice: 'Configurar mi voz',
  you: 'Tú',
  partner: 'Compañero',
  yourTurn: 'Tu turno',
  partnersTurn: 'Turno del compañero',
  tapWhoSpeaks: 'Toca a quien va a hablar',
  changePartner: 'Cambiar compañero',
  clearConversation: 'Borrar conversación',
  noExchangesYet: 'Empieza la conversación',
  noExchangesHint: 'Toca un nombre arriba y empieza a hablar. Pasa el móvil para que el otro responda.',
  partnerSpeaks: (lang) => `habla ${lang}`,

  pickPartnerLanguage: '¿En qué idioma habla tu compañero?',
  partnerLanguageHint: 'Hablará en este idioma. La traducción sonará en tu idioma, pero con su propia voz.',
  havePartnerRead: 'Pasa el móvil a tu compañero. Que lea el texto de abajo en voz alta, con naturalidad, durante al menos 30 segundos.',
  partnerVoiceCloned: '¡Voz del compañero clonada!',
  cloningPartnerVoice: 'Clonando la voz de tu compañero…',
  finishPartnerSetup: 'Empezar la conversación',

  confirmClearConversation: '¿Borrar toda la conversación?',
}

const pt: UIStrings = {
  chooseLanguagesTagline: 'escolha seus idiomas',
  voiceSetupTagline: 'configurar voz',
  partnerSetupTagline: 'configurar parceiro',
  systemVoice: 'Voz do sistema',
  clonedVoice: 'Voz clonada ativa',
  resetVoice: 'resetar',
  setUpVoice: 'configurar voz',

  tabVoice: 'Voz',
  tabConversation: 'Conversa',
  tabText: 'Texto',
  tabHistory: 'Histórico',

  iSpeak: 'Eu falo',
  iWantToLearn: 'Quero aprender',
  selectYourLanguage: 'Selecione seu idioma',
  selectTargetLanguage: 'Selecione o idioma a aprender',
  letsGo: 'Vamos!',
  swapLanguages: 'Inverter idiomas',

  tapToStop: 'Toque para parar',
  tapAndSpeak: (lang) => `Toque no microfone e fale em ${lang}`,
  listening: 'Ouvindo… toque para parar',

  typeAPhrase: (lang) => `Digite uma frase em ${lang}…`,
  translate: 'Traduzir',

  listen: 'Ouvir',
  playing: 'Reproduzindo…',
  copy: 'Copiar',

  recording: 'Gravando…',
  transcribing: 'Transcrevendo…',
  translating: 'Traduzindo…',
  synthesizing: 'Sintetizando voz…',
  playingStatus: 'Reproduzindo…',
  done: 'Pronto',
  errorStatus: 'Erro',

  errorPrefix: 'Erro',
  fallbackWarning: 'Não foi possível usar a voz clonada. Usando voz do sistema.',

  noTranslationsYet: 'Nenhuma tradução ainda',
  noTranslationsHint: 'Use o modo voz ou texto para começar',

  letsCloneYourVoice: 'Vamos clonar sua voz',
  readBelowOutLoud: 'Leia o texto abaixo em voz alta, naturalmente.',
  needAtLeast30s: 'Precisamos de pelo menos 30 segundos de áudio para um bom clone.',
  tapToStartRecording: 'Toque para começar a gravar',
  skipUseSystemVoice: 'Pular — usar voz do sistema',
  recordingComplete: 'Gravação completa',
  durationLabel: 'Duração',
  recommend30s: 'Recomendamos pelo menos 30 segundos para melhor qualidade.',
  listenToRecording: 'Ouvir gravação',
  reRecord: 'Regravar',
  confirm: 'Confirmar',
  cloningVoice: 'Clonando sua voz…',
  cloningTakesAFewSeconds: 'Pode levar alguns segundos',
  voiceCloned: 'Voz clonada!',
  hearYourVoiceIn: (lang) => `Ouça como você soa em ${lang}:`,
  startUsing: 'Começar a usar o CAPPISCO',
  enoughTime: 'Tempo suficiente!',
  minimum30s: 'Mínimo: 30s',

  speechNotSupported: 'Reconhecimento de voz não suportado. Use o Chrome.',
  noSpeechDetected: 'Nenhuma fala detectada. Tente de novo.',
  micPermissionDenied: 'Permissão de microfone negada. Permita o acesso.',

  voiceSavedOnThisDevice: 'Sua voz clonada está salva neste dispositivo.',

  howItWorks: 'Como funciona',
  gotIt: 'Entendi',
  close: 'Fechar',
  showHelp: 'Ver ajuda',
  voiceTutorialTitle: 'Modo voz',
  voiceTutorialSteps: [
    { emoji: '🎙️', title: 'Toque no microfone', body: "Fale naturalmente no idioma que você definiu como 'Eu falo'." },
    { emoji: '🔄', title: 'Tradução instantânea', body: 'Traduzimos o que você disse para o idioma que está aprendendo.' },
    { emoji: '🔊', title: 'Você se ouve', body: 'A tradução toca de volta na sua própria voz clonada.' },
  ],
  conversationTutorialTitle: 'Modo conversa',
  conversationTutorialSteps: [
    { emoji: '👥', title: 'Duas vozes, dois idiomas', body: 'Adicione um parceiro — grave a voz dele uma vez no idioma dele.' },
    { emoji: '🎙️', title: 'Toque em quem vai falar', body: 'Passa o celular ou só aponta. Quem está falando fica destacado.' },
    { emoji: '🔁', title: 'Ele se ouve no seu idioma', body: 'A tradução toca no idioma do outro, com a voz de quem falou. Trocamos pra próxima pessoa automaticamente.' },
  ],
  textTutorialTitle: 'Modo texto',
  textTutorialSteps: [
    { emoji: '✏️', title: 'Digite uma frase', body: 'No seu idioma. Útil quando não dá pra falar em voz alta.' },
    { emoji: '🔄', title: 'Traduzimos', body: 'Mesmo motor do modo voz.' },
    { emoji: '🔊', title: 'Ouça na sua voz', body: 'Toque em Ouvir pra reproduzir com sua voz clonada.' },
  ],

  conversationModeTitle: 'Modo conversa',
  conversationIntro: 'Um tradutor em tempo real pra duas pessoas. Cada uma fala o próprio idioma e a outra ouve — na voz de quem está falando.',
  addPartnerCta: 'Adicionar um parceiro',
  needYourVoiceFirst: 'Primeiro configure sua própria voz.',
  setUpYourVoice: 'Configurar minha voz',
  you: 'Você',
  partner: 'Parceiro',
  yourTurn: 'Sua vez',
  partnersTurn: 'Vez do parceiro',
  tapWhoSpeaks: 'Toque em quem vai falar',
  changePartner: 'Trocar parceiro',
  clearConversation: 'Apagar conversa',
  noExchangesYet: 'Comece a conversa',
  noExchangesHint: 'Toque num nome acima e comece a falar. Passa o celular pra resposta.',
  partnerSpeaks: (lang) => `fala ${lang}`,

  pickPartnerLanguage: 'Em qual idioma seu parceiro fala?',
  partnerLanguageHint: 'Ele vai falar nesse idioma. A tradução toca no seu idioma, mas com a voz dele.',
  havePartnerRead: 'Passa o celular pro seu parceiro. Ele lê o texto abaixo em voz alta, naturalmente, por pelo menos 30 segundos.',
  partnerVoiceCloned: 'Voz do parceiro clonada!',
  cloningPartnerVoice: 'Clonando a voz do seu parceiro…',
  finishPartnerSetup: 'Começar a conversa',

  confirmClearConversation: 'Apagar a conversa toda?',
}

type UILangCode = 'es' | 'en' | 'pt'
const DICT: Record<UILangCode, UIStrings> = { en, es, pt }

export function getStrings(code: LangCode): UIStrings {
  return DICT[code as UILangCode] ?? es
}
