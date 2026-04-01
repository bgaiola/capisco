import { useState } from 'react'
import {
  LANGUAGES,
  langKey,
  type Language,
  type LanguagePair,
} from '../types/languages'

interface LanguageSelectorProps {
  pair: LanguagePair
  onConfirm: (pair: LanguagePair) => void
}

export default function LanguageSelector({ pair, onConfirm }: LanguageSelectorProps) {
  const [native, setNative] = useState<Language>(pair.native)
  const [target, setTarget] = useState<Language>(pair.target)
  const [selecting, setSelecting] = useState<'native' | 'target' | null>(null)

  const handleSelect = (lang: Language) => {
    if (selecting === 'native') {
      setNative(lang)
      // If user picks same as target, swap
      if (langKey(lang) === langKey(target)) {
        setTarget(native)
      }
    } else if (selecting === 'target') {
      setTarget(lang)
      if (langKey(lang) === langKey(native)) {
        setNative(target)
      }
    }
    setSelecting(null)
  }

  const handleSwap = () => {
    const tmp = native
    setNative(target)
    setTarget(tmp)
  }

  const handleConfirm = () => {
    onConfirm({ native, target })
  }

  // Languages available to pick (exclude the "other" selected one)
  const availableForNative = LANGUAGES.filter((l) => langKey(l) !== langKey(target))
  const availableForTarget = LANGUAGES.filter((l) => langKey(l) !== langKey(native))
  const available = selecting === 'native' ? availableForNative : availableForTarget

  return (
    <div className="h-full flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 max-w-lg mx-auto safe-top safe-bottom">
      {/* Logo */}
      <h1 className="font-display text-4xl sm:text-5xl text-ink mb-1 sm:mb-2 tracking-tight mt-4 sm:mt-0">
        CAPISCO
      </h1>
      <p className="font-mono text-xs sm:text-sm text-warm-gray mb-8 sm:mb-12">
        choose your languages
      </p>

      {/* Selection area */}
      {selecting === null ? (
        <div className="animate-fade-up w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-warm-gray-light/30 mb-6">
            {/* Native language */}
            <p className="font-mono text-[10px] sm:text-xs text-warm-gray uppercase tracking-wider mb-2">
              I speak
            </p>
            <button
              onClick={() => setSelecting('native')}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-warm-gray-light/40 hover:border-terracotta/40 transition-colors text-left cursor-pointer group"
            >
              <span className="text-2xl">{native.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-ink font-medium text-base truncate">{native.label}</p>
              </div>
              <svg className="w-5 h-5 text-warm-gray group-hover:text-terracotta transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </button>

            {/* Swap button */}
            <div className="flex justify-center my-3">
              <button
                onClick={handleSwap}
                className="p-2 rounded-full hover:bg-terracotta/10 transition-colors cursor-pointer group"
                title="Swap languages"
              >
                <svg className="w-5 h-5 text-warm-gray group-hover:text-terracotta transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4 4 4m6 0v12m0 0 4-4m-4 4-4-4" />
                </svg>
              </button>
            </div>

            {/* Target language */}
            <p className="font-mono text-[10px] sm:text-xs text-warm-gray uppercase tracking-wider mb-2">
              I want to learn
            </p>
            <button
              onClick={() => setSelecting('target')}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-warm-gray-light/40 hover:border-terracotta/40 transition-colors text-left cursor-pointer group"
            >
              <span className="text-2xl">{target.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-ink font-medium text-base truncate">{target.label}</p>
              </div>
              <svg className="w-5 h-5 text-warm-gray group-hover:text-terracotta transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Confirm */}
          <button
            onClick={handleConfirm}
            className="w-full px-6 py-4 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark active:scale-95 transition-all font-medium text-base sm:text-lg cursor-pointer touch-target"
          >
            {native.flag} → {target.flag} Let's go!
          </button>
        </div>
      ) : (
        /* Language picker list */
        <div className="animate-fade-up w-full">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setSelecting(null)}
              className="p-2 -ml-2 rounded-full hover:bg-warm-gray/10 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-warm-gray" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <p className="font-mono text-sm text-warm-gray">
              {selecting === 'native' ? 'Select your language' : 'Select target language'}
            </p>
          </div>

          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto overscroll-contain">
            {available.map((lang) => {
              const isSelected =
                selecting === 'native'
                  ? langKey(lang) === langKey(native)
                  : langKey(lang) === langKey(target)

              return (
                <button
                  key={langKey(lang)}
                  onClick={() => handleSelect(lang)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left cursor-pointer touch-target ${
                    isSelected
                      ? 'bg-terracotta/10 border-2 border-terracotta/40'
                      : 'bg-white/60 border-2 border-transparent hover:border-warm-gray-light/40'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-body font-medium text-base truncate ${isSelected ? 'text-terracotta' : 'text-ink'}`}>
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
      )}
    </div>
  )
}
