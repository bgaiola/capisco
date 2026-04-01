import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { translateRoute } from './routes/translate.js'
import { cloneVoiceRoute } from './routes/clone-voice.js'
import { synthesizeRoute } from './routes/synthesize.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', translateRoute)
app.use('/api', cloneVoiceRoute)
app.use('/api', synthesizeRoute)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🇮🇹 CAPISCO backend running on http://localhost:${PORT}`)
  console.log(`   Tradução: ✅ Google Translate (gratuito)`)
  console.log(`   ElevenLabs API: ${process.env.ELEVENLABS_API_KEY ? '✅ configured' : '❌ missing'}`)
})
