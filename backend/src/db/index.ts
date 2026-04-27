/**
 * Tiny dual-mode database adapter.
 *
 *   - DATABASE_URL=postgres://…   → uses node-postgres (production / Neon)
 *   - DATABASE_URL unset          → uses better-sqlite3 (zero-config local dev)
 *
 * Queries should be written in Postgres-style syntax (`$1, $2, …` placeholders,
 * `RETURNING id`). The SQLite branch transparently rewrites placeholders to `?`.
 */
import path from 'path'
import fs from 'fs'
import Database, { type Database as SqliteDatabase } from 'better-sqlite3'
import { Pool } from 'pg'
import { config } from '../config.js'

const url = config.databaseUrl.trim()
export const isPostgres = url.startsWith('postgres://') || url.startsWith('postgresql://')

let pgPool: Pool | null = null
let sqliteDb: SqliteDatabase | null = null

if (isPostgres) {
  pgPool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false }, // Neon requires SSL; cert chain may not be local-trusted
    max: 10,
  })
} else {
  const dbPath = path.resolve(process.cwd(), config.databasePath)
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  sqliteDb = new Database(dbPath)
  sqliteDb.pragma('journal_mode = WAL')
  sqliteDb.pragma('foreign_keys = ON')
}

/** Rewrite Postgres `$1, $2, …` placeholders to SQLite-friendly `?`. */
function pgToSqlite(sql: string): string {
  return sql.replace(/\$\d+/g, '?')
}

/** Run any SQL and get all rows back. */
export async function query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  if (pgPool) {
    const result = await pgPool.query(sql, params)
    return result.rows as T[]
  }
  const stmt = sqliteDb!.prepare(pgToSqlite(sql))
  const trimmed = sql.trim().toLowerCase()
  if (trimmed.startsWith('select') || trimmed.includes('returning')) {
    return stmt.all(...params) as T[]
  }
  stmt.run(...params)
  return [] as T[]
}

export async function queryOne<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}

/** Run an INSERT/UPDATE/DELETE. Returns inserted row's id when SQL has RETURNING. */
export async function execute(
  sql: string,
  params: unknown[] = [],
): Promise<{ insertedId: number | null; rowCount: number }> {
  if (pgPool) {
    const result = await pgPool.query(sql, params)
    const id =
      result.rows?.[0] && typeof result.rows[0] === 'object' && 'id' in (result.rows[0] as object)
        ? Number((result.rows[0] as Record<string, unknown>).id)
        : null
    return { insertedId: id, rowCount: result.rowCount ?? 0 }
  }
  const stmt = sqliteDb!.prepare(pgToSqlite(sql))
  if (sql.toLowerCase().includes('returning')) {
    const row = stmt.get(...params) as { id?: number } | undefined
    return { insertedId: row?.id ?? null, rowCount: row ? 1 : 0 }
  }
  const info = stmt.run(...params)
  return { insertedId: Number(info.lastInsertRowid) || null, rowCount: info.changes }
}

/** Run schema setup (CREATE TABLE IF NOT EXISTS …). Safe to call repeatedly. */
async function migrate(): Promise<void> {
  // Postgres: SERIAL PRIMARY KEY; SQLite: INTEGER PRIMARY KEY AUTOINCREMENT.
  const idCol = isPostgres ? 'BIGSERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'
  // Both engines accept BIGINT/INTEGER for our purposes.
  const intT = 'BIGINT'

  const ddl = [
    `CREATE TABLE IF NOT EXISTS users (
      id              ${idCol},
      email           TEXT NOT NULL UNIQUE,
      password_hash   TEXT NOT NULL,
      name            TEXT,
      tier            TEXT NOT NULL DEFAULT 'free',
      status          TEXT NOT NULL DEFAULT 'active',
      stripe_customer_id    TEXT,
      stripe_subscription_id TEXT,
      referral_code   TEXT UNIQUE,
      referred_by     ${intT},
      streak_days     ${intT} NOT NULL DEFAULT 0,
      streak_last_day TEXT,
      email_verified  ${intT} NOT NULL DEFAULT 0,
      created_at      ${intT} NOT NULL,
      updated_at      ${intT} NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id)`,
    `CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code)`,

    `CREATE TABLE IF NOT EXISTS sessions (
      id            TEXT PRIMARY KEY,
      user_id       ${intT} NOT NULL,
      expires_at    ${intT} NOT NULL,
      user_agent    TEXT,
      ip_address    TEXT,
      created_at    ${intT} NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`,

    `CREATE TABLE IF NOT EXISTS usage_events (
      id            ${idCol},
      user_id       ${intT} NOT NULL,
      kind          TEXT NOT NULL,
      amount        ${intT} NOT NULL DEFAULT 1,
      day           TEXT NOT NULL,
      month         TEXT NOT NULL,
      created_at    ${intT} NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_usage_user_day ON usage_events(user_id, day)`,
    `CREATE INDEX IF NOT EXISTS idx_usage_user_month ON usage_events(user_id, month)`,
    `CREATE INDEX IF NOT EXISTS idx_usage_user_kind_day ON usage_events(user_id, kind, day)`,
    `CREATE INDEX IF NOT EXISTS idx_usage_user_kind_month ON usage_events(user_id, kind, month)`,

    `CREATE TABLE IF NOT EXISTS voice_clones (
      id            ${idCol},
      user_id       ${intT} NOT NULL,
      voice_id      TEXT NOT NULL,
      label         TEXT,
      lang_speech_code TEXT,
      created_at    ${intT} NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_voice_clones_user ON voice_clones(user_id)`,
  ]

  if (pgPool) {
    for (const sql of ddl) await pgPool.query(sql)
  } else {
    for (const sql of ddl) sqliteDb!.exec(sql)
  }
}

await migrate()

// ---------------------------------------------------------------------------
// Domain types

export interface DbUser {
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

// ---------------------------------------------------------------------------
// Back-compat: a few legacy spots still call `db.prepare(...).get/all/run(...)`.
// Provide a tiny shim so we can migrate them one at a time without breaking.
// IMPORTANT: this SHOULD NOT be used in new code — write `await query(...)` instead.

interface ShimStatement {
  get(...params: unknown[]): unknown
  all(...params: unknown[]): unknown[]
  run(...params: unknown[]): { lastInsertRowid: number; changes: number }
}

export const db = {
  prepare(sql: string): ShimStatement {
    if (!sqliteDb) {
      throw new Error(
        'db.prepare() shim only works in SQLite mode. Use `await query()`/`await execute()` instead.',
      )
    }
    const stmt = sqliteDb.prepare(pgToSqlite(sql))
    return {
      get: (...p: unknown[]) => stmt.get(...p),
      all: (...p: unknown[]) => stmt.all(...p) as unknown[],
      run: (...p: unknown[]) => {
        const info = stmt.run(...p)
        return { lastInsertRowid: Number(info.lastInsertRowid), changes: info.changes }
      },
    }
  },
}
