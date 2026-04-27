import { Router } from 'express'
import { z } from 'zod'
import { config } from '../config.js'
import { requireAuth, requireTier } from '../auth/middleware.js'
import { canSynthesize, recordUsage } from '../services/usage.js'
import { queryOne } from '../db/index.js'

const router = Router()

const SynthBody = z.object({
  text: z.string().min(1).max(5_000),
  voiceId: z.string().min(1).max(64),
})

router.post('/synthesize', requireAuth, requireTier('basic'), async (req, res) => {
  const parsed = SynthBody.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_input', message: 'Invalid input (max 5000 chars).' })
    return
  }
  const { text, voiceId } = parsed.data

  // Ensure this voiceId belongs to the user — prevents using another user's clone.
  const owned = await queryOne(
    'SELECT id FROM voice_clones WHERE user_id = $1 AND voice_id = $2',
    [req.user!.id, voiceId],
  )
  if (!owned) {
    res.status(403).json({ error: 'forbidden', message: 'This voice does not belong to your account.' })
    return
  }

  const gate = await canSynthesize(req.user!.id, req.user!, text.length)
  if (!gate.ok) {
    res.status(429).json({ error: 'quota_exceeded', message: gate.reason })
    return
  }

  if (!config.elevenLabsKey) {
    res.status(503).json({ error: 'service_unavailable', message: 'Voice synthesis is not configured.' })
    return
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': config.elevenLabsKey,
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.85 },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('ElevenLabs TTS error:', errorData)
      res.status(response.status).json({
        error: 'synth_failed',
        message: errorData.detail?.message || 'Synthesis error',
      })
      return
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await recordUsage(req.user!.id, 'synthesize', text.length)

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(buffer.length),
      'Cache-Control': 'private, no-store',
    })
    res.send(buffer)
  } catch (error) {
    console.error('Synthesize error:', error)
    res.status(500).json({
      error: 'synth_failed',
      message: error instanceof Error ? error.message : 'Internal error',
    })
  }
})

export { router as synthesizeRoute }
