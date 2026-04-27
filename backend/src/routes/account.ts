import { Router } from 'express'
import { db, type DbUser, toSafeUser } from '../db/index.js'
import { requireAuth } from '../auth/middleware.js'
import { ensureReferralCode } from '../services/referral.js'
import { getQuotaSnapshot } from '../services/usage.js'
import { getStreak } from '../services/streak.js'

const router = Router()

router.get('/account', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.id) as DbUser
  const referralCode = ensureReferralCode(user.id)
  const referralsCount =
    (db.prepare('SELECT COUNT(*) AS n FROM users WHERE referred_by = ?').get(user.id) as { n: number })?.n ?? 0
  res.json({
    user: toSafeUser(user),
    quota: getQuotaSnapshot(user.id, user.tier),
    streak: getStreak(user.id),
    referral: { code: referralCode, count: referralsCount },
  })
})

export { router as accountRoute }
