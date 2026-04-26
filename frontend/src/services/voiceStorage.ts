import type { VoiceProfile } from '../types'

const KEY = 'capisco_voice_v2'
const LEGACY_KEY = 'capisco_voice'
const SKIP_KEY = 'capisco_skipped_voice'
const HISTORY_KEY = 'capisco_history'

interface StoredVoice extends VoiceProfile {
  /** Schema version for future migrations. */
  v: 2
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
          name: parsed.name || 'CAPISCO User',
          createdAt: parsed.createdAt || Date.now(),
        }
      }
    }
    // Migrate from legacy key (v1)
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const parsed = JSON.parse(legacy) as unknown
      if (isStored(parsed)) {
        const profile: VoiceProfile = {
          voiceId: (parsed as VoiceProfile).voiceId,
          name: (parsed as VoiceProfile).name || 'CAPISCO User',
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
  const stored: StoredVoice = { ...profile, v: 2 }
  localStorage.setItem(KEY, JSON.stringify(stored))
  // Always clear "skipped" once a voice is saved.
  localStorage.removeItem(SKIP_KEY)
}

export function clearVoiceProfile(): void {
  localStorage.removeItem(KEY)
  localStorage.removeItem(LEGACY_KEY)
  localStorage.removeItem(SKIP_KEY)
}

export function markVoiceSkipped(): void {
  localStorage.setItem(SKIP_KEY, '1')
}

export function wasVoiceSkipped(): boolean {
  return localStorage.getItem(SKIP_KEY) === '1' || localStorage.getItem(SKIP_KEY) === 'true'
}

export function loadHistory<T>(): T[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
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
    // Quota exceeded — drop oldest items and retry once
    try {
      const trimmed = history.slice(0, Math.max(20, Math.floor(history.length / 2)))
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
    } catch {
      // Give up silently
    }
  }
}
