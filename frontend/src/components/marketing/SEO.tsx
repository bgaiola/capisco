import { useEffect } from 'react'

interface Props {
  title?: string
  description?: string
  path?: string
  image?: string
  noindex?: boolean
}

const DEFAULT_TITLE = 'CAPPISCO — Speak any language in your own voice'
const DEFAULT_DESC =
  'Clone your voice and hear yourself speak Italian, Spanish, French, English and more. Real-time two-way translator with cultural notes.'

function ensureMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function ensureLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function SEO({ title, description, path, image, noindex }: Props) {
  useEffect(() => {
    const t = title ? `${title} · CAPPISCO` : DEFAULT_TITLE
    const d = description ?? DEFAULT_DESC
    document.title = t
    ensureMeta('name', 'description', d)
    ensureMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    const url = `${window.location.origin}${path ?? window.location.pathname}`
    ensureLink('canonical', url)

    // Open Graph
    ensureMeta('property', 'og:type', 'website')
    ensureMeta('property', 'og:title', t)
    ensureMeta('property', 'og:description', d)
    ensureMeta('property', 'og:url', url)
    ensureMeta('property', 'og:site_name', 'CAPPISCO')
    if (image) ensureMeta('property', 'og:image', image)

    // Twitter
    ensureMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    ensureMeta('name', 'twitter:title', t)
    ensureMeta('name', 'twitter:description', d)
    if (image) ensureMeta('name', 'twitter:image', image)
  }, [title, description, path, image, noindex])

  return null
}
