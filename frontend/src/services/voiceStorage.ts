import type { ConversationPartner, ConversationTurn, VoiceProfile } from '../types'

const KEY = 'cappisco_voice_v1'
const LEGACY_KEYS = ['capisco_voice_v2', 'capisco_voice'] as const
const SKIP_KEY = 'cappisco_skipped_voice'
const LEGACY_SKIP_KEYS = ['capisco_skipped_voice'] as const
const HISTORY_KEY = 'cappisco_history'
const LEGACY_HISTORY_KEY = 'capisco_history'

const PARTNER_KEY = 'cappisco_partner_v1'
const CONVERSATION_KEY = 'cappisco_conversation_v1'
const TUTORIAL_SEEN_PREFIX = 'cappisco_tut_'

interface StoredVoice extends VoiceProfile {
  v: 1
}

function isStored(value: unknown): value is StoredVoice {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.voiceId === 'string' && v.voiceId.length > 0
}

function isPartner(value: unknown): value is ConversationPartner {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.voiceId === 'string' && typeof v.langSpeechCode === 'string'
}

// ===== User's own voice =====

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
    // ignore
  }
  return null
}

export function saveVoiceProfile(profile: VoiceProfile): void {
  const stored: StoredVoice = { ...profile, v: 1 }
  localStorage.setItem(KEY, JSON.stringify(stored))
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
  for (const k of LEGACY_SKIP_KEYS) {
    if (localStorage.getItem(k) === '1' || localStorage.getItem(k) === 'true') return true
  }
  return false
}

// ===== Conversation partner (second voice) =====

export function loadPartner(): ConversationPartner | null {
  try {
    const raw = localStorage.getItem(PARTNER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (isPartner(parsed)) return parsed
  } catch {
    // ignore
  }
  return null
}

export function savePartner(partner: ConversationPartner): void {
  localStorage.setItem(PARTNER_KEY, JSON.stringify(partner))
}

export function clearPartner(): void {
  localStorage.removeItem(PARTNER_KEY)
}

// ===== Translation history =====

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
      // give up
    }
  }
}

// ===== Conversation log (text only — audio URLs aren't persistable) =====

export function loadConversation(): ConversationTurn[] {
  try {
    const raw = localStorage.getItem(CONVERSATION_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.map((t) => ({ ...t, audioUrl: undefined }) as ConversationTurn)
      : []
  } catch {
    return []
  }
}

export function saveConversation(turns: ConversationTurn[]): void {
  try {
    // Strip blob audioUrl before persisting
    const clean = turns.map(({ audioUrl: _audioUrl, ...rest }) => rest)
    localStorage.setItem(CONVERSATION_KEY, JSON.stringify(clean))
  } catch {
    try {
      const trimmed = turns.slice(-40).map(({ audioUrl: _audioUrl, ...rest }) => rest)
      localStorage.setItem(CONVERSATION_KEY, JSON.stringify(trimmed))
    } catch {
      // give up
    }
  }
}

export function clearConversation(): void {
  localStorage.removeItem(CONVERSATION_KEY)
}

// ===== Tutorial dismissal flags =====

export function hasSeenTutorial(key: string): boolean {
  return localStorage.getItem(TUTORIAL_SEEN_PREFIX + key) === '1'
}

export function markTutorialSeen(key: string): void {
  localStorage.setItem(TUTORIAL_SEEN_PREFIX + key, '1')
}
