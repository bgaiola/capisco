import { Link } from 'react-router-dom'

export default function MarketingFooter() {
  return (
    <footer className="border-t border-warm-gray-light/20 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-4 gap-8">
        <div>
          <div className="font-display text-2xl text-ink">CAPPISCO</div>
          <p className="text-sm text-warm-gray mt-2 max-w-xs">
            Speak any language — in your own voice.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-warm-gray-light mb-3">Product</div>
          <ul className="space-y-2 text-sm text-warm-gray">
            <li><Link to="/pricing" className="hover:text-ink">Pricing</Link></li>
            <li><a href="/#how" className="hover:text-ink">How it works</a></li>
            <li><a href="/#faq" className="hover:text-ink">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-warm-gray-light mb-3">Account</div>
          <ul className="space-y-2 text-sm text-warm-gray">
            <li><Link to="/login" className="hover:text-ink">Log in</Link></li>
            <li><Link to="/signup" className="hover:text-ink">Sign up</Link></li>
            <li><Link to="/account" className="hover:text-ink">Manage account</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-warm-gray-light mb-3">Legal</div>
          <ul className="space-y-2 text-sm text-warm-gray">
            <li><Link to="/legal/privacy" className="hover:text-ink">Privacy</Link></li>
            <li><Link to="/legal/terms" className="hover:text-ink">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-warm-gray-light/20 px-4 sm:px-6 py-6 text-xs text-warm-gray-light text-center">
        © {new Date().getFullYear()} CAPPISCO — Made with care.
      </div>
    </footer>
  )
}
