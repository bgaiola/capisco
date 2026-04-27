import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function UpgradeBanner() {
  const { user } = useAuth()
  if (!user || user.tier === 'pro') return null

  if (user.tier === 'free') {
    return (
      <Link
        to="/pricing"
        className="block mx-4 sm:mx-6 mb-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-terracotta/10 to-gold/10 border border-terracotta/20 hover:border-terracotta/40 transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm">
            ✨ <strong>Upgrade to Basic</strong> for voice cloning and unlimited translations
          </span>
          <span className="text-xs text-terracotta whitespace-nowrap">See plans →</span>
        </div>
      </Link>
    )
  }

  // Basic tier: nudge towards Pro for Talk mode
  return (
    <Link
      to="/pricing"
      className="block mx-4 sm:mx-6 mb-3 px-4 py-2.5 rounded-xl bg-ink/5 hover:bg-ink/10 border border-ink/10 transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm">
          💬 <strong>Talk mode</strong> — real-time two-way conversations on Pro
        </span>
        <span className="text-xs text-ink whitespace-nowrap">Upgrade →</span>
      </div>
    </Link>
  )
}
