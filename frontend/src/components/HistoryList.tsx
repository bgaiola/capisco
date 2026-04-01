import type { Translation } from '../types'

interface HistoryListProps {
  translations: Translation[]
  onPlay: (translation: Translation) => void
  playingId: string | null
}

export default function HistoryList({
  translations,
  onPlay,
  playingId,
}: HistoryListProps) {
  if (translations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-warm-gray">
        <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="font-display text-lg sm:text-xl">Nenhuma tradução ainda</p>
        <p className="text-xs sm:text-sm mt-2">Use o modo voz ou texto para começar</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {translations.map((t, index) => (
        <button
          key={t.id}
          onClick={() => onPlay(t)}
          className="w-full text-left bg-white/60 backdrop-blur-sm rounded-xl p-3.5 sm:p-4 border border-warm-gray-light/30 hover:border-terracotta/30 hover:shadow-sm active:scale-[0.98] transition-all duration-200 animate-fade-up cursor-pointer touch-target"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-warm-gray truncate">
                {t.originalText}
              </p>
              <p className="font-display text-base sm:text-lg text-ink italic mt-1 truncate">
                {t.translatedText}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {playingId === t.id ? (
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
              {new Date(t.timestamp).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {t.notes && (
              <span className="text-xs text-gold">💡</span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
