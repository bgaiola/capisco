import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import MarketingNav from '../components/marketing/MarketingNav'
import SEO from '../components/marketing/SEO'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../contexts/LocaleContext'
import { fetchAccount, type AccountResponse } from '../services/auth'
import { openBillingPortal, startCheckout } from '../services/billing'
import { ApiError } from '../services/api'
import { trackPurchaseInit } from '../services/analytics'

export default function AccountPage() {
  const { user, logout, refresh } = useAuth()
  const { t } = useLocale()
  const [search] = useSearchParams()
  const [account, setAccount] = useState<AccountResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    void load()
    if (search.get('checkout') === 'success') {
      void refresh()
    }
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    try {
      const a = await fetchAccount()
      setAccount(a)
    } catch (e) {
      setError(e instanceof Error ? e.message : t.accountLoadFailed)
    }
  }

  async function handleUpgrade(tier: 'basic' | 'pro') {
    setBusy(true)
    setError(null)
    trackPurchaseInit(tier)
    try {
      const url = await startCheckout(tier)
      window.location.href = url
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.accountCheckoutFailed)
      setBusy(false)
    }
  }

  async function handlePortal() {
    setBusy(true)
    setError(null)
    try {
      const url = await openBillingPortal()
      window.location.href = url
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.accountPortalFailed)
      setBusy(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-crema flex items-center justify-center">
        <p className="text-warm-gray">{t.loading}</p>
      </div>
    )
  }

  const intent = search.get('intent') as 'basic' | 'pro' | null
  const tierLabel: Record<'free' | 'basic' | 'pro', string> = {
    free: t.pricingFreeName,
    basic: t.pricingBasicName,
    pro: t.pricingProName,
  }
  const statusLabel =
    user.status === 'active'
      ? t.accountStatusActive
      : user.status === 'past_due'
        ? t.accountStatusPastDue
        : t.accountStatusCanceled

  return (
    <div className="min-h-screen flex flex-col bg-crema text-ink">
      <SEO title={t.accountTitle} noindex />
      <MarketingNav />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {search.get('checkout') === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-800">
            {t.accountCheckoutSuccess}
          </div>
        )}
        {intent && user.tier !== intent && (
          <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl p-4 mb-6 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm">{t.accountCheckoutPending(tierLabel[intent])}</div>
            <button
              onClick={() => handleUpgrade(intent)}
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark cursor-pointer"
            >
              {t.accountContinueCheckout}
            </button>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">{error}</div>
        )}

        <h1 className="font-display text-4xl tracking-tight">{t.accountTitle}</h1>
        <p className="text-warm-gray text-sm mt-1">{user.email}</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <Card title={t.accountPlan}>
            <div className="flex items-center gap-2 flex-wrap">
              <TierBadge tier={user.tier} label={tierLabel[user.tier]} />
              <span className="text-xs text-warm-gray">· {statusLabel}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {user.tier !== 'pro' && (
                <button
                  onClick={() => handleUpgrade('pro')}
                  disabled={busy}
                  className="px-4 py-2 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/85 cursor-pointer disabled:opacity-50"
                >
                  {t.accountUpgradePro}
                </button>
              )}
              {user.tier === 'free' && (
                <button
                  onClick={() => handleUpgrade('basic')}
                  disabled={busy}
                  className="px-4 py-2 rounded-xl border border-warm-gray-light/40 text-ink text-sm font-medium hover:bg-white cursor-pointer disabled:opacity-50"
                >
                  {t.accountChooseBasic}
                </button>
              )}
              {user.stripe_customer_id && (
                <button
                  onClick={handlePortal}
                  disabled={busy}
                  className="px-4 py-2 rounded-xl border border-warm-gray-light/40 text-ink text-sm font-medium hover:bg-white cursor-pointer disabled:opacity-50"
                >
                  {t.accountManageBilling}
                </button>
              )}
            </div>
          </Card>

          <Card title={t.accountStreak}>
            <div className="font-display text-4xl">
              🔥 {account?.streak.days ?? user.streak_days ?? 0}
              <span className="text-base text-warm-gray font-body ml-2">{t.accountStreakDays}</span>
            </div>
            <p className="text-xs text-warm-gray mt-2">
              {account?.streak.lastDay ? t.accountStreakLast(account.streak.lastDay) : t.accountStreakHint}
            </p>
          </Card>
        </div>

        {account?.quota && (
          <Card title={t.accountUsage} className="mt-4">
            <UsageRow
              label={t.accountUsageTranslations}
              used={account.quota.translationsToday}
              limit={account.quota.translationsTodayLimit}
            />
            <UsageRow
              label={t.accountUsageSynth}
              used={account.quota.synthCharsThisMonth}
              limit={account.quota.synthCharsThisMonthLimit}
            />
            <UsageRow
              label={t.accountUsageClones}
              used={account.quota.clonesEver}
              limit={account.quota.clonesEverLimit}
            />
          </Card>
        )}

        {account?.referral && (
          <Card title={t.accountReferral} className="mt-4">
            <p className="text-sm text-warm-gray">{t.accountReferralCopyDescription}</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <code className="bg-warm-gray/10 px-4 py-2 rounded-xl font-mono text-lg tracking-wider self-start">
                {account.referral.code}
              </code>
              <button
                onClick={() => {
                  const link = `${window.location.origin}/signup?ref=${account.referral.code}`
                  navigator.clipboard.writeText(link).then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1500)
                  })
                }}
                className="px-4 py-2 rounded-xl border border-warm-gray-light/40 text-ink text-sm font-medium hover:bg-white cursor-pointer"
              >
                {copied ? t.accountReferralCopied : t.accountReferralCopy}
              </button>
              <span className="text-xs text-warm-gray">{t.accountReferralCount(account.referral.count)}</span>
            </div>
          </Card>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/app"
            className="px-4 py-2 rounded-xl bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark"
          >
            {t.accountOpenApp}
          </Link>
          <Link
            to="/pricing"
            className="px-4 py-2 rounded-xl border border-warm-gray-light/40 text-ink text-sm hover:bg-white"
          >
            {t.accountSeePlans}
          </Link>
          <button
            onClick={async () => {
              await logout()
              window.location.href = '/'
            }}
            className="px-4 py-2 rounded-xl text-warm-gray text-sm hover:text-ink ml-auto cursor-pointer"
          >
            {t.accountLogout}
          </button>
        </div>
      </main>
    </div>
  )
}

function TierBadge({ tier, label }: { tier: 'free' | 'basic' | 'pro'; label: string }) {
  const map = {
    free: 'bg-warm-gray/15 text-ink',
    basic: 'bg-terracotta/15 text-terracotta',
    pro: 'bg-ink text-white',
  } as const
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider ${map[tier]}`}>
      {label}
    </span>
  )
}

function Card({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-2xl border border-warm-gray-light/30 p-6 ${className}`}>
      <div className="text-xs uppercase tracking-wider text-warm-gray-light mb-3">{title}</div>
      {children}
    </section>
  )
}

function UsageRow({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  const pct = limit && limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-sm mb-1 gap-3">
        <span>{label}</span>
        <span className="text-warm-gray font-mono">
          {used.toLocaleString()}
          {limit !== null ? ` / ${limit === 0 ? '—' : limit.toLocaleString()}` : ''}
        </span>
      </div>
      {limit !== null && limit > 0 && (
        <div className="h-1.5 bg-warm-gray/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-gold' : 'bg-terracotta'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}
