import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import type { Locale } from '../../i18n/marketing'

const LABELS: Record<Locale, { flag: string; label: string }> = {
  en: { flag: '🇺🇸', label: 'English' },
  pt: { flag: '🇧🇷', label: 'Português' },
  es: { flag: '🇪🇸', label: 'Español' },
}

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm text-warm-gray hover:text-ink hover:bg-warm-gray/10 transition-colors cursor-pointer"
        aria-label={t.langPickerLabel}
        title={t.langPickerLabel}
      >
        <span className="text-sm">{LABELS[locale].flag}</span>
        {!compact && <span className="font-medium">{LABELS[locale].label}</span>}
        <span className={`text-[10px] transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[160px] bg-white border border-warm-gray-light/30 rounded-xl shadow-[0_24px_60px_-30px_rgba(0,0,0,0.2)] py-1 z-50">
          {(Object.keys(LABELS) as Locale[]).map((code) => (
            <button
              key={code}
              onClick={() => {
                setLocale(code)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-warm-gray/10 cursor-pointer ${
                locale === code ? 'text-terracotta font-medium' : 'text-ink'
              }`}
            >
              <span>{LABELS[code].flag}</span>
              <span>{LABELS[code].label}</span>
              {locale === code && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
