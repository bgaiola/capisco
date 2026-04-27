import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLocale } from '../../contexts/LocaleContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function MarketingNav() {
  const { user, loading } = useAuth()
  const { t } = useLocale()

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-crema/80 border-b border-warm-gray-light/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        <Link to="/" className="font-display text-2xl text-ink tracking-tight shrink-0">
          CAPPISCO
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/pricing" className={({ isActive }) => navCls(isActive)}>
            {t.navPricing}
          </NavLink>
          <a href="/#how" className="text-sm text-warm-gray hover:text-ink transition-colors">
            {t.navHowItWorks}
          </a>
          <a href="/#faq" className="text-sm text-warm-gray hover:text-ink transition-colors">
            {t.navFAQ}
          </a>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher compact />
          {!loading && user ? (
            <>
              <Link
                to="/account"
                className="hidden sm:inline-flex px-3 py-2 text-sm text-warm-gray hover:text-ink transition-colors"
              >
                {t.navAccount}
              </Link>
              <Link
                to="/app"
                className="px-3 sm:px-4 py-2 rounded-xl bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark active:scale-95 transition-all shadow-[0_8px_20px_-12px_rgba(196,96,58,0.6)]"
              >
                {t.navOpenApp}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex px-3 py-2 text-sm text-warm-gray hover:text-ink transition-colors"
              >
                {t.navLogin}
              </Link>
              <Link
                to="/signup"
                className="px-3 sm:px-4 py-2 rounded-xl bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark active:scale-95 transition-all shadow-[0_8px_20px_-12px_rgba(196,96,58,0.6)]"
              >
                {t.navGetStarted}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function navCls(active: boolean) {
  return `text-sm transition-colors ${active ? 'text-ink' : 'text-warm-gray hover:text-ink'}`
}
