import Database, { type Database as DatabaseInstance } from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { config } from '../config.js'

const dbPath = path.resolve(process.cwd(), config.databasePath)
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

export const db: DatabaseInstance = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    email           TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash   TEXT NOT NULL,
    name            TEXT,
    tier            TEXT NOT NULL DEFAULT 'free',  -- free | basic | pro
    status          TEXT NOT NULL DEFAULT 'active', -- active | canceled | past_due
    stripe_customer_id    TEXT,
    stripe_subscription_id TEXT,
    referral_code   TEXT UNIQUE,
    referred_by     INTEGER REFERENCES users(id),
    streak_days     INTEGER NOT NULL DEFAULT 0,
    streak_last_day TEXT,
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
  CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

  CREATE TABLE IF NOT EXISTS sessions (
    id            TEXT PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at    INTEGER NOT NULL,
    user_agent    TEXT,
    ip_address    TEXT,
    created_at    INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

  CREATE TABLE IF NOT EXISTS usage_events (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind          TEXT NOT NULL,  -- translate | synthesize | clone
    amount        INTEGER NOT NULL DEFAULT 1, -- char count for synth, 1 for others
    day           TEXT NOT NULL,  -- YYYY-MM-DD
    month         TEXT NOT NULL,  -- YYYY-MM
    created_at    INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_usage_user_day ON usage_events(user_id, day);
  CREATE INDEX IF NOT EXISTS idx_usage_user_month ON usage_events(user_id, month);
  CREATE INDEX IF NOT EXISTS idx_usage_user_kind_day ON usage_events(user_id, kind, day);
  CREATE INDEX IF NOT EXISTS idx_usage_user_kind_month ON usage_events(user_id, kind, month);

  CREATE TABLE IF NOT EXISTS voice_clones (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    voice_id      TEXT NOT NULL,
    label         TEXT,           -- 'self' | 'partner'
    lang_speech_code TEXT,
    created_at    INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_voice_clones_user ON voice_clones(user_id);

  CREATE TABLE IF NOT EXISTS rate_limit_log (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    key           TEXT NOT NULL,
    created_at    INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_rl_key_time ON rate_limit_log(key, created_at);
`)

// Allow code-level migrations idempotently if you add columns later. e.g.:
const userCols = db.prepare("PRAGMA table_info(users)").all() as Array<{ name: string }>
const haveCol = (n: string) => userCols.some((c) => c.name === n)
if (!haveCol('email_verified')) {
  db.exec(`ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0`)
}

export type DbUser = {
  id: number
  email: string
  password_hash: string
  name: string | null
  tier: 'free' | 'basic' | 'pro'
  status: 'active' | 'canceled' | 'past_due'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  referral_code: string | null
  referred_by: number | null
  streak_days: number
  streak_last_day: string | null
  email_verified: number
  created_at: number
  updated_at: number
}

export type SafeUser = Omit<DbUser, 'password_hash'>

export function toSafeUser(u: DbUser): SafeUser {
  const { password_hash: _ph, ...rest } = u
  return rest
}
