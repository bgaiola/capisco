import { queryOne, execute } from '../db/index.js'
import { config } from '../config.js'
import { effectiveTier } from './tier.js'

type Kind = 'translate' | 'synthesize' | 'clone'

const todayStr = () => new Date().toISOString().slice(0, 10) // YYYY-MM-DD
const monthStr = () => new Date().toISOString().slice(0, 7) // YYYY-MM

export async function recordUsage(userId: number, kind: Kind, amount = 1): Promise<void> {
  const now = Date.now()
  await execute(
    `INSERT INTO usage_events (user_id, kind, amount, day, month, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, kind, amount, todayStr(), monthStr(), now],
  )
}

export async function countToday(userId: number, kind: Kind): Promise<number> {
  const row = await queryOne<{ n: string | number }>(
    `SELECT COALESCE(SUM(amount), 0) AS n
     FROM usage_events WHERE user_id = $1 AND kind = $2 AND day = $3`,
    [userId, kind, todayStr()],
  )
  return Number(row?.n ?? 0)
}

export async function sumThisMonth(userId: number, kind: Kind): Promise<number> {
  const row = await queryOne<{ n: string | number }>(
    `SELECT COALESCE(SUM(amount), 0) AS n
     FROM usage_events WHERE user_id = $1 AND kind = $2 AND month = $3`,
    [userId, kind, monthStr()],
  )
  return Number(row?.n ?? 0)
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

export async function getQuotaSnapshot(
  userId: number,
  user: { tier: 'free' | 'basic' | 'pro'; status: string },
): Promise<QuotaSnapshot> {
  const tier = effectiveTier(user)
  const [translationsToday, synthCharsThisMonth, cloneRow] = await Promise.all([
    countToday(userId, 'translate'),
    sumThisMonth(userId, 'synthesize'),
    queryOne<{ n: string | number }>('SELECT COUNT(*) AS n FROM voice_clones WHERE user_id = $1', [
      userId,
    ]),
  ])
  const clonesEver = Number(cloneRow?.n ?? 0)

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

export async function canTranslate(
  userId: number,
  user: { tier: 'free' | 'basic' | 'pro'; status: string },
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const tier = effectiveTier(user)
  if (tier !== 'free') return { ok: true }
  const used = await countToday(userId, 'translate')
  if (used >= config.freeDailyTranslations) {
    return {
      ok: false,
      reason: `Free plan: ${config.freeDailyTranslations} translations/day. Upgrade for unlimited.`,
    }
  }
  return { ok: true }
}

export async function canSynthesize(
  userId: number,
  user: { tier: 'free' | 'basic' | 'pro'; status: string },
  chars: number,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const tier = effectiveTier(user)
  if (tier === 'free') return { ok: false, reason: 'Voice cloning requires a Basic plan or higher.' }
  const limit = tier === 'pro' ? config.proMonthlySynthChars : config.basicMonthlySynthChars
  const used = await sumThisMonth(userId, 'synthesize')
  if (used + chars > limit) {
    return {
      ok: false,
      reason: `Monthly synthesis quota reached (${limit.toLocaleString()} chars). Resets next month.`,
    }
  }
  return { ok: true }
}
