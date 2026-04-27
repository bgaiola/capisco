import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import MarketingNav from '../components/marketing/MarketingNav'
import SEO from '../components/marketing/SEO'
import { useAuth } from '../contexts/AuthContext'
import { fetchAccount, type AccountResponse } from '../services/auth'
import { openBillingPortal, startCheckout } from '../services/billing'
import { ApiError } from '../services/api'
import { trackPurchaseInit } from '../services/analytics'

export default function AccountPage() {
  const { user, logout, refresh } = useAuth()
  const [search] = useSearchParams()
  const [account, setAccount] = useState<AccountResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    void load()
    // If user just completed checkout, ?checkout=success is set; refresh user so tier flips.
    if (search.get('checkout') === 'success') {
      void refresh()
    }
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    try {
      const a = await fetchAccount()
      setAccount(a)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load account.')
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
      setError(e instanceof ApiError ? e.message : 'Checkout failed.')
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
      setError(e instanceof ApiError ? e.message : 'Could not open billing portal.')
      setBusy(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-crema flex items-center justify-center">
        <div className="text-center">
          <p className="text-warm-gray">Loading account…</p>
        </div>
      </div>
    )
  }

  const intent = search.get('intent') as 'basic' | 'pro' | null

  return (
    <div className="min-h-screen flex flex-col bg-crema text-ink">
      <SEO title="Account" noindex />
      <MarketingNav />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {search.get('checkout') === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-800">
            🎉 Payment confirmed. Your plan is now active. Enjoy CAPPISCO.
          </div>
        )}
        {intent && user.tier !== intent && (
          <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl p-4 mb-6 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm">
              You picked the <strong>{intent === 'pro' ? 'Pro' : 'Basic'}</strong> plan. Continue
              to checkout to activate it.
            </div>
            <button
              onClick={() => handleUpgrade(intent)}
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark cursor-pointer"
            >
              Continue to checkout →
            </button>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">{error}</div>
        )}

        <h1 className="font-display text-4xl tracking-tight">Account</h1>
        <p className="text-warm-gray text-sm mt-1">{user.email}</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <Card title="Plan">
            <div className="flex items-center gap-2">
              <TierBadge tier={user.tier} />
              <span className="text-xs text-warm-gray">
                {user.status === 'active' ? '· Active' : `· ${user.status.replace('_', ' ')}`}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {user.tier !== 'pro' && (
                <button
                  onClick={() => handleUpgrade('pro')}
                  disabled={busy}
                  className="px-4 py-2 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/85 cursor-pointer disabled:opacity-50"
                >
                  Upgrade to Pro
                </button>
              )}
              {user.tier === 'free' && (
                <button
                  onClick={() => handleUpgrade('basic')}
                  disabled={busy}
                  className="px-4 py-2 rounded-xl border border-warm-gray-light/40 text-ink text-sm font-medium hover:bg-white cursor-pointer disabled:opacity-50"
                >
                  Choose Basic
                </button>
              )}
              {user.stripe_customer_id && (
                <button
                  onClick={handlePortal}
                  disabled={busy}
                  className="px-4 py-2 rounded-xl border border-warm-gray-light/40 text-ink text-sm font-medium hover:bg-white cursor-pointer disabled:opacity-50"
                >
                  Manage billing
                </button>
              )}
            </div>
          </Card>

          <Card title="Streak">
            <div className="font-display text-4xl">
              🔥 {account?.streak.days ?? user.streak_days ?? 0}
              <span className="text-base text-warm-gray font-body ml-2">days</span>
            </div>
            <p className="text-xs text-warm-gray mt-2">
              {account?.streak.lastDay ? `Last activity: ${account.streak.lastDay}` : 'Translate today to start your streak.'}
            </p>
          </Card>
        </div>

        {account?.quota && (
          <Card title="Usage" className="mt-4">
            <UsageRow
              label="Translations today"
              used={account.quota.translationsToday}
              limit={account.quota.translationsTodayLimit}
            />
            <UsageRow
              label="Voice synthesis (chars this month)"
              used={account.quota.synthCharsThisMonth}
              limit={account.quota.synthCharsThisMonthLimit}
            />
            <UsageRow
              label="Voice clones"
              used={account.quota.clonesEver}
              limit={account.quota.clonesEverLimit}
            />
          </Card>
        )}

        {account?.referral && (
          <Card title="Referral" className="mt-4">
            <p className="text-sm text-warm-gray">
              Invite a friend. They get 14 days free; you get a free month for every paid signup.
            </p>
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
                {copied ? 'Copied!' : 'Copy invite link'}
              </button>
              <span className="text-xs text-warm-gray">{account.referral.count} signed up</span>
            </div>
          </Card>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/app" className="px-4 py-2 rounded-xl bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark">
            Open the app
          </Link>
          <Link to="/pricing" className="px-4 py-2 rounded-xl border border-warm-gray-light/40 text-ink text-sm hover:bg-white">
            See plans
          </Link>
          <button
            onClick={async () => {
              await logout()
              window.location.href = '/'
            }}
            className="px-4 py-2 rounded-xl text-warm-gray text-sm hover:text-ink ml-auto cursor-pointer"
          >
            Log out
          </button>
        </div>
      </main>
    </div>
  )
}

function TierBadge({ tier }: { tier: 'free' | 'basic' | 'pro' }) {
  const map = {
    free: { label: 'Free', cls: 'bg-warm-gray/15 text-ink' },
    basic: { label: 'Basic', cls: 'bg-terracotta/15 text-terracotta' },
    pro: { label: 'Pro', cls: 'bg-ink text-white' },
  } as const
  const m = map[tier]
  return <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider ${m.cls}`}>{m.label}</span>
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
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-warm-gray font-mono">
          {used.toLocaleString()}{limit !== null ? ` / ${limit === 0 ? '—' : limit.toLocaleString()}` : ''}
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
