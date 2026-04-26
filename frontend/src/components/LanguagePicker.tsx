import { LANGUAGES, langKey, type Language } from '../types/languages'

interface LanguagePickerProps {
  selected: Language | null
  onSelect: (lang: Language) => void
  /** Optionally hide a language from the list (e.g. the user's own native language). */
  exclude?: string[]
  /** Override label shown above the list. */
  label?: string
}

export default function LanguagePicker({
  selected,
  onSelect,
  exclude = [],
  label,
}: LanguagePickerProps) {
  const list = LANGUAGES.filter((l) => !exclude.includes(langKey(l)))

  return (
    <div className="w-full">
      {label && (
        <p className="font-mono text-[10px] sm:text-xs text-warm-gray uppercase tracking-wider mb-2">
          {label}
        </p>
      )}
      <div className="space-y-1.5 max-h-[58vh] overflow-y-auto overscroll-contain pr-1">
        {list.map((lang) => {
          const isSelected = selected ? langKey(selected) === langKey(lang) : false
          return (
            <button
              key={langKey(lang)}
              type="button"
              onClick={() => onSelect(lang)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left cursor-pointer touch-target ${
                isSelected
                  ? 'bg-terracotta/10 border-2 border-terracotta/40'
                  : 'glass-card border-2 border-transparent hover:border-warm-gray-light/40'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-body font-medium text-base truncate ${
                    isSelected ? 'text-terracotta' : 'text-ink'
                  }`}
                >
                  {lang.label}
                </p>
                <p className="font-mono text-[10px] text-warm-gray">{lang.englishName}</p>
              </div>
              {isSelected && (
                <svg className="w-5 h-5 text-terracotta shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
