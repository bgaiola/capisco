import { Link } from 'react-router-dom'
import MarketingNav from '../components/marketing/MarketingNav'
import MarketingFooter from '../components/marketing/MarketingFooter'
import SEO from '../components/marketing/SEO'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../contexts/LocaleContext'

export default function LandingPage() {
  const { user } = useAuth()
  const { t } = useLocale()
  const ctaTo = user ? '/app' : '/signup'
  const ctaText = user ? t.heroCtaApp : t.heroCtaFree

  return (
    <div className="min-h-screen flex flex-col bg-crema text-ink">
      <SEO description={t.heroSubtitle} />
      <MarketingNav />

      {/* ===== HERO — split layout ===== */}
      <section className="px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-14 sm:pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Copy column */}
          <div className="text-center lg:text-left">
            <span className="inline-block font-mono text-[10px] sm:text-xs uppercase tracking-widest text-terracotta bg-terracotta/10 px-3 py-1 rounded-full mb-5 sm:mb-6">
              {t.heroBadge}
            </span>
            <h1 className="font-display text-[2.5rem] leading-[1.05] sm:text-6xl lg:text-7xl tracking-tight">
              {t.heroTitle1}
              <span className="block text-terracotta mt-1 sm:mt-2 italic">{t.heroTitle2}</span>
            </h1>
            <p className="font-body text-base sm:text-lg lg:text-xl text-warm-gray mt-5 sm:mt-7 max-w-xl mx-auto lg:mx-0">
              {t.heroSubtitle}
            </p>
            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
              <Link
                to={ctaTo}
                className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-terracotta text-white font-medium text-center hover:bg-terracotta-dark active:scale-95 transition-all shadow-[0_12px_32px_-12px_rgba(196,96,58,0.6)] text-base"
              >
                {ctaText}
              </Link>
              <Link
                to="/pricing"
                className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl border border-warm-gray-light/40 text-ink hover:bg-white/60 transition-all text-center text-base"
              >
                {t.heroCtaPricing}
              </Link>
            </div>
            <div className="mt-7 flex items-center justify-center lg:justify-start gap-3 sm:gap-5 text-base sm:text-lg flex-wrap">
              {['🇮🇹', '🇪🇸', '🇺🇸', '🇧🇷', '🇫🇷', '🇨🇳', '🇷🇺', '🇳🇱', '🇵🇹'].map((flag) => (
                <span key={flag} className="opacity-80">{flag}</span>
              ))}
            </div>
          </div>

          {/* Demo card */}
          <DemoCard t={t} />
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="px-4 sm:px-6 py-16 sm:py-24 bg-white/40 border-y border-warm-gray-light/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-5xl tracking-tight">{t.howTitle}</h2>
            <p className="text-warm-gray mt-3">{t.howSubtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-14">
            <Step n={1} emoji="🎙️" title={t.howStep1Title} body={t.howStep1Body} />
            <Step n={2} emoji="🔁" title={t.howStep2Title} body={t.howStep2Body} />
            <Step n={3} emoji="🔊" title={t.howStep3Title} body={t.howStep3Body} />
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-center max-w-3xl mx-auto">
            {t.featuresTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-14">
            <Feature emoji="💬" title={t.featTalkTitle} body={t.featTalkBody} />
            <Feature emoji="📚" title={t.featPacksTitle} body={t.featPacksBody} />
            <Feature emoji="🔥" title={t.featStreakTitle} body={t.featStreakBody} />
            <Feature emoji="🎁" title={t.featReferTitle} body={t.featReferBody} />
            <Feature emoji="🔒" title={t.featPrivacyTitle} body={t.featPrivacyBody} />
            <Feature emoji="📱" title={t.featPwaTitle} body={t.featPwaBody} />
          </div>
        </div>
      </section>

      {/* ===== PRICING TEASER ===== */}
      <section
        id="pricing"
        className="px-4 sm:px-6 py-16 sm:py-24 bg-white/40 border-y border-warm-gray-light/20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-5xl tracking-tight">{t.pricingTitle}</h2>
            <p className="text-warm-gray mt-3">{t.pricingSubtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-14">
            <PriceCard
              name={t.pricingFreeName}
              price={t.pricingPriceFree}
              tagline={t.pricingFreeTagline}
              cta={user ? t.pricingFreeCtaUser : t.pricingFreeCtaGuest}
              ctaTo={ctaTo}
              features={t.planFreeTeaserFeats}
            />
            <PriceCard
              name={t.pricingBasicName}
              price={t.pricingPriceBasic}
              cadence={t.pricingPriceBasicCadence}
              tagline={t.pricingBasicTagline}
              accent
              cta={t.pricingBasicCta}
              ctaTo="/pricing"
              features={t.planBasicTeaserFeats}
            />
            <PriceCard
              name={t.pricingProName}
              price={t.pricingPricePro}
              cadence={t.pricingPriceProCadence}
              tagline={t.pricingProTagline}
              cta={t.pricingProCta}
              ctaTo="/pricing"
              features={t.planProTeaserFeats}
            />
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-center">{t.faqTitle}</h2>
          <div className="mt-10 space-y-3 sm:space-y-4">
            <Faq q={t.faqQ1} a={t.faqA1} />
            <Faq q={t.faqQ2} a={t.faqA2} />
            <Faq q={t.faqQ3} a={t.faqA3} />
            <Faq q={t.faqQ4} a={t.faqA4} />
            <Faq q={t.faqQ5} a={t.faqA5} />
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 bg-terracotta text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight">{t.finalCtaTitle}</h2>
          <p className="text-white/85 mt-4 text-base sm:text-lg">{t.finalCtaSubtitle}</p>
          <Link
            to={ctaTo}
            className="inline-block mt-7 sm:mt-9 px-7 py-4 rounded-2xl bg-white text-terracotta font-medium hover:bg-white/90 transition-all"
          >
            {ctaText}
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

/* ---------- visual demo (the “wow” card on hero) ---------- */
function DemoCard({ t }: { t: ReturnType<typeof useLocale>['t'] }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-terracotta/15 via-gold/10 to-transparent rounded-[2rem] blur-2xl" />
      <div className="bg-white rounded-3xl border border-warm-gray-light/30 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] p-5 sm:p-6 max-w-md mx-auto lg:max-w-none">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-warm-gray">
            {t.heroBadge.split('·')[0]?.trim()}
          </span>
        </div>

        <DemoBubble side="me" lang="🇧🇷 PT" text="Você quer um café?" />
        <DemoBubble side="them" lang="🇮🇹 IT" text="Vuoi un caffè?" emphasized />

        <div className="mt-3 flex items-end gap-0.5 h-5">
          {[0.4, 0.7, 1, 0.65, 0.85, 0.5, 0.7].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-terracotta/80 rounded-full"
              style={{ height: `${h * 100}%` }}
            />
          ))}
          <span className="ml-2 text-[10px] font-mono text-warm-gray">
            {t.howStep3Title.toLowerCase()}
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-warm-gray-light/20 grid grid-cols-3 gap-2 text-[10px] sm:text-xs">
          <DemoStat emoji="🎙️" label="30s" />
          <DemoStat emoji="🌍" label="9 idiomas" />
          <DemoStat emoji="⚡️" label="instant" />
        </div>
      </div>
    </div>
  )
}

function DemoBubble({
  side,
  lang,
  text,
  emphasized,
}: {
  side: 'me' | 'them'
  lang: string
  text: string
  emphasized?: boolean
}) {
  const isMe = side === 'me'
  return (
    <div className={`mb-2 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm sm:text-base ${
          isMe
            ? 'bg-warm-gray/10 text-ink rounded-br-md'
            : emphasized
              ? 'bg-terracotta text-white rounded-bl-md shadow-[0_10px_24px_-12px_rgba(196,96,58,0.6)]'
              : 'bg-warm-gray/10 text-ink rounded-bl-md'
        }`}
      >
        <div className={`text-[10px] font-mono uppercase tracking-wider mb-0.5 ${
          isMe ? 'text-warm-gray-light' : emphasized ? 'text-white/80' : 'text-warm-gray-light'
        }`}>
          {lang}
        </div>
        <div className={emphasized ? 'italic font-display text-lg sm:text-xl' : ''}>{text}</div>
      </div>
    </div>
  )
}

function DemoStat({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-base">{emoji}</div>
      <div className="text-warm-gray mt-0.5">{label}</div>
    </div>
  )
}

function Step({ n, emoji, title, body }: { n: number; emoji: string; title: string; body: string }) {
  return (
    <div className="bg-white/70 rounded-2xl p-5 sm:p-6 border border-warm-gray-light/30 hover:border-terracotta/30 transition-colors h-full">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="font-mono text-xs text-terracotta">0{n}</span>
        <span className="text-3xl">{emoji}</span>
      </div>
      <h3 className="font-display text-xl mb-2">{title}</h3>
      <p className="text-warm-gray text-sm leading-relaxed">{body}</p>
    </div>
  )
}

function Feature({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="bg-white/70 rounded-2xl p-5 sm:p-6 border border-warm-gray-light/30 hover:border-terracotta/30 transition-colors h-full">
      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{emoji}</div>
      <h3 className="font-display text-xl mb-2">{title}</h3>
      <p className="text-warm-gray text-sm leading-relaxed">{body}</p>
    </div>
  )
}

interface PriceCardProps {
  name: string
  price: string
  cadence?: string
  tagline: string
  features: string[]
  cta: string
  ctaTo: string
  accent?: boolean
}

function PriceCard({ name, price, cadence, tagline, features, cta, ctaTo, accent }: PriceCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 border h-full flex flex-col ${
        accent
          ? 'bg-ink text-white border-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,0.4)] lg:scale-[1.03] relative'
          : 'bg-white border-warm-gray-light/30'
      }`}
    >
      <div className="font-mono text-xs uppercase tracking-wider opacity-70">{name}</div>
      <div className="flex items-end gap-1 mt-2">
        <span className="font-display text-4xl sm:text-5xl">{price}</span>
        {cadence && (
          <span className={`text-sm ${accent ? 'opacity-70' : 'text-warm-gray'} mb-1.5`}>{cadence}</span>
        )}
      </div>
      <p className={`mt-2 text-sm ${accent ? 'opacity-80' : 'text-warm-gray'}`}>{tagline}</p>
      <ul className="mt-5 space-y-2 text-sm flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className={`mt-0.5 ${accent ? 'text-terracotta-light' : 'text-terracotta'}`}>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to={ctaTo}
        className={`block mt-6 text-center px-5 py-3 rounded-xl font-medium transition-all ${
          accent ? 'bg-terracotta text-white hover:bg-terracotta-dark' : 'bg-ink text-white hover:bg-ink/85'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group bg-white/70 rounded-2xl px-5 py-4 border border-warm-gray-light/30 [&_summary]:cursor-pointer">
      <summary className="font-display text-lg flex items-center justify-between gap-4">
        <span>{q}</span>
        <span className="text-terracotta transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="text-warm-gray text-sm mt-3 leading-relaxed">{a}</p>
    </details>
  )
}
