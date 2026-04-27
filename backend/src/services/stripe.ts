import Stripe from 'stripe'
import { config } from '../config.js'

let _stripe: Stripe | null = null

export function getStripe(): Stripe | null {
  if (_stripe) return _stripe
  if (!config.stripeSecretKey) return null
  _stripe = new Stripe(config.stripeSecretKey)
  return _stripe
}

export function tierForPriceId(priceId: string | null | undefined): 'free' | 'basic' | 'pro' {
  if (!priceId) return 'free'
  if (priceId === config.stripeBasicPriceId) return 'basic'
  if (priceId === config.stripeProPriceId) return 'pro'
  return 'free'
}

export function priceIdForTier(tier: 'basic' | 'pro'): string | null {
  if (tier === 'basic') return config.stripeBasicPriceId ?? null
  if (tier === 'pro') return config.stripeProPriceId ?? null
  return null
}
