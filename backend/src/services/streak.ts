import { queryOne, execute } from '../db/index.js'

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

export async function bumpStreak(userId: number): Promise<Streak> {
  const row = await queryOne<{ streak_days: string | number; streak_last_day: string | null }>(
    'SELECT streak_days, streak_last_day FROM users WHERE id = $1',
    [userId],
  )
  const today = todayStr()
  let days = Number(row?.streak_days ?? 0)
  const last = row?.streak_last_day ?? null

  if (last === today) return { days, lastDay: today }
  if (last && diffDays(today, last) === 1) days += 1
  else days = 1

  await execute(
    'UPDATE users SET streak_days = $1, streak_last_day = $2, updated_at = $3 WHERE id = $4',
    [days, today, Date.now(), userId],
  )

  return { days, lastDay: today }
}

export async function getStreak(userId: number): Promise<Streak> {
  const row = await queryOne<{ streak_days: string | number; streak_last_day: string | null }>(
    'SELECT streak_days, streak_last_day FROM users WHERE id = $1',
    [userId],
  )
  if (!row) return { days: 0, lastDay: null }
  const today = todayStr()
  // Streak is broken if last activity is older than yesterday
  if (row.streak_last_day && diffDays(today, row.streak_last_day) > 1) {
    return { days: 0, lastDay: row.streak_last_day }
  }
  return { days: Number(row.streak_days), lastDay: row.streak_last_day }
}
