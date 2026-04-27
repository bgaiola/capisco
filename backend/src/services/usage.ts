import { db } from '../db/index.js'
import { config } from '../config.js'

type Kind = 'translate' | 'synthesize' | 'clone'

const todayStr = () => new Date().toISOString().slice(0, 10) // YYYY-MM-DD
const monthStr = () => new Date().toISOString().slice(0, 7) // YYYY-MM

export function recordUsage(userId: number, kind: Kind, amount = 1) {
  const now = Date.now()
  db.prepare(
    `INSERT INTO usage_events (user_id, kind, amount, day, month, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(userId, kind, amount, todayStr(), monthStr(), now)
}

export function countToday(userId: number, kind: Kind): number {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS n
       FROM usage_events WHERE user_id = ? AND kind = ? AND day = ?`,
    )
    .get(userId, kind, todayStr()) as { n: number }
  return row?.n ?? 0
}

export function sumThisMonth(userId: number, kind: Kind): number {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS n
       FROM usage_events WHERE user_id = ? AND kind = ? AND month = ?`,
    )
    .get(userId, kind, monthStr()) as { n: number }
  return row?.n ?? 0
}

export interface QuotaSnapshot {
  tier: 'free' | 'basic' | 'pro'
  translationsToday: number
  translationsTodayLimit: number | null
  synthCharsThisMonth: number
  synthCharsThisMonthLimit: number | null
  clonesEver: number
  clonesEverLimit: number | null
}

export function getQuotaSnapshot(userId: number, tier: 'free' | 'basic' | 'pro'): QuotaSnapshot {
  const translationsToday = countToday(userId, 'translate')
  const synthCharsThisMonth = sumThisMonth(userId, 'synthesize')
  const clonesEver =
    (db.prepare('SELECT COUNT(*) AS n FROM voice_clones WHERE user_id = ?').get(userId) as { n: number })?.n ?? 0

  const limits = {
    free: {
      translationsTodayLimit: config.freeDailyTranslations,
      synthCharsThisMonthLimit: 0,
      clonesEverLimit: 0,
    },
    basic: {
      translationsTodayLimit: null,
      synthCharsThisMonthLimit: config.basicMonthlySynthChars,
      clonesEverLimit: 1,
    },
    pro: {
      translationsTodayLimit: null,
      synthCharsThisMonthLimit: config.proMonthlySynthChars,
      clonesEverLimit: 2, // self + partner
    },
  }[tier]

  return {
    tier,
    translationsToday,
    synthCharsThisMonth,
    clonesEver,
    ...limits,
  }
}

export function canTranslate(userId: number, tier: 'free' | 'basic' | 'pro'): { ok: true } | { ok: false; reason: string } {
  if (tier !== 'free') return { ok: true }
  const used = countToday(userId, 'translate')
  if (used >= config.freeDailyTranslations) {
    return { ok: false, reason: `Free plan: ${config.freeDailyTranslations} translations/day. Upgrade for unlimited.` }
  }
  return { ok: true }
}

export function canSynthesize(userId: number, tier: 'free' | 'basic' | 'pro', chars: number): { ok: true } | { ok: false; reason: string } {
  // Free tier never uses paid synth (it falls back to browser TTS on the client).
  if (tier === 'free') return { ok: false, reason: 'Voice cloning requires a Basic plan or higher.' }
  const limit = tier === 'pro' ? config.proMonthlySynthChars : config.basicMonthlySynthChars
  const used = sumThisMonth(userId, 'synthesize')
  if (used + chars > limit) {
    return { ok: false, reason: `Monthly synthesis quota reached (${limit.toLocaleString()} chars). Resets next month.` }
  }
  return { ok: true }
}
