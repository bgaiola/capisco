const CACHE_NAME = 'capisco-v2'
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  // Always go to network for API calls
  if (req.url.includes('/api/')) return

  const url = new URL(req.url)

  // Network-first for HTML/navigation so users always get the latest UI
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
          return res
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('/index.html')))
    )
    return
  }

  // Cache-first for hashed/static assets (vite emits hashed file names)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        return (
          cached ||
          fetch(req).then((res) => {
            if (res.status === 200) {
              const clone = res.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
            }
            return res
          })
        )
      })
    )
  }
})
