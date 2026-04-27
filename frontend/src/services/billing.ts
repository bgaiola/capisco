import { apiJson } from './api'

export async function startCheckout(tier: 'basic' | 'pro'): Promise<string> {
  const data = await apiJson<{ url: string }>('/api/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier }),
  })
  return data.url
}

export async function openBillingPortal(): Promise<string> {
  const data = await apiJson<{ url: string }>('/api/billing/portal', { method: 'POST' })
  return data.url
}
