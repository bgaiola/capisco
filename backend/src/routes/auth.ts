import { Router } from 'express'
import crypto from 'crypto'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'
import { db, type DbUser, toSafeUser } from '../db/index.js'
import { hashPassword, verifyPassword } from '../auth/passwords.js'
import { signToken } from '../auth/jwt.js'
import { SESSION_COOKIE, requireAuth } from '../auth/middleware.js'
import { ensureReferralCode, findUserIdByReferralCode } from '../services/referral.js'
import { config, isProd } from '../config.js'
import { getQuotaSnapshot } from '../services/usage.js'
import { getStreak } from '../services/streak.js'

const router = Router()

const SESSION_DAYS = 30
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000

const cookieOpts = {
  httpOnly: true as const,
  secure: config.cookieSecure,
  sameSite: (isProd ? 'strict' : 'lax') as 'strict' | 'lax',
  path: '/',
  maxAge: SESSION_MS,
}

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'rate_limited', message: 'Too many signup attempts. Try again later.' },
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'rate_limited', message: 'Too many login attempts. Try again later.' },
})

const SignupBody = z.object({
  email: z.string().email().max(254).transform((s) => s.toLowerCase().trim()),
  password: z.string().min(8).max(200),
  name: z.string().max(80).optional(),
  referralCode: z.string().max(12).optional(),
})

const LoginBody = z.object({
  email: z.string().email().max(254).transform((s) => s.toLowerCase().trim()),
  password: z.string().min(1).max(200),
})

function newSessionId(): string {
  return crypto.randomBytes(24).toString('hex')
}

function createSession(userId: number, userAgent: string | undefined, ip: string | undefined): string {
  const id = newSessionId()
  const now = Date.now()
  db.prepare(
    `INSERT INTO sessions (id, user_id, expires_at, user_agent, ip_address, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, userId, now + SESSION_MS, userAgent ?? null, ip ?? null, now)
  return id
}

function userPayload(u: DbUser) {
  const safe = toSafeUser(u)
  const quota = getQuotaSnapshot(u.id, u.tier)
  const streak = getStreak(u.id)
  return { ...safe, quota, streak }
}

router.post('/auth/signup', signupLimiter, async (req, res) => {
  const parsed = SignupBody.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_input', message: parsed.error.issues[0]?.message ?? 'Invalid input' })
    return
  }
  const { email, password, name, referralCode } = parsed.data

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) {
    res.status(409).json({ error: 'email_taken', message: 'An account already exists for this email.' })
    return
  }

  const referrerId = referralCode ? findUserIdByReferralCode(referralCode) : null
  const hash = await hashPassword(password)
  const now = Date.now()

  const result = db
    .prepare(
      `INSERT INTO users (email, password_hash, name, tier, status, referred_by, created_at, updated_at)
       VALUES (?, ?, ?, 'free', 'active', ?, ?, ?)`,
    )
    .run(email, hash, name ?? null, referrerId, now, now)

  const userId = Number(result.lastInsertRowid)
  ensureReferralCode(userId)

  const sid = createSession(userId, req.header('user-agent') ?? undefined, req.ip)
  const token = signToken({ sub: userId, sid })
  res.cookie(SESSION_COOKIE, token, cookieOpts)

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as DbUser
  res.status(201).json({ user: userPayload(user) })
})

router.post('/auth/login', loginLimiter, async (req, res) => {
  const parsed = LoginBody.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_input', message: 'Invalid email or password.' })
    return
  }
  const { email, password } = parsed.data
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as DbUser | undefined
  if (!user) {
    res.status(401).json({ error: 'invalid_credentials', message: 'Invalid email or password.' })
    return
  }
  const ok = await verifyPassword(password, user.password_hash)
  if (!ok) {
    res.status(401).json({ error: 'invalid_credentials', message: 'Invalid email or password.' })
    return
  }
  const sid = createSession(user.id, req.header('user-agent') ?? undefined, req.ip)
  const token = signToken({ sub: user.id, sid })
  res.cookie(SESSION_COOKIE, token, cookieOpts)
  res.json({ user: userPayload(user) })
})

router.post('/auth/logout', (req, res) => {
  const sid = req.sessionId
  if (sid) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sid)
  }
  res.clearCookie(SESSION_COOKIE, { ...cookieOpts, maxAge: 0 })
  res.json({ ok: true })
})

router.get('/auth/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.id) as DbUser
  res.json({ user: userPayload(user) })
})

export { router as authRoute }
