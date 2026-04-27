import { config } from '../config.js'

export type Tier = 'free' | 'basic' | 'pro'
const ORDER: Record<Tier, number> = { free: 0, basic: 1, pro: 2 }

/**
 * The tier the user effectively has *right now*. Honors the open-beta override
 * (BETA_FREE_ACCESS env): a free-tier user is treated as the configured beta
 * tier, but a user who already pays Basic/Pro keeps theirs.
 */
export function effectiveTier(user: { tier: Tier; status: string }): Tier {
  if (user.tier !== 'free' && user.status === 'active') return user.tier
  if (config.betaFreeAccess) return config.betaFreeAccess
  return user.tier
}

export function meetsTier(actual: Tier, min: Tier): boolean {
  return ORDER[actual] >= ORDER[min]
}

export const isOpenBeta = (): boolean => config.betaFreeAccess !== null
