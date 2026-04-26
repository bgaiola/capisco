import { Router } from 'express'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/clone-voice', upload.single('audio'), async (req, res) => {
  try {
    const audioFile = req.file
    const name = req.body?.name || 'CAPPISCO User'

    if (!audioFile) {
      res.status(400).json({ error: 'Arquivo de áudio é obrigatório' })
      return
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      res.status(500).json({ error: 'ELEVENLABS_API_KEY não configurada' })
      return
    }

    // Prepare form data for ElevenLabs
    const formData = new FormData()
    formData.append('name', name)
    formData.append(
      'files',
      new Blob([new Uint8Array(audioFile.buffer)], { type: audioFile.mimetype }),
      audioFile.originalname || 'voice-sample.webm',
    )
    formData.append('description', 'CAPPISCO voice clone')

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('ElevenLabs clone error:', errorData)
      res.status(response.status).json({
        error: errorData.detail?.message || 'Erro ao clonar voz no ElevenLabs',
      })
      return
    }

    const data = (await response.json()) as { voice_id: string }

    res.json({ voiceId: data.voice_id })
  } catch (error) {
    console.error('Clone voice error:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro interno ao clonar voz',
    })
  }
})

export { router as cloneVoiceRoute }
