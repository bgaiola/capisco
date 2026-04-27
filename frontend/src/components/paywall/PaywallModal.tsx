import { useState } from 'react'
import { Link } from 'react-router-dom'
import { startCheckout } from '../../services/billing'
import { trackPurchaseInit } from '../../services/analytics'
import { ApiError } from '../../services/api'

interface Props {
  open: boolean
  onClose: () => void
  feature: 'voice-clone' | 'talk-mode' | 'unlimited' | 'phrase-packs'
  currentTier: 'free' | 'basic' | 'pro'
}

const FEATURES: Record<Props['feature'], { title: string; copy: string; suggestedTier: 'basic' | 'pro' }> = {
  'voice-clone': {
    title: 'Clone your voice',
    copy: 'Hear translations spoken in your own voice. Available on the Basic plan and up.',
    suggestedTier: 'basic',
  },
  'talk-mode': {
    title: 'Talk mode',
    copy: 'Real-time, two-way translation between two people. Each speaks their language and the other hears it in the speaker\'s own voice.',
    suggestedTier: 'pro',
  },
  unlimited: {
    title: 'Daily quota reached',
    copy: 'You\'ve used all 5 free translations today. Upgrade to Basic for unlimited translations and your own cloned voice.',
    suggestedTier: 'basic',
  },
  'phrase-packs': {
    title: 'Phrase packs',
    copy: 'Curated phrases for travel, restaurants, business and small talk. Available on the Basic plan and up.',
    suggestedTier: 'basic',
  },
}

export default function PaywallModal({ open, onClose, feature, currentTier }: Props) {
  const [busy, setBusy] = useState<'basic' | 'pro' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const cfg = FEATURES[feature]

  if (!open) return null

  async function go(tier: 'basic' | 'pro') {
    setError(null)
    setBusy(tier)
    trackPurchaseInit(tier)
    try {
      const url = await startCheckout(tier)
      window.location.href = url
    } catch (e) {
      setError(
        e instanceof ApiError && e.code === 'billing_disabled'
          ? 'Billing is not configured yet. Add your Stripe keys to enable checkout.'
          : e instanceof Error
            ? e.message
            : 'Could not start checkout.',
      )
      setBusy(null)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-up"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-warm-gray-light/20 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-full text-warm-gray hover:bg-warm-gray/10 cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="text-3xl">✨</div>
        <h2 className="font-display text-2xl mt-2 tracking-tight">{cfg.title}</h2>
        <p className="text-warm-gray text-sm mt-2">{cfg.copy}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 mt-4">{error}</div>
        )}

        <div className="mt-6 space-y-3">
          {cfg.suggestedTier === 'basic' && currentTier === 'free' && (
            <button
              onClick={() => go('basic')}
              disabled={busy !== null}
              className="w-full px-5 py-3.5 rounded-xl bg-terracotta text-white font-medium hover:bg-terracotta-dark active:scale-[.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {busy === 'basic' ? 'Redirecting…' : 'Upgrade to Basic — $9.99/mo'}
            </button>
          )}
          <button
            onClick={() => go('pro')}
            disabled={busy !== null}
            className={`w-full px-5 py-3.5 rounded-xl font-medium active:scale-[.98] transition-all disabled:opacity-50 cursor-pointer ${
              cfg.suggestedTier === 'pro'
                ? 'bg-terracotta text-white hover:bg-terracotta-dark'
                : 'bg-ink text-white hover:bg-ink/85'
            }`}
          >
            {busy === 'pro' ? 'Redirecting…' : 'Upgrade to Pro — $19.99/mo'}
          </button>
          <Link
            to="/pricing"
            className="block text-center text-sm text-warm-gray hover:text-ink transition-colors"
          >
            Compare all plans
          </Link>
        </div>
      </div>
    </div>
  )
}
