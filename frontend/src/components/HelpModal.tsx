import { useEffect } from 'react'
import type { TutorialStep, UIStrings } from '../i18n/strings'

interface HelpModalProps {
  open: boolean
  onClose: () => void
  title: string
  steps: TutorialStep[]
  strings: UIStrings
}

export default function HelpModal({ open, onClose, title, steps, strings: t }: HelpModalProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative w-full sm:max-w-md mx-0 sm:mx-4 mb-0 sm:mb-0 bg-crema rounded-t-3xl sm:rounded-3xl border border-warm-gray-light/30 shadow-2xl overflow-hidden animate-fade-up safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile sheet */}
        <div className="flex justify-center pt-2 sm:hidden">
          <span className="w-10 h-1 rounded-full bg-warm-gray-light/60" />
        </div>

        <div className="px-5 sm:px-7 pt-3 sm:pt-7 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] sm:text-xs text-warm-gray uppercase tracking-wider">
                {t.howItWorks}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink mt-1">{title}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label={t.close}
              className="p-2 -mr-2 -mt-1 rounded-full hover:bg-warm-gray/10 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-warm-gray" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5 pt-2 space-y-3 sm:space-y-4 max-h-[70vh] overflow-y-auto">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-3 sm:gap-4 bg-white/60 rounded-2xl p-4 border border-warm-gray-light/25"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-terracotta/10 text-2xl">
                {step.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] text-terracotta uppercase tracking-wider">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-lg sm:text-xl text-ink mt-0.5">{step.title}</h3>
                <p className="text-sm text-warm-gray leading-relaxed mt-1">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 sm:px-7 pb-5 pt-1">
          <button
            onClick={onClose}
            className="w-full px-6 py-3.5 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark active:scale-95 transition-all font-medium cursor-pointer touch-target shadow-[0_10px_24px_-12px_rgba(196,96,58,0.6)]"
          >
            {t.gotIt}
          </button>
        </div>
      </div>
    </div>
  )
}
