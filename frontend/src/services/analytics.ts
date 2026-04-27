/**
 * Analytics: Google Analytics 4 + Meta Pixel.
 * Both are optional — if env vars are absent, hooks are no-ops.
 *
 * Configure in `.env` (frontend):
 *   VITE_GA_MEASUREMENT_ID=G-XXXXXXX
 *   VITE_META_PIXEL_ID=000000000000000
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const META_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined

let initialized = false

export function initAnalytics() {
  if (initialized) return
  initialized = true

  if (GA_ID) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, { send_page_view: true })
  }

  if (META_ID) {
    /* eslint-disable */
    ;(function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return
      const n: any = (f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      })
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = true
      n.version = '2.0'
      n.queue = []
      const t = b.createElement(e) as HTMLScriptElement
      t.async = true
      t.src = v
      const s = b.getElementsByTagName(e)[0]
      s.parentNode!.insertBefore(t, s)
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
    /* eslint-enable */
    window.fbq?.('init', META_ID)
    window.fbq?.('track', 'PageView')
  }
}

export function trackPageView(path: string) {
  if (GA_ID) window.gtag?.('event', 'page_view', { page_path: path })
  if (META_ID) window.fbq?.('track', 'PageView')
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (GA_ID) window.gtag?.('event', event, params ?? {})
  if (META_ID) window.fbq?.('trackCustom', event, params ?? {})
}

export function trackSignup(method: string = 'email') {
  trackEvent('sign_up', { method })
  if (META_ID) window.fbq?.('track', 'CompleteRegistration')
}

export function trackPurchaseInit(tier: 'basic' | 'pro') {
  trackEvent('begin_checkout', { tier })
  if (META_ID) window.fbq?.('track', 'InitiateCheckout', { content_name: tier })
}
