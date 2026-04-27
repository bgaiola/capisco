import { Router } from 'express'
import { queryOne, type DbUser, toSafeUser } from '../db/index.js'
import { requireAuth } from '../auth/middleware.js'
import { ensureReferralCode } from '../services/referral.js'
import { getQuotaSnapshot } from '../services/usage.js'
import { getStreak } from '../services/streak.js'

const router = Router()

router.get('/account', requireAuth, async (req, res) => {
  const user = await queryOne<DbUser>('SELECT * FROM users WHERE id = $1', [req.user!.id])
  if (!user) {
    res.status(404).json({ error: 'not_found' })
    return
  }
  const userId = Number(user.id)
  const referralCode = await ensureReferralCode(userId)
  const refsRow = await queryOne<{ n: string | number }>(
    'SELECT COUNT(*) AS n FROM users WHERE referred_by = $1',
    [userId],
  )
  const referralsCount = Number(refsRow?.n ?? 0)
  const [quota, streak] = await Promise.all([
    getQuotaSnapshot(userId, user),
    getStreak(userId),
  ])
  res.json({
    user: toSafeUser({ ...user, id: userId }),
    quota,
    streak,
    referral: { code: referralCode, count: referralsCount },
  })
})

export { router as accountRoute }
