import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MarketingNav from '../components/marketing/MarketingNav'
import MarketingFooter from '../components/marketing/MarketingFooter'
import SEO from '../components/marketing/SEO'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../contexts/LocaleContext'
import { startCheckout } from '../services/billing'
import { trackPurchaseInit } from '../services/analytics'
import { ApiError } from '../services/api'

export default function PricingPage() {
  const { user } = useAuth()
  const { t } = useLocale()
  const navigate = useNavigate()
  const [loadingTier, setLoadingTier] = useState<'basic' | 'pro' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const plans: Array<{
    tier: 'free' | 'basic' | 'pro'
    name: string
    price: string
    cadence: string
    tagline: string
    features: string[]
    accent?: boolean
  }> = [
    {
      tier: 'free',
      name: t.pricingFreeName,
      price: t.pricingPriceFree,
      cadence: '',
      tagline: t.pricingFreeTagline,
      features: t.planFreeFeats,
    },
    {
      tier: 'basic',
      name: t.pricingBasicName,
      price: t.pricingPriceBasic,
      cadence: t.pricingPriceBasicCadence,
      tagline: t.pricingBasicTagline,
      accent: true,
      features: t.planBasicFeats,
    },
    {
      tier: 'pro',
      name: t.pricingProName,
      price: t.pricingPricePro,
      cadence: t.pricingPriceProCadence,
      tagline: t.pricingProTagline,
      features: t.planProFeats,
    },
  ]

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
        setError(t.pricingPageBillingDisabled)
      } else {
        setError(e instanceof Error ? e.message : t.errorGeneric)
      }
      setLoadingTier(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-crema text-ink">
      <SEO title={t.pricingPageTitle} description={t.pricingPageSubtitle} />
      <MarketingNav />

      <section className="px-4 sm:px-6 pt-10 sm:pt-14 pb-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-6xl tracking-tight">{t.pricingPageTitle}</h1>
          <p className="text-warm-gray mt-4 max-w-xl mx-auto">{t.pricingPageSubtitle}</p>
          {error && (
            <div className="mt-6 max-w-xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {plans.map((p) => {
            const isCurrent = user?.tier === p.tier && user.status === 'active'
            const accent = p.accent
            return (
              <div
                key={p.tier}
                className={`rounded-2xl p-6 sm:p-8 border h-full flex flex-col relative ${
                  accent
                    ? 'bg-ink text-white border-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,0.4)] lg:scale-[1.03]'
                    : 'bg-white border-warm-gray-light/30'
                }`}
              >
                {accent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terracotta text-white text-xs font-mono px-3 py-1 rounded-full">
                    {t.pricingMostPopular}
                  </span>
                )}
                <div className="font-mono text-xs uppercase tracking-wider opacity-70">{p.name}</div>
                <div className="flex items-end gap-1 mt-2">
                  <span className="font-display text-4xl sm:text-5xl">{p.price}</span>
                  {p.cadence && (
                    <span className={`text-sm ${accent ? 'opacity-70' : 'text-warm-gray'} mb-1.5`}>
                      {p.cadence}
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-sm ${accent ? 'opacity-80' : 'text-warm-gray'}`}>{p.tagline}</p>
                <ul className="mt-5 space-y-2 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className={`mt-0.5 ${accent ? 'text-terracotta-light' : 'text-terracotta'}`}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {p.tier === 'free' ? (
                    <Link
                      to={user ? '/app' : '/signup'}
                      className={`block text-center px-5 py-3 rounded-xl font-medium transition-all ${
                        accent ? 'bg-terracotta text-white' : 'bg-ink text-white hover:bg-ink/85'
                      }`}
                    >
                      {user ? t.pricingFreeCtaUser : t.pricingFreeCtaGuest}
                    </Link>
                  ) : (
                    <button
                      onClick={() => chooseTier(p.tier as 'basic' | 'pro')}
                      disabled={loadingTier !== null || isCurrent}
                      className={`w-full px-5 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                        accent
                          ? 'bg-terracotta text-white hover:bg-terracotta-dark'
                          : 'bg-ink text-white hover:bg-ink/85'
                      }`}
                    >
                      {isCurrent
                        ? t.pricingCurrentPlan
                        : loadingTier === p.tier
                          ? t.pricingPageRedirecting
                          : p.tier === 'basic'
                            ? t.pricingBasicCta
                            : t.pricingProCta}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-warm-gray text-sm mt-10 max-w-xl mx-auto">
          <Link to="/account" className="text-terracotta hover:underline">
            {t.pricingPageManage}
          </Link>
        </p>
      </section>

      <MarketingFooter />
    </div>
  )
}
