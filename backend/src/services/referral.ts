import crypto from 'crypto'
import { db } from '../db/index.js'

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // unambiguous

function randomCode(length = 6): string {
  const bytes = crypto.randomBytes(length)
  let out = ''
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length]
  return out
}

export function ensureReferralCode(userId: number): string {
  const row = db.prepare('SELECT referral_code FROM users WHERE id = ?').get(userId) as
    | { referral_code: string | null }
    | undefined
  if (row?.referral_code) return row.referral_code

  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode()
    try {
      db.prepare('UPDATE users SET referral_code = ?, updated_at = ? WHERE id = ?').run(
        code,
        Date.now(),
        userId,
      )
      return code
    } catch {
      continue
    }
  }
  throw new Error('Failed to generate unique referral code')
}

export function findUserIdByReferralCode(code: string): number | null {
  if (!code) return null
  const row = db.prepare('SELECT id FROM users WHERE referral_code = ?').get(code.toUpperCase()) as
    | { id: number }
    | undefined
  return row?.id ?? null
}
