import { Router } from 'express'

const router = Router()

router.post('/synthesize', async (req, res) => {
  try {
    const { text, voiceId } = req.body

    if (!text || !voiceId) {
      res.status(400).json({ error: 'Campos "text" e "voiceId" são obrigatórios' })
      return
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      res.status(500).json({ error: 'ELEVENLABS_API_KEY não configurada' })
      return
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.85,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('ElevenLabs TTS error:', errorData)
      res.status(response.status).json({
        error: errorData.detail?.message || 'Erro ao sintetizar áudio',
      })
      return
    }

    // Send the audio as a proper buffer response
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(buffer.length),
    })

    res.send(buffer)
  } catch (error) {
    console.error('Synthesize error:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro interno ao sintetizar',
    })
  }
})

export { router as synthesizeRoute }
