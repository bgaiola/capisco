import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import MarketingNav from '../components/marketing/MarketingNav'
import SEO from '../components/marketing/SEO'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../contexts/LocaleContext'
import { ApiError } from '../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const { t } = useLocale()
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const next = search.get('next') ?? '/app'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate(next, { replace: true })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.loginFailed)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-crema text-ink">
      <SEO title={t.loginPageTitle} noindex />
      <MarketingNav />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-warm-gray-light/30 p-6 sm:p-8 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.2)]">
          <h1 className="font-display text-3xl tracking-tight">{t.loginWelcome}</h1>
          <p className="text-warm-gray text-sm mt-1">{t.loginSubtitle}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <Field label={t.authEmail}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="input"
              />
            </Field>
            <Field label={t.authPassword}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="input"
              />
            </Field>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-5 py-3 rounded-xl bg-terracotta text-white font-medium hover:bg-terracotta-dark active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? t.loginSubmitting : t.loginCta}
            </button>
          </form>

          <p className="text-sm text-warm-gray mt-6 text-center">
            {t.loginNoAccount}{' '}
            <Link
              to={`/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`}
              className="text-terracotta hover:underline"
            >
              {t.loginCreate}
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-warm-gray">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
