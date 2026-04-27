import { Link } from 'react-router-dom'
import MarketingNav from '../components/marketing/MarketingNav'
import MarketingFooter from '../components/marketing/MarketingFooter'
import SEO from '../components/marketing/SEO'
import { useAuth } from '../contexts/AuthContext'

export default function LandingPage() {
  const { user } = useAuth()
  const ctaTo = user ? '/app' : '/signup'
  const ctaText = user ? 'Open the app' : 'Start free — no card needed'

  return (
    <div className="min-h-screen flex flex-col bg-crema text-ink">
      <SEO />
      <MarketingNav />

      {/* Hero */}
      <section className="px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-terracotta bg-terracotta/10 px-3 py-1 rounded-full mb-6">
            Voice cloning · Real-time translation
          </span>
          <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] tracking-tight">
            Speak any language
            <span className="block text-terracotta mt-2">in your own voice.</span>
          </h1>
          <p className="font-body text-lg sm:text-xl text-warm-gray mt-6 sm:mt-8 max-w-2xl mx-auto">
            CAPPISCO clones your voice once and lets you hear yourself speaking Italian, Spanish,
            French, English, Portuguese and more. Real-time, two-way, with cultural notes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={ctaTo}
              className="px-8 py-4 rounded-2xl bg-terracotta text-white font-medium hover:bg-terracotta-dark active:scale-95 transition-all shadow-[0_12px_32px_-12px_rgba(196,96,58,0.6)] w-full sm:w-auto"
            >
              {ctaText}
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 rounded-2xl border border-warm-gray-light/40 text-ink hover:bg-white/60 transition-all w-full sm:w-auto"
            >
              See pricing
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs sm:text-sm text-warm-gray">
            <span>🇮🇹 IT</span><span>🇪🇸 ES</span><span>🇺🇸 EN</span><span>🇧🇷 PT</span><span>🇫🇷 FR</span><span className="hidden sm:inline">🇨🇳 ZH</span><span className="hidden sm:inline">🇷🇺 RU</span><span className="hidden sm:inline">🇳🇱 NL</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-4 sm:px-6 py-16 sm:py-24 bg-white/40 border-y border-warm-gray-light/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl sm:text-5xl text-center tracking-tight">How it works</h2>
          <p className="text-warm-gray text-center mt-3 max-w-xl mx-auto">
            Three steps. About a minute the first time. Then it just works.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Step n={1} emoji="🎙️" title="Record once">
              Read a short passage out loud — about 30 seconds. We create a personal voice profile
              tied to your account.
            </Step>
            <Step n={2} emoji="🔁" title="Translate anything">
              Speak or type a phrase. We translate it into the language you're learning, with
              cultural notes for tricky idioms.
            </Step>
            <Step n={3} emoji="🔊" title="Hear yourself">
              The translation plays back in <em>your own voice</em>. Hear what you sound like in
              another language — instantly.
            </Step>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-center">Built for real conversations</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Feature emoji="💬" title="Talk mode (Pro)">
              A real-time, two-way translator. Each person speaks their own language; the other
              hears it — in the speaker's own voice. Hand the phone over and keep the chat going.
            </Feature>
            <Feature emoji="📚" title="Phrase packs">
              Travel, restaurants, business, small talk. Curated phrases ready to practice in your
              voice — perfect for trips and presentations.
            </Feature>
            <Feature emoji="🔥" title="Daily streak">
              Practice every day, build the streak. Small dopamine hits, big language gains.
            </Feature>
            <Feature emoji="🎁" title="Refer friends, get a free month">
              Share your code. Friends get 14 days free; you get a month off your subscription for
              every paid signup.
            </Feature>
            <Feature emoji="🔒" title="Private by design">
              Your voice clone is bound to your account. We never share or train on your voice.
              Cancel anytime, full deletion in one click.
            </Feature>
            <Feature emoji="📱" title="Mobile-first PWA">
              Works in the browser, installs to your home screen. No app store, no waiting.
            </Feature>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="px-4 sm:px-6 py-16 sm:py-24 bg-white/40 border-y border-warm-gray-light/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-center">Pricing</h2>
          <p className="text-warm-gray text-center mt-3 max-w-xl mx-auto">
            Start free. Unlock voice cloning on Basic. Add the two-way Talk mode on Pro.
          </p>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mt-12">
            <PriceCard
              name="Free"
              price="$0"
              tagline="See it in action"
              cta={user ? 'Open the app' : 'Start free'}
              ctaTo={ctaTo}
              features={[
                '5 translations / day',
                'System voice (your phone\'s)',
                'Cultural notes',
                'All 9 languages',
              ]}
            />
            <PriceCard
              name="Basic"
              price="$9.99"
              cadence="/month"
              tagline="Your own voice, unlimited"
              accent
              cta="Choose Basic"
              ctaTo="/pricing"
              features={[
                'Everything in Free',
                'Clone your voice (ElevenLabs)',
                'Unlimited translations',
                'Phrase packs',
                'Download MP3 audio',
              ]}
            />
            <PriceCard
              name="Pro"
              price="$19.99"
              cadence="/month"
              tagline="Two voices, two languages"
              cta="Choose Pro"
              ctaTo="/pricing"
              features={[
                'Everything in Basic',
                '✨ Talk mode (real-time chat)',
                'Clone a partner\'s voice',
                'Higher monthly limits',
                'Priority support',
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-center">Questions</h2>
          <div className="mt-10 space-y-4">
            <Faq q="Is it really my voice?">
              Yes. We use ElevenLabs voice cloning under the hood — about 30 seconds of clear
              speech is enough. Your clone is tied to your account.
            </Faq>
            <Faq q="What's the difference between Basic and Pro?">
              Basic gives you voice cloning for yourself, unlimited translations and phrase packs.
              Pro adds <em>Talk mode</em>: clone a partner's voice too and have a real two-way
              translated conversation, where each person hears the other in the speaker's own
              voice.
            </Faq>
            <Faq q="Can I cancel anytime?">
              Yes. Manage everything from the account dashboard — change plan, update card, or
              cancel. No phone calls.
            </Faq>
            <Faq q="What about my privacy?">
              Your voice clone lives in your account and is never shared. We don't train models on
              your data. You can delete your account and all clones at any time.
            </Faq>
            <Faq q="Which browsers work?">
              Anything modern. Voice mode requires Chrome/Edge for speech recognition; text mode
              works everywhere including Safari.
            </Faq>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 py-20 sm:py-24 bg-terracotta text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight">
            Hear yourself speak another language.
          </h2>
          <p className="text-white/80 mt-4 text-lg">It's strangely magical. Try it free.</p>
          <Link
            to={ctaTo}
            className="inline-block mt-8 px-8 py-4 rounded-2xl bg-white text-terracotta font-medium hover:bg-white/90 transition-all"
          >
            {ctaText}
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

function Step({ n, emoji, title, children }: { n: number; emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/70 rounded-2xl p-6 border border-warm-gray-light/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="font-mono text-xs text-terracotta">0{n}</span>
        <span className="text-3xl">{emoji}</span>
      </div>
      <h3 className="font-display text-xl mb-2">{title}</h3>
      <p className="text-warm-gray text-sm">{children}</p>
    </div>
  )
}

function Feature({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/70 rounded-2xl p-6 border border-warm-gray-light/30">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-display text-xl mb-2">{title}</h3>
      <p className="text-warm-gray text-sm">{children}</p>
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
      className={`rounded-2xl p-6 sm:p-8 border ${
        accent
          ? 'bg-ink text-white border-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,0.4)] md:scale-105'
          : 'bg-white border-warm-gray-light/30'
      }`}
    >
      <div className="font-mono text-xs uppercase tracking-wider opacity-70">{name}</div>
      <div className="flex items-end gap-1 mt-2">
        <span className="font-display text-4xl">{price}</span>
        {cadence && <span className={`text-sm ${accent ? 'opacity-70' : 'text-warm-gray'} mb-1`}>{cadence}</span>}
      </div>
      <p className={`mt-2 text-sm ${accent ? 'opacity-80' : 'text-warm-gray'}`}>{tagline}</p>
      <ul className={`mt-6 space-y-2 text-sm ${accent ? '' : 'text-ink'}`}>
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-terracotta mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to={ctaTo}
        className={`block mt-8 text-center px-5 py-3 rounded-xl font-medium transition-all ${
          accent ? 'bg-terracotta text-white hover:bg-terracotta-dark' : 'bg-ink text-white hover:bg-ink/80'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group bg-white/70 rounded-2xl px-5 py-4 border border-warm-gray-light/30 [&_summary]:cursor-pointer">
      <summary className="font-display text-lg flex items-center justify-between gap-4">
        {q}
        <span className="text-terracotta transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="text-warm-gray text-sm mt-3 leading-relaxed">{children}</p>
    </details>
  )
}
