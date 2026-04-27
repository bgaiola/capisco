import { db } from '../db/index.js'

const todayStr = () => new Date().toISOString().slice(0, 10)

function diffDays(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00Z').getTime()
  const dbb = new Date(b + 'T00:00:00Z').getTime()
  return Math.round((da - dbb) / 86_400_000)
}

export interface Streak {
  days: number
  lastDay: string | null
}

export function bumpStreak(userId: number): Streak {
  const row = db
    .prepare('SELECT streak_days, streak_last_day FROM users WHERE id = ?')
    .get(userId) as { streak_days: number; streak_last_day: string | null } | undefined
  const today = todayStr()
  let days = row?.streak_days ?? 0
  const last = row?.streak_last_day ?? null

  if (last === today) return { days, lastDay: today }
  if (last && diffDays(today, last) === 1) days += 1
  else days = 1

  db.prepare(
    'UPDATE users SET streak_days = ?, streak_last_day = ?, updated_at = ? WHERE id = ?',
  ).run(days, today, Date.now(), userId)

  return { days, lastDay: today }
}

export function getStreak(userId: number): Streak {
  const row = db
    .prepare('SELECT streak_days, streak_last_day FROM users WHERE id = ?')
    .get(userId) as { streak_days: number; streak_last_day: string | null } | undefined
  if (!row) return { days: 0, lastDay: null }
  const today = todayStr()
  // Streak is broken if last activity is older than yesterday
  if (row.streak_last_day && diffDays(today, row.streak_last_day) > 1) {
    return { days: 0, lastDay: row.streak_last_day }
  }
  return { days: row.streak_days, lastDay: row.streak_last_day }
}
