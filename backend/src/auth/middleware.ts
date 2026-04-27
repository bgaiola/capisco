import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from './jwt.js'
import { db, type DbUser, toSafeUser, type SafeUser } from '../db/index.js'

declare module 'express-serve-static-core' {
  interface Request {
    user?: SafeUser
    sessionId?: string
  }
}

const COOKIE_NAME = 'cap_session'
export const SESSION_COOKIE = COOKIE_NAME

export function readBearer(req: Request): string | null {
  const cookieToken = (req as Request & { cookies?: Record<string, string> }).cookies?.[COOKIE_NAME]
  if (cookieToken) return cookieToken
  const auth = req.header('authorization')
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7)
  return null
}

function loadUser(userId: number, sessionId: string): SafeUser | null {
  const session = db
    .prepare('SELECT id, user_id, expires_at FROM sessions WHERE id = ?')
    .get(sessionId) as { id: string; user_id: number; expires_at: number } | undefined
  if (!session) return null
  if (session.user_id !== userId) return null
  if (session.expires_at < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId)
    return null
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as DbUser | undefined
  if (!user) return null
  return toSafeUser(user)
}

export function attachUser(req: Request, _res: Response, next: NextFunction) {
  const token = readBearer(req)
  if (!token) return next()
  const decoded = verifyToken(token)
  if (!decoded) return next()
  const user = loadUser(decoded.sub, decoded.sid)
  if (user) {
    req.user = user
    req.sessionId = decoded.sid
  }
  next()
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: 'unauthorized', message: 'Login required.' })
    return
  }
  next()
}

export function requireTier(min: 'basic' | 'pro') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'unauthorized', message: 'Login required.' })
      return
    }
    const order = { free: 0, basic: 1, pro: 2 } as const
    if (order[req.user.tier] < order[min]) {
      res.status(402).json({
        error: 'upgrade_required',
        message: `This feature requires the ${min === 'pro' ? 'Pro' : 'Basic'} plan or higher.`,
        requiredTier: min,
        currentTier: req.user.tier,
      })
      return
    }
    if (req.user.status !== 'active') {
      res.status(402).json({
        error: 'subscription_inactive',
        message: 'Your subscription is not active. Please update your billing.',
      })
      return
    }
    next()
  }
}
