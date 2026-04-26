/**
 * Language system for CAPPISCO
 * Three supported languages: English (US), Portuguese (Brazil), Spanish (Spain).
 * The user's native language also drives the UI language.
 */

export type LangCode = 'es' | 'en' | 'pt'

export interface Language {
  /** ISO 639-1 code used by Google Translate */
  code: LangCode
  /** BCP-47 locale for Web Speech API recognition */
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
    code: 'es',
    speechCode: 'es-ES',
    ttsCode: 'es-ES',
    label: 'Español (España)',
    flag: '🇪🇸',
    englishName: 'Spanish (Spain)',
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
    code: 'pt',
    speechCode: 'pt-BR',
    ttsCode: 'pt-BR',
    label: 'Português (Brasil)',
    flag: '🇧🇷',
    englishName: 'Portuguese (Brazil)',
  },
]

/** Unique key for a language */
export function langKey(lang: Language): string {
  return lang.speechCode
}

/** Find a language by its speechCode key */
export function findLang(key: string): Language | undefined {
  return LANGUAGES.find((l) => l.speechCode === key)
}

/** Default language pair: Spanish (Spain) → English (US) */
export const DEFAULT_NATIVE = 'es-ES'
export const DEFAULT_TARGET = 'en-US'

export interface LanguagePair {
  native: Language
  target: Language
}

const STORAGE_NATIVE = 'cappisco_native_lang'
const STORAGE_TARGET = 'cappisco_target_lang'
const LEGACY_NATIVE = 'capisco_native_lang'
const LEGACY_TARGET = 'capisco_target_lang'

export function loadLanguagePair(): LanguagePair {
  const savedNative =
    localStorage.getItem(STORAGE_NATIVE) ?? localStorage.getItem(LEGACY_NATIVE)
  const savedTarget =
    localStorage.getItem(STORAGE_TARGET) ?? localStorage.getItem(LEGACY_TARGET)

  const native = (savedNative && findLang(savedNative)) || findLang(DEFAULT_NATIVE)!
  let target = (savedTarget && findLang(savedTarget)) || findLang(DEFAULT_TARGET)!

  if (langKey(target) === langKey(native)) {
    target = LANGUAGES.find((l) => langKey(l) !== langKey(native))!
  }

  return { native, target }
}

export function saveLanguagePair(pair: LanguagePair): void {
  localStorage.setItem(STORAGE_NATIVE, langKey(pair.native))
  localStorage.setItem(STORAGE_TARGET, langKey(pair.target))
}

export function hasStoredLanguagePair(): boolean {
  return (
    localStorage.getItem(STORAGE_NATIVE) !== null ||
    localStorage.getItem(LEGACY_NATIVE) !== null
  )
}
