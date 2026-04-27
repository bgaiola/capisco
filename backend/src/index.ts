import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

import { config, isProd } from './config.js'
import { attachUser } from './auth/middleware.js'
import { translateRoute } from './routes/translate.js'
import { cloneVoiceRoute } from './routes/clone-voice.js'
import { synthesizeRoute } from './routes/synthesize.js'
import { authRoute } from './routes/auth.js'
import { billingRoute, stripeWebhookHandler } from './routes/billing.js'
import { accountRoute } from './routes/account.js'
import { lessonsRoute } from './routes/lessons.js'

// Initialize the database (creates tables if missing)
import './db/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.set('trust proxy', 1)

// Stripe webhook MUST receive the raw body — register BEFORE express.json().
app.post('/api/billing/webhook', ...stripeWebhookHandler)

// --- Security headers ---
app.use(
  helmet({
    contentSecurityPolicy: isProd
      ? {
          useDefaults: true,
          directives: {
            'default-src': ["'self'"],
            'script-src': ["'self'", 'https://js.stripe.com', 'https://www.googletagmanager.com', 'https://connect.facebook.net', "'unsafe-inline'"],
            'connect-src': ["'self'", 'https://api.stripe.com', 'https://www.google-analytics.com', 'https://*.facebook.com'],
            'frame-src': ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
            'img-src': ["'self'", 'data:', 'blob:', 'https:'],
            'media-src': ["'self'", 'data:', 'blob:'],
            'style-src': ["'self'", "'unsafe-inline'"],
            'font-src': ["'self'", 'data:'],
            'object-src': ["'none'"],
          },
        }
      : false,
    crossOriginEmbedderPolicy: false,
  }),
)

// --- CORS ---
const allowedOrigins = isProd
  ? [config.appUrl]
  : ['http://localhost:5173', 'http://127.0.0.1:5173', config.appUrl]
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true) // same-origin / curl
      if (allowedOrigins.includes(origin)) return cb(null, true)
      return cb(new Error(`Origin not allowed: ${origin}`))
    },
    credentials: true,
  }),
)

// --- Body parsing ---
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

// --- Global API rate limiter (broad shield) ---
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120, // 120 req / minute / IP for general API
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'rate_limited', message: 'Slow down — too many requests.' },
})
app.use('/api', apiLimiter)

// --- Attach user from session cookie/JWT (no-op if absent) ---
app.use(attachUser)

// --- API Routes ---
app.use('/api', authRoute)
app.use('/api', accountRoute)
app.use('/api', billingRoute)
app.use('/api', translateRoute)
app.use('/api', cloneVoiceRoute)
app.use('/api', synthesizeRoute)
app.use('/api', lessonsRoute)

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    env: config.nodeEnv,
    billingEnabled: !!config.stripeSecretKey,
    voiceEnabled: !!config.elevenLabsKey,
    timestamp: new Date().toISOString(),
  })
})

// Public marketing config — non-sensitive only
app.get('/api/public-config', (_req, res) => {
  res.json({
    billingEnabled: !!config.stripeSecretKey,
    voiceEnabled: !!config.elevenLabsKey,
    betaOpen: config.betaFreeAccess !== null,
    betaTier: config.betaFreeAccess,
    pricing: {
      basicPriceId: config.stripeBasicPriceId ?? null,
      proPriceId: config.stripeProPriceId ?? null,
    },
    quotas: {
      freeDailyTranslations: config.freeDailyTranslations,
      basicMonthlySynthChars: config.basicMonthlySynthChars,
      proMonthlySynthChars: config.proMonthlySynthChars,
    },
  })
})

// --- Static frontend ---
const frontendDist = path.join(__dirname, '../../frontend/dist')
app.use(express.static(frontendDist))

// SPA fallback — any non-API route serves index.html
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

app.listen(config.port, () => {
  console.log(`🇮🇹 CAPPISCO running on http://localhost:${config.port}`)
  console.log(`   Env: ${config.nodeEnv}`)
  console.log(`   ElevenLabs API: ${config.elevenLabsKey ? '✅ configured' : '❌ missing'}`)
  console.log(`   Stripe billing:  ${config.stripeSecretKey ? '✅ configured' : '⚪ disabled (no STRIPE_SECRET_KEY)'}`)
})
