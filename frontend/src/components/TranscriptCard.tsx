import type { Translation } from '../types'
import type { Language } from '../types/languages'

interface TranscriptCardProps {
  translation: Translation
  onPlayAudio?: () => void
  isPlaying?: boolean
  nativeLang?: Language
  targetLang?: Language
}

export default function TranscriptCard({
  translation,
  onPlayAudio,
  isPlaying = false,
  nativeLang,
  targetLang,
}: TranscriptCardProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(translation.translatedText)
  }

  const nativeLabel = nativeLang ? `${nativeLang.flag} ${nativeLang.label}` : 'Original'
  const targetLabel = targetLang ? `${targetLang.flag} ${targetLang.label}` : 'Translation'

  return (
    <div className="animate-fade-up bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-warm-gray-light/30 shadow-sm">
      {/* Original */}
      <div className="mb-3 sm:mb-4">
        <span className="font-mono text-[10px] sm:text-xs text-warm-gray uppercase tracking-wider">
          {nativeLabel}
        </span>
        <p className="mt-1 font-body text-ink text-base sm:text-lg leading-relaxed">
          {translation.originalText}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-warm-gray-light/30 my-3 sm:my-4" />

      {/* Translation */}
      <div className="mb-3 sm:mb-4">
        <span className="font-mono text-[10px] sm:text-xs text-terracotta uppercase tracking-wider">
          {targetLabel}
        </span>
        <p className="mt-1 font-display text-ink text-xl sm:text-2xl leading-relaxed italic">
          {translation.translatedText}
        </p>
      </div>

      {/* Cultural Note */}
      {translation.notes && (
        <div className="bg-gold/5 border border-gold/20 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex items-start gap-2">
            <span className="text-gold text-sm mt-0.5">💡</span>
            <p className="font-body text-xs sm:text-sm text-warm-gray leading-relaxed">
              {translation.notes}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
        {onPlayAudio && (
          <button
            onClick={onPlayAudio}
            className="flex items-center gap-2 px-4 py-2.5 sm:py-2 rounded-full bg-terracotta/10 text-terracotta hover:bg-terracotta/20 active:scale-95 transition-all text-sm font-medium cursor-pointer touch-target"
          >
            {isPlaying ? (
              <>
                <AudioBars />
                Playing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Listen
              </>
            )}
          </button>
        )}

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2.5 sm:py-2 rounded-full bg-warm-gray/10 text-warm-gray hover:bg-warm-gray/20 active:scale-95 transition-all text-sm font-medium cursor-pointer touch-target"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </button>
      </div>
    </div>
  )
}

function AudioBars() {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-0.5 bg-terracotta rounded-full animate-wave-bar"
          style={{
            height: '100%',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}
