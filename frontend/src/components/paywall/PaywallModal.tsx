import { useState } from 'react'
import { Link } from 'react-router-dom'
import { startCheckout } from '../../services/billing'
import { trackPurchaseInit } from '../../services/analytics'
import { ApiError } from '../../services/api'
import { useLocale } from '../../contexts/LocaleContext'

interface Props {
  open: boolean
  onClose: () => void
  feature: 'voice-clone' | 'talk-mode' | 'unlimited' | 'phrase-packs'
  currentTier: 'free' | 'basic' | 'pro'
}

export default function PaywallModal({ open, onClose, feature, currentTier }: Props) {
  const { t } = useLocale()
  const [busy, setBusy] = useState<'basic' | 'pro' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const cfg: { title: string; copy: string; suggested: 'basic' | 'pro' } =
    feature === 'voice-clone'
      ? { title: t.paywallVoiceCloneTitle, copy: t.paywallVoiceCloneCopy, suggested: 'basic' }
      : feature === 'talk-mode'
        ? { title: t.paywallTalkModeTitle, copy: t.paywallTalkModeCopy, suggested: 'pro' }
        : feature === 'unlimited'
          ? { title: t.paywallUnlimitedTitle, copy: t.paywallUnlimitedCopy, suggested: 'basic' }
          : { title: t.paywallPacksTitle, copy: t.paywallPacksCopy, suggested: 'basic' }

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
          ? t.paywallBillingDisabled
          : e instanceof Error
            ? e.message
            : t.errorGeneric,
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
          aria-label={t.paywallClose}
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
          {cfg.suggested === 'basic' && currentTier === 'free' && (
            <button
              onClick={() => go('basic')}
              disabled={busy !== null}
              className="w-full px-5 py-3.5 rounded-xl bg-terracotta text-white font-medium hover:bg-terracotta-dark active:scale-[.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {busy === 'basic' ? t.paywallRedirecting : t.paywallUpgradeBasic}
            </button>
          )}
          <button
            onClick={() => go('pro')}
            disabled={busy !== null}
            className={`w-full px-5 py-3.5 rounded-xl font-medium active:scale-[.98] transition-all disabled:opacity-50 cursor-pointer ${
              cfg.suggested === 'pro'
                ? 'bg-terracotta text-white hover:bg-terracotta-dark'
                : 'bg-ink text-white hover:bg-ink/85'
            }`}
          >
            {busy === 'pro' ? t.paywallRedirecting : t.paywallUpgradePro}
          </button>
          <Link to="/pricing" className="block text-center text-sm text-warm-gray hover:text-ink transition-colors">
            {t.paywallCompare}
          </Link>
        </div>
      </div>
    </div>
  )
}
