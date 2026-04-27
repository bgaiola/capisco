import crypto from 'crypto'
import { queryOne, execute } from '../db/index.js'

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // unambiguous

function randomCode(length = 6): string {
  const bytes = crypto.randomBytes(length)
  let out = ''
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length]
  return out
}

export async function ensureReferralCode(userId: number): Promise<string> {
  const row = await queryOne<{ referral_code: string | null }>(
    'SELECT referral_code FROM users WHERE id = $1',
    [userId],
  )
  if (row?.referral_code) return row.referral_code

  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode()
    try {
      await execute('UPDATE users SET referral_code = $1, updated_at = $2 WHERE id = $3', [
        code,
        Date.now(),
        userId,
      ])
      return code
    } catch {
      continue
    }
  }
  throw new Error('Failed to generate unique referral code')
}

export async function findUserIdByReferralCode(code: string): Promise<number | null> {
  if (!code) return null
  const row = await queryOne<{ id: number | string }>(
    'SELECT id FROM users WHERE referral_code = $1',
    [code.toUpperCase()],
  )
  return row ? Number(row.id) : null
}
