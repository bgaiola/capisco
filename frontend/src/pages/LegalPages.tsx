import MarketingNav from '../components/marketing/MarketingNav'
import MarketingFooter from '../components/marketing/MarketingFooter'
import SEO from '../components/marketing/SEO'

const wrap = (title: string, body: React.ReactNode) => (
  <div className="min-h-screen flex flex-col bg-crema text-ink">
    <SEO title={title} />
    <MarketingNav />
    <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl tracking-tight">{title}</h1>
      <article className="prose prose-stone max-w-none mt-6 text-warm-gray text-sm leading-relaxed [&>h2]:text-ink [&>h2]:mt-6 [&>h2]:font-display [&>h2]:text-xl">
        {body}
      </article>
    </main>
    <MarketingFooter />
  </div>
)

export function PrivacyPage() {
  return wrap(
    'Privacy',
    <>
      <p>
        We take your privacy seriously. CAPPISCO is built around the idea that your voice belongs
        to you. This page summarizes what we collect and why.
      </p>
      <h2>Data we store</h2>
      <ul>
        <li>Your email and a hashed password.</li>
        <li>Your subscription status (provided by Stripe).</li>
        <li>Usage counters (translations, synthesis characters) for quota enforcement.</li>
        <li>References to voice clones you create (the audio is stored at ElevenLabs, never on our servers).</li>
      </ul>
      <h2>We never</h2>
      <ul>
        <li>Sell your data.</li>
        <li>Train models on your voice.</li>
        <li>Share your voice clone with anyone else.</li>
      </ul>
      <h2>Account deletion</h2>
      <p>You can delete your account at any time by contacting support; we wipe all clones and data within 7 days.</p>
      <p className="mt-6 text-xs text-warm-gray-light">Last updated: today.</p>
    </>,
  )
}

export function TermsPage() {
  return wrap(
    'Terms',
    <>
      <p>
        By using CAPPISCO you agree to use the service for lawful, personal purposes. You will not
        use it to impersonate others, generate misleading audio, or violate any applicable law.
      </p>
      <h2>Subscriptions</h2>
      <p>
        Subscriptions renew automatically on a monthly basis. You can cancel at any time through
        the billing portal; cancellation takes effect at the end of the current period.
      </p>
      <h2>Refunds</h2>
      <p>
        We offer a 14-day money-back guarantee on first-time subscriptions. After that, no
        partial refunds for the current period.
      </p>
      <h2>Liability</h2>
      <p>
        The service is provided "as is" without warranties. We do our best, but translations are
        machine-generated and should not be relied upon for legal, medical, or critical purposes.
      </p>
      <p className="mt-6 text-xs text-warm-gray-light">Last updated: today.</p>
    </>,
  )
}
