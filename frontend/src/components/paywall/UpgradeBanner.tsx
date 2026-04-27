import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLocale } from '../../contexts/LocaleContext'

export default function UpgradeBanner() {
  const { user } = useAuth()
  const { t } = useLocale()
  if (!user || user.tier === 'pro') return null

  // Open beta — celebrate instead of nudging an upgrade
  if (user.betaOpen) {
    return (
      <div className="mx-4 sm:mx-6 mb-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-terracotta/15 to-gold/15 border border-terracotta/30">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm">
            🎉 <strong>{t.bannerBetaTitle}</strong> — {t.bannerBetaBody}
          </span>
        </div>
      </div>
    )
  }

  if (user.tier === 'free') {
    return (
      <Link
        to="/pricing"
        className="block mx-4 sm:mx-6 mb-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-terracotta/10 to-gold/10 border border-terracotta/20 hover:border-terracotta/40 transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm">
            ✨ <strong>{t.bannerFree}</strong> — {t.featTalkBody.split('.')[0]}
          </span>
          <span className="text-xs text-terracotta whitespace-nowrap">{t.bannerSeePlans}</span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to="/pricing"
      className="block mx-4 sm:mx-6 mb-3 px-4 py-2.5 rounded-xl bg-ink/5 hover:bg-ink/10 border border-ink/10 transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm">
          💬 <strong>{t.bannerBasic}</strong> — Pro
        </span>
        <span className="text-xs text-ink whitespace-nowrap">{t.bannerUpgrade}</span>
      </div>
    </Link>
  )
}
