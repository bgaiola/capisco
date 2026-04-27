import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MarketingNav from '../components/marketing/MarketingNav'
import MarketingFooter from '../components/marketing/MarketingFooter'
import SEO from '../components/marketing/SEO'
import { useAuth } from '../contexts/AuthContext'
import { startCheckout } from '../services/billing'
import { trackPurchaseInit } from '../services/analytics'
import { ApiError } from '../services/api'

const plans = [
  {
    tier: 'free' as const,
    name: 'Free',
    price: '$0',
    cadence: '',
    tagline: 'See it in action',
    features: [
      '5 translations / day',
      'System voice fallback',
      'Cultural notes',
      'All 9 languages',
    ],
  },
  {
    tier: 'basic' as const,
    name: 'Basic',
    price: '$9.99',
    cadence: '/month',
    tagline: 'Your own voice, unlimited',
    accent: true,
    features: [
      'Everything in Free',
      'Clone your voice',
      'Unlimited translations',
      'Phrase packs (travel, restaurant, business…)',
      'Download MP3 audio',
      '50,000 synthesis chars / month',
    ],
  },
  {
    tier: 'pro' as const,
    name: 'Pro',
    price: '$19.99',
    cadence: '/month',
    tagline: 'Two voices, two languages',
    features: [
      'Everything in Basic',
      '✨ Talk mode (live two-way translator)',
      "Clone a partner's voice",
      '250,000 synthesis chars / month',
      'Priority support',
    ],
  },
]

export default function PricingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loadingTier, setLoadingTier] = useState<'basic' | 'pro' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function chooseTier(tier: 'basic' | 'pro') {
    setError(null)
    if (!user) {
      navigate(`/signup?next=/pricing&intent=${tier}`)
      return
    }
    if (user.tier === tier && user.status === 'active') {
      navigate('/account')
      return
    }
    setLoadingTier(tier)
    trackPurchaseInit(tier)
    try {
      const url = await startCheckout(tier)
      window.location.href = url
    } catch (e) {
      if (e instanceof ApiError && e.code === 'billing_disabled') {
        setError(
          'Billing is not configured yet on this server. Add your Stripe keys to the backend .env to enable checkout.',
        )
      } else {
        setError(e instanceof Error ? e.message : 'Could not start checkout.')
      }
      setLoadingTier(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-crema text-ink">
      <SEO title="Pricing" description="Simple plans. Free to try, Basic for voice cloning, Pro for two-way Talk mode." />
      <MarketingNav />

      <section className="px-4 sm:px-6 pt-12 pb-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-6xl tracking-tight">Simple pricing</h1>
          <p className="text-warm-gray mt-4 max-w-xl mx-auto">
            No hidden fees. Cancel anytime. 14-day money-back guarantee.
          </p>
          {error && (
            <div className="mt-6 max-w-xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {plans.map((p) => {
            const isCurrent = user?.tier === p.tier && user.status === 'active'
            const accent = p.accent
            return (
              <div
                key={p.tier}
                className={`rounded-2xl p-6 sm:p-8 border relative ${
                  accent
                    ? 'bg-ink text-white border-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,0.4)] md:scale-105'
                    : 'bg-white border-warm-gray-light/30'
                }`}
              >
                {accent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terracotta text-white text-xs font-mono px-3 py-1 rounded-full">
                    Most popular
                  </span>
                )}
                <div className="font-mono text-xs uppercase tracking-wider opacity-70">{p.name}</div>
                <div className="flex items-end gap-1 mt-2">
                  <span className="font-display text-5xl">{p.price}</span>
                  {p.cadence && (
                    <span className={`text-sm ${accent ? 'opacity-70' : 'text-warm-gray'} mb-1.5`}>{p.cadence}</span>
                  )}
                </div>
                <p className={`mt-2 text-sm ${accent ? 'opacity-80' : 'text-warm-gray'}`}>{p.tagline}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-terracotta mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {p.tier === 'free' ? (
                    <Link
                      to={user ? '/app' : '/signup'}
                      className={`block text-center px-5 py-3 rounded-xl font-medium transition-all ${
                        accent ? 'bg-terracotta text-white' : 'bg-ink text-white hover:bg-ink/80'
                      }`}
                    >
                      {user ? 'Open the app' : 'Start free'}
                    </Link>
                  ) : (
                    <button
                      onClick={() => chooseTier(p.tier as 'basic' | 'pro')}
                      disabled={loadingTier !== null || isCurrent}
                      className={`w-full px-5 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                        accent
                          ? 'bg-terracotta text-white hover:bg-terracotta-dark'
                          : 'bg-ink text-white hover:bg-ink/80'
                      }`}
                    >
                      {isCurrent
                        ? 'Your current plan'
                        : loadingTier === p.tier
                          ? 'Redirecting…'
                          : `Choose ${p.name}`}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-warm-gray text-sm mt-10 max-w-xl mx-auto">
          Already a member? <Link to="/account" className="text-terracotta hover:underline">Manage your subscription</Link>.
        </p>
      </section>

      <MarketingFooter />
    </div>
  )
}
