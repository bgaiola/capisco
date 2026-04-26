import type { LangCode } from '../types/languages'

export interface UIStrings {
  // Header / chrome
  chooseLanguagesTagline: string
  voiceSetupTagline: string
  systemVoice: string
  clonedVoice: string
  resetVoice: string
  setUpVoice: string

  // Tabs
  tabVoice: string
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

  // Status badges
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

  // Errors / messaging
  speechNotSupported: string
  noSpeechDetected: string
  micPermissionDenied: string

  // Recovery / persistence
  voiceSavedOnThisDevice: string
}

const en: UIStrings = {
  chooseLanguagesTagline: 'choose your languages',
  voiceSetupTagline: 'voice setup',
  systemVoice: 'System voice',
  clonedVoice: 'Cloned voice active',
  resetVoice: 'reset',
  setUpVoice: 'set up voice',

  tabVoice: 'Voice',
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
}

const es: UIStrings = {
  chooseLanguagesTagline: 'elige tus idiomas',
  voiceSetupTagline: 'configurar voz',
  systemVoice: 'Voz del sistema',
  clonedVoice: 'Voz clonada activa',
  resetVoice: 'reiniciar',
  setUpVoice: 'configurar voz',

  tabVoice: 'Voz',
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
}

const pt: UIStrings = {
  chooseLanguagesTagline: 'escolha seus idiomas',
  voiceSetupTagline: 'configurar voz',
  systemVoice: 'Voz do sistema',
  clonedVoice: 'Voz clonada ativa',
  resetVoice: 'resetar',
  setUpVoice: 'configurar voz',

  tabVoice: 'Voz',
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
}

/** Languages with a full UI translation. Other native languages fall back to ES. */
type UILangCode = 'es' | 'en' | 'pt'

const DICT: Record<UILangCode, UIStrings> = { en, es, pt }

export function getStrings(code: LangCode): UIStrings {
  return DICT[code as UILangCode] ?? es
}
