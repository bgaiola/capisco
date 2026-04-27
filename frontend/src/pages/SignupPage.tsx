import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import MarketingNav from '../components/marketing/MarketingNav'
import SEO from '../components/marketing/SEO'
import { useAuth } from '../contexts/AuthContext'
import { ApiError } from '../services/api'
import { trackSignup } from '../services/analytics'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const next = search.get('next') ?? '/app'
  const intent = search.get('intent') as 'basic' | 'pro' | null
  const initialReferral = search.get('ref') ?? ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [referralCode, setReferralCode] = useState(initialReferral)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setSubmitting(true)
    try {
      await signup(email.trim(), password, name.trim() || undefined, referralCode.trim() || undefined)
      trackSignup('email')
      // Send users straight to checkout if they came from a paid plan card
      if (intent === 'basic' || intent === 'pro') {
        navigate(`/account?intent=${intent}`, { replace: true })
        return
      }
      navigate(next, { replace: true })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Signup failed.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-crema text-ink">
      <SEO title="Create your account" />
      <MarketingNav />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-warm-gray-light/30 p-6 sm:p-8 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.2)]">
          <h1 className="font-display text-3xl tracking-tight">Create your account</h1>
          <p className="text-warm-gray text-sm mt-1">Start free. Upgrade when you're ready.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <Field label="Name (optional)">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="input"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="input"
              />
            </Field>
            <Field label="Password (min. 8 chars)">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="input"
              />
            </Field>
            <Field label="Referral code (optional)">
              <input
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                autoCapitalize="characters"
                maxLength={12}
                className="input font-mono"
                placeholder="e.g. ABC123"
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
              {submitting ? 'Creating…' : 'Create account'}
            </button>
            <p className="text-xs text-warm-gray text-center">
              By signing up, you agree to our{' '}
              <Link to="/legal/terms" className="underline">Terms</Link> and{' '}
              <Link to="/legal/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </form>

          <p className="text-sm text-warm-gray mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-terracotta hover:underline">Log in</Link>
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
