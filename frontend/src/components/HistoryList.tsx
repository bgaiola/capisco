import type { Translation } from '../types'
import type { UIStrings } from '../i18n/strings'

interface HistoryListProps {
  translations: Translation[]
  onPlay: (translation: Translation) => void
  playingId: string | null
  strings: UIStrings
}

export default function HistoryList({
  translations,
  onPlay,
  playingId,
  strings: t,
}: HistoryListProps) {
  if (translations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-warm-gray">
        <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="font-display text-lg sm:text-xl">{t.noTranslationsYet}</p>
        <p className="text-xs sm:text-sm mt-2">{t.noTranslationsHint}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {translations.map((tr, index) => (
        <button
          key={tr.id}
          onClick={() => onPlay(tr)}
          className="w-full text-left glass-card rounded-xl p-3.5 sm:p-4 hover:border-terracotta/40 active:scale-[0.98] transition-all duration-200 animate-fade-up cursor-pointer touch-target"
          style={{ animationDelay: `${Math.min(index, 8) * 0.04}s` }}
        >
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-warm-gray truncate">{tr.originalText}</p>
              <p className="font-display text-base sm:text-lg text-ink italic mt-1 truncate">
                {tr.translatedText}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {playingId === tr.id ? (
                <div className="flex items-end gap-0.5 h-5 px-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-terracotta rounded-full animate-wave-bar"
                      style={{ height: '100%', animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              ) : (
                <svg className="w-5 h-5 text-terracotta" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-warm-gray-light font-mono">
              {new Date(tr.timestamp).toLocaleString(undefined, {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {tr.notes && <span className="text-xs text-gold">💡</span>}
          </div>
        </button>
      ))}
    </div>
  )
}
