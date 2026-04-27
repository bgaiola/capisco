import { Router } from 'express'
import multer from 'multer'
import { config } from '../config.js'
import { requireAuth, requireTier } from '../auth/middleware.js'
import { query, execute } from '../db/index.js'
import { effectiveTier } from '../services/tier.js'

const router = Router()

const MAX_AUDIO_BYTES = 15 * 1024 * 1024 // 15 MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AUDIO_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ok =
      file.mimetype.startsWith('audio/') ||
      file.mimetype === 'video/webm' ||
      file.mimetype === 'application/octet-stream'
    if (!ok) return cb(new Error('Only audio files are allowed.'))
    cb(null, true)
  },
})

// Basic+ feature: cloning your voice. We also enforce a per-user clone limit.
router.post(
  '/clone-voice',
  requireAuth,
  requireTier('basic'),
  upload.single('audio'),
  async (req, res) => {
    try {
      const audioFile = req.file
      const label = String(req.body?.label ?? 'self').slice(0, 16)
      if (label !== 'self' && label !== 'partner') {
        res.status(400).json({ error: 'invalid_input', message: 'label must be "self" or "partner".' })
        return
      }
      if (label === 'partner' && effectiveTier(req.user!) !== 'pro') {
        res.status(402).json({
          error: 'upgrade_required',
          message: 'Cloning a partner voice requires the Pro plan.',
          requiredTier: 'pro',
          currentTier: req.user!.tier,
        })
        return
      }

      if (!audioFile) {
        res.status(400).json({ error: 'invalid_input', message: 'Audio file is required.' })
        return
      }

      if (!config.elevenLabsKey) {
        res.status(503).json({ error: 'service_unavailable', message: 'Voice cloning is not configured.' })
        return
      }

      // Per-user limits: 1 self for basic, 2 (self + partner) for pro.
      // If a clone with the same label already exists, replace it (delete on ElevenLabs).
      const existing = await query<{ id: number | string; voice_id: string }>(
        'SELECT id, voice_id FROM voice_clones WHERE user_id = $1 AND label = $2',
        [req.user!.id, label],
      )
      for (const v of existing) {
        await fetch(`https://api.elevenlabs.io/v1/voices/${v.voice_id}`, {
          method: 'DELETE',
          headers: { 'xi-api-key': config.elevenLabsKey },
        }).catch(() => {})
        await execute('DELETE FROM voice_clones WHERE id = $1', [Number(v.id)])
      }

      const formData = new FormData()
      const userTag = `u${req.user!.id}-${label}`
      formData.append('name', `CAPPISCO ${userTag}`)
      formData.append(
        'files',
        new Blob([new Uint8Array(audioFile.buffer)], { type: audioFile.mimetype }),
        audioFile.originalname || 'voice-sample.webm',
      )
      formData.append('description', `CAPPISCO clone for user ${req.user!.id} (${label})`)

      const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
        method: 'POST',
        headers: { 'xi-api-key': config.elevenLabsKey },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('ElevenLabs clone error:', errorData)
        res.status(response.status).json({
          error: 'clone_failed',
          message: errorData.detail?.message || 'Could not clone voice.',
        })
        return
      }

      const data = (await response.json()) as { voice_id: string }
      const langSpeechCode = String(req.body?.langSpeechCode ?? '').slice(0, 16) || null

      await execute(
        `INSERT INTO voice_clones (user_id, voice_id, label, lang_speech_code, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [req.user!.id, data.voice_id, label, langSpeechCode, Date.now()],
      )

      res.json({ voiceId: data.voice_id, label })
    } catch (error) {
      console.error('Clone voice error:', error)
      const msg = error instanceof Error ? error.message : 'Unknown error.'
      const status = msg.includes('audio') ? 400 : 500
      res.status(status).json({ error: 'clone_failed', message: msg })
    }
  },
)

export { router as cloneVoiceRoute }
