import MarketingNav from '../components/marketing/MarketingNav'
import MarketingFooter from '../components/marketing/MarketingFooter'
import SEO from '../components/marketing/SEO'
import { useLocale } from '../contexts/LocaleContext'

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
  const { t } = useLocale()
  return wrap(
    t.privacyTitle,
    <>
      <p>{t.privacyIntro}</p>
      <h2>{t.privacyDataHeader}</h2>
      <ul>
        {t.privacyDataItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <h2>{t.privacyNeverHeader}</h2>
      <ul>
        {t.privacyNeverItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <h2>{t.privacyDeleteHeader}</h2>
      <p>{t.privacyDeleteBody}</p>
      <p className="mt-6 text-xs text-warm-gray-light">{t.legalLastUpdated}</p>
    </>,
  )
}

export function TermsPage() {
  const { t } = useLocale()
  return wrap(
    t.termsTitle,
    <>
      <p>{t.termsIntro}</p>
      <h2>{t.termsSubsHeader}</h2>
      <p>{t.termsSubsBody}</p>
      <h2>{t.termsRefundsHeader}</h2>
      <p>{t.termsRefundsBody}</p>
      <h2>{t.termsLiabilityHeader}</h2>
      <p>{t.termsLiabilityBody}</p>
      <p className="mt-6 text-xs text-warm-gray-light">{t.legalLastUpdated}</p>
    </>,
  )
}
