import 'dotenv/config'

const required = (name: string, fallback?: string): string => {
  const v = process.env[name] ?? fallback
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

const optional = (name: string): string | undefined => process.env[name]

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3001),

  // Auth
  jwtSecret: required(
    'JWT_SECRET',
    process.env.NODE_ENV === 'production' ? undefined : 'dev-only-jwt-secret-change-me-in-prod-please',
  ),
  cookieSecure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
  appUrl: process.env.APP_URL ?? 'http://localhost:5173',

  // Database
  databasePath: process.env.DATABASE_PATH ?? './data/cappisco.db',

  // External APIs
  elevenLabsKey: optional('ELEVENLABS_API_KEY'),

  // Stripe
  stripeSecretKey: optional('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: optional('STRIPE_WEBHOOK_SECRET'),
  stripeBasicPriceId: optional('STRIPE_PRICE_BASIC'),
  stripeProPriceId: optional('STRIPE_PRICE_PRO'),

  // Quotas (free tier)
  freeDailyTranslations: Number(process.env.FREE_DAILY_TRANSLATIONS ?? 5),
  basicMonthlySynthChars: Number(process.env.BASIC_MONTHLY_SYNTH_CHARS ?? 50_000),
  proMonthlySynthChars: Number(process.env.PRO_MONTHLY_SYNTH_CHARS ?? 250_000),

  // Marketing (optional)
  gaMeasurementId: optional('VITE_GA_MEASUREMENT_ID'),
  metaPixelId: optional('VITE_META_PIXEL_ID'),
} as const

export const isProd = config.nodeEnv === 'production'
