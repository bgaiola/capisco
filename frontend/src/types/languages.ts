/**
 * Language system for CAPISCO
 * Supports multiple source and target languages
 */

export interface Language {
  /** ISO 639-1 code used by Google Translate (e.g. 'pt', 'es') */
  code: string
  /** BCP-47 locale for Web Speech API recognition (e.g. 'pt-BR', 'es-ES') */
  speechCode: string
  /** BCP-47 locale for Web Speech Synthesis fallback TTS */
  ttsCode: string
  /** Display label in the language's own language */
  label: string
  /** Emoji flag */
  flag: string
  /** English name for reference */
  englishName: string
}

export const LANGUAGES: Language[] = [
  {
    code: 'pt',
    speechCode: 'pt-BR',
    ttsCode: 'pt-BR',
    label: 'Português (Brasil)',
    flag: '🇧🇷',
    englishName: 'Portuguese (Brazil)',
  },
  {
    code: 'pt',
    speechCode: 'pt-PT',
    ttsCode: 'pt-PT',
    label: 'Português (Portugal)',
    flag: '🇵🇹',
    englishName: 'Portuguese (Portugal)',
  },
  {
    code: 'es',
    speechCode: 'es-ES',
    ttsCode: 'es-ES',
    label: 'Español',
    flag: '🇪🇸',
    englishName: 'Spanish',
  },
  {
    code: 'en',
    speechCode: 'en-US',
    ttsCode: 'en-US',
    label: 'English (US)',
    flag: '🇺🇸',
    englishName: 'English (US)',
  },
  {
    code: 'fr',
    speechCode: 'fr-FR',
    ttsCode: 'fr-FR',
    label: 'Français',
    flag: '🇫🇷',
    englishName: 'French',
  },
  {
    code: 'it',
    speechCode: 'it-IT',
    ttsCode: 'it-IT',
    label: 'Italiano',
    flag: '🇮🇹',
    englishName: 'Italian',
  },
  {
    code: 'zh',
    speechCode: 'zh-CN',
    ttsCode: 'zh-CN',
    label: '中文 (普通话)',
    flag: '🇨🇳',
    englishName: 'Mandarin Chinese',
  },
  {
    code: 'ru',
    speechCode: 'ru-RU',
    ttsCode: 'ru-RU',
    label: 'Русский',
    flag: '🇷🇺',
    englishName: 'Russian',
  },
  {
    code: 'nl',
    speechCode: 'nl-NL',
    ttsCode: 'nl-NL',
    label: 'Nederlands',
    flag: '🇳🇱',
    englishName: 'Dutch',
  },
]

/** Unique key for a language (since pt-BR and pt-PT share the same ISO code) */
export function langKey(lang: Language): string {
  return lang.speechCode
}

/** Find a language by its speechCode key */
export function findLang(key: string): Language | undefined {
  return LANGUAGES.find((l) => l.speechCode === key)
}

/** Default language pair */
export const DEFAULT_NATIVE = 'pt-BR'
export const DEFAULT_TARGET = 'it-IT'

export interface LanguagePair {
  native: Language
  target: Language
}

export function loadLanguagePair(): LanguagePair {
  const savedNative = localStorage.getItem('capisco_native_lang')
  const savedTarget = localStorage.getItem('capisco_target_lang')

  const native = (savedNative && findLang(savedNative)) || findLang(DEFAULT_NATIVE)!
  const target = (savedTarget && findLang(savedTarget)) || findLang(DEFAULT_TARGET)!

  return { native, target }
}

export function saveLanguagePair(pair: LanguagePair): void {
  localStorage.setItem('capisco_native_lang', langKey(pair.native))
  localStorage.setItem('capisco_target_lang', langKey(pair.target))
}
