import type { VoiceProfile } from '../types'

const KEY = 'cappisco_voice_v1'
const LEGACY_KEYS = ['capisco_voice_v2', 'capisco_voice'] as const
const SKIP_KEY = 'cappisco_skipped_voice'
const LEGACY_SKIP_KEYS = ['capisco_skipped_voice'] as const
const HISTORY_KEY = 'cappisco_history'
const LEGACY_HISTORY_KEY = 'capisco_history'

interface StoredVoice extends VoiceProfile {
  v: 1
}

function isStored(value: unknown): value is StoredVoice {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.voiceId === 'string' && v.voiceId.length > 0
}

export function loadVoiceProfile(): VoiceProfile | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as unknown
      if (isStored(parsed)) {
        return {
          voiceId: parsed.voiceId,
          name: parsed.name || 'CAPPISCO User',
          createdAt: parsed.createdAt || Date.now(),
        }
      }
    }
    // Migrate from any legacy storage key (older builds / pre-rebrand)
    for (const legacyKey of LEGACY_KEYS) {
      const legacy = localStorage.getItem(legacyKey)
      if (!legacy) continue
      const parsed = JSON.parse(legacy) as unknown
      if (isStored(parsed)) {
        const profile: VoiceProfile = {
          voiceId: (parsed as VoiceProfile).voiceId,
          name: (parsed as VoiceProfile).name || 'CAPPISCO User',
          createdAt: (parsed as VoiceProfile).createdAt || Date.now(),
        }
        saveVoiceProfile(profile)
        return profile
      }
    }
  } catch {
    // Corrupted storage — ignore
  }
  return null
}

export function saveVoiceProfile(profile: VoiceProfile): void {
  const stored: StoredVoice = { ...profile, v: 1 }
  localStorage.setItem(KEY, JSON.stringify(stored))
  // Clear "skipped" once a voice is saved.
  localStorage.removeItem(SKIP_KEY)
  for (const k of LEGACY_SKIP_KEYS) localStorage.removeItem(k)
}

export function clearVoiceProfile(): void {
  localStorage.removeItem(KEY)
  for (const k of LEGACY_KEYS) localStorage.removeItem(k)
  localStorage.removeItem(SKIP_KEY)
  for (const k of LEGACY_SKIP_KEYS) localStorage.removeItem(k)
}

export function markVoiceSkipped(): void {
  localStorage.setItem(SKIP_KEY, '1')
}

export function wasVoiceSkipped(): boolean {
  if (localStorage.getItem(SKIP_KEY) === '1' || localStorage.getItem(SKIP_KEY) === 'true') return true
  // Honor legacy skip flag too
  for (const k of LEGACY_SKIP_KEYS) {
    if (localStorage.getItem(k) === '1' || localStorage.getItem(k) === 'true') return true
  }
  return false
}

export function loadHistory<T>(): T[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY) ?? localStorage.getItem(LEGACY_HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHistory<T>(history: T[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    try {
      const trimmed = history.slice(0, Math.max(20, Math.floor(history.length / 2)))
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
    } catch {
      // Give up silently
    }
  }
}
