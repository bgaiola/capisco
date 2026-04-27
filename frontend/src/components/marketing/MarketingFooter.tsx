import { Link } from 'react-router-dom'
import { useLocale } from '../../contexts/LocaleContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function MarketingFooter() {
  const { t } = useLocale()
  return (
    <footer className="border-t border-warm-gray-light/20 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <div className="font-display text-2xl text-ink">CAPPISCO</div>
          <p className="text-sm text-warm-gray mt-2 max-w-xs">{t.footerTagline}</p>
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-warm-gray-light mb-3">{t.footerProduct}</div>
          <ul className="space-y-2 text-sm text-warm-gray">
            <li><Link to="/pricing" className="hover:text-ink">{t.navPricing}</Link></li>
            <li><a href="/#how" className="hover:text-ink">{t.navHowItWorks}</a></li>
            <li><a href="/#faq" className="hover:text-ink">{t.navFAQ}</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-warm-gray-light mb-3">{t.footerAccount}</div>
          <ul className="space-y-2 text-sm text-warm-gray">
            <li><Link to="/login" className="hover:text-ink">{t.navLogin}</Link></li>
            <li><Link to="/signup" className="hover:text-ink">{t.footerSignup}</Link></li>
            <li><Link to="/account" className="hover:text-ink">{t.footerManage}</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-warm-gray-light mb-3">{t.footerLegal}</div>
          <ul className="space-y-2 text-sm text-warm-gray">
            <li><Link to="/legal/privacy" className="hover:text-ink">{t.footerPrivacy}</Link></li>
            <li><Link to="/legal/terms" className="hover:text-ink">{t.footerTerms}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-warm-gray-light/20 px-4 sm:px-6 py-6 text-xs text-warm-gray-light text-center">
        © {new Date().getFullYear()} CAPPISCO — {t.footerMade}
      </div>
    </footer>
  )
}
