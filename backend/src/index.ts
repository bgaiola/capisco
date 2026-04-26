import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { translateRoute } from './routes/translate.js'
import { cloneVoiceRoute } from './routes/clone-voice.js'
import { synthesizeRoute } from './routes/synthesize.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.use('/api', translateRoute)
app.use('/api', cloneVoiceRoute)
app.use('/api', synthesizeRoute)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve frontend static files in production
const frontendDist = path.join(__dirname, '../../frontend/dist')
app.use(express.static(frontendDist))

// SPA fallback — any non-API route serves index.html
// Express 5 requires named wildcard params: {*path}
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🇪🇸 CAPPISCO running on http://localhost:${PORT}`)
  console.log(`   Tradução: ✅ Google Translate (gratuito)`)
  console.log(`   ElevenLabs API: ${process.env.ELEVENLABS_API_KEY ? '✅ configured' : '❌ missing'}`)
})
