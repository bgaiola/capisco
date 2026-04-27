import { apiJson } from './api'

export type Tier = 'free' | 'basic' | 'pro'

export interface QuotaSnapshot {
  tier: Tier
  translationsToday: number
  translationsTodayLimit: number | null
  synthCharsThisMonth: number
  synthCharsThisMonthLimit: number | null
  clonesEver: number
  clonesEverLimit: number | null
}

export interface Streak {
  days: number
  lastDay: string | null
}

export interface AuthUser {
  id: number
  email: string
  name: string | null
  tier: Tier
  /**
   * Tier the user effectively has *right now* (honors open-beta override).
   * Always >= `tier`. Use this for UI gating; use `tier` for billing UI.
   */
  effectiveTier?: Tier
  betaOpen?: boolean
  status: 'active' | 'canceled' | 'past_due'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  referral_code: string | null
  referred_by: number | null
  streak_days: number
  streak_last_day: string | null
  email_verified: number
  created_at: number
  updated_at: number
  quota?: QuotaSnapshot
  streak?: Streak
}

export interface AccountResponse {
  user: AuthUser
  quota: QuotaSnapshot
  streak: Streak
  referral: { code: string; count: number }
}

export async function signup(email: string, password: string, name?: string, referralCode?: string) {
  return apiJson<{ user: AuthUser }>('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, referralCode }),
  })
}

export async function login(email: string, password: string) {
  return apiJson<{ user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export async function logout() {
  return apiJson<{ ok: true }>('/api/auth/logout', { method: 'POST' })
}

export async function fetchMe() {
  return apiJson<{ user: AuthUser }>('/api/auth/me')
}

export async function fetchAccount() {
  return apiJson<AccountResponse>('/api/account')
}
