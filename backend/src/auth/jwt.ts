import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export interface JwtPayload {
  sub: number       // user id
  sid: string       // session id
}

const ACCESS_TOKEN_TTL = '30d'

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: ACCESS_TOKEN_TTL,
    issuer: 'cappisco',
  })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret, { issuer: 'cappisco' }) as jwt.JwtPayload
    if (typeof decoded !== 'object' || decoded === null) return null
    if (typeof decoded.sub !== 'number' || typeof decoded.sid !== 'string') return null
    return { sub: decoded.sub, sid: decoded.sid }
  } catch {
    return null
  }
}
