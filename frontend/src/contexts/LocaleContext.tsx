import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  getMarketingStrings,
  resolveLocale,
  SUPPORTED_LOCALES,
  type Locale,
  type MarketingStrings,
} from '../i18n/marketing'

const STORAGE_KEY = 'cappisco_locale'

interface LocaleState {
  locale: Locale
  setLocale: (l: Locale) => void
  t: MarketingStrings
}

const LocaleContext = createContext<LocaleState | null>(null)

function readInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED_LOCALES.includes(saved as Locale)) return saved as Locale
  } catch {
    // ignore
  }
  // Try browser languages in order
  if (typeof navigator !== 'undefined') {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
    for (const tag of langs) {
      const resolved = resolveLocale(tag)
      // Only return if it's not the default fallback unless we ran out of preferences.
      if (resolved !== 'en' || tag.toLowerCase().startsWith('en')) return resolved
    }
  }
  return 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // ignore
    }
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = (l: Locale) => {
    if (SUPPORTED_LOCALES.includes(l)) setLocaleState(l)
  }

  const value = useMemo<LocaleState>(
    () => ({ locale, setLocale, t: getMarketingStrings(locale) }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleState {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
