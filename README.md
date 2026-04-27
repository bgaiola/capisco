# CAPPISCO

**Speak any language — in your own voice.**

CAPPISCO is a SaaS language coach. You record about 30 seconds of yourself reading a passage; we clone your voice (via ElevenLabs) and from then on every translation plays back in your own voice. Pro subscribers can clone a partner's voice too and run a real-time, two-way translated conversation — each person hears the other in the speaker's own voice.

**Languages:** 🇪🇸 Spanish · 🇺🇸 English · 🇧🇷 Portuguese (BR) · 🇵🇹 Portuguese (PT) · 🇮🇹 Italian · 🇫🇷 French · 🇨🇳 Mandarin · 🇷🇺 Russian · 🇳🇱 Dutch.

![Status](https://img.shields.io/badge/status-beta-orange) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Stripe](https://img.shields.io/badge/Stripe-billing-635bff)

## Plans

| Feature | Free | Basic ($9.99/mo) | Pro ($19.99/mo) |
|---|---|---|---|
| Text & voice translation | 5 / day | ∞ | ∞ |
| Cultural notes | ✅ | ✅ | ✅ |
| Clone your voice | — | ✅ | ✅ |
| Phrase packs (travel, restaurant, business…) | — | ✅ | ✅ |
| Download MP3 audio | — | ✅ | ✅ |
| Talk mode (2-way live translator) | — | — | ✅ |
| Clone a partner's voice | — | — | ✅ |
| Monthly synthesis | — | 50,000 chars | 250,000 chars |
| Daily streak, referral code | ✅ | ✅ | ✅ |

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Frontend (React 19 + Vite + Tailwind + React Router)    │
│  /  /pricing  /signup  /login  /account  /app            │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│  Backend (Express 5 + TS, single Node process)           │
│  • SQLite (better-sqlite3) — users, sessions, usage      │
│  • Auth: bcrypt + JWT in httpOnly cookies                │
│  • Stripe Checkout + Webhook + Customer Portal           │
│  • Helmet, CORS lock-down, express-rate-limit, zod       │
│  • Tier gating + per-user quotas server-side             │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
   ┌────────────────────────────────┐  ┌──────────────────┐
   │  ElevenLabs (clone voice + TTS)│  │ Google Translate │
   └────────────────────────────────┘  └──────────────────┘
```

## Running locally

### Requirements
- Node.js 18+
- An [ElevenLabs API key](https://elevenlabs.io) (free tier works)
- (Optional, for billing) [Stripe CLI](https://docs.stripe.com/stripe-cli) and a Stripe test account

### Setup
```bash
git clone https://github.com/<your-user>/capisco.git
cd capisco

# Install all dependencies
npm run install:all

# Configure backend secrets
cp backend/.env.example backend/.env
# Edit backend/.env — at minimum set JWT_SECRET and ELEVENLABS_API_KEY.
# Stripe is optional locally — leave the keys blank to skip billing.

# Run frontend + backend together
npm run dev
```

The app is at `http://localhost:5173`. The backend runs on `http://localhost:3001`.

### Marketing config (optional)
```bash
cp frontend/.env.example frontend/.env
# Add VITE_GA_MEASUREMENT_ID and/or VITE_META_PIXEL_ID to track
# page views and conversion events (sign_up, begin_checkout).
```

### Wiring up Stripe locally
1. Create two recurring **Products** in Stripe (test mode):
   - `Basic` — $9.99/month
   - `Pro` — $19.99/month
2. Copy the price IDs (`price_…`) into `backend/.env` as `STRIPE_PRICE_BASIC` / `STRIPE_PRICE_PRO`.
3. Paste your test secret key into `STRIPE_SECRET_KEY`.
4. Run the Stripe CLI to forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3001/api/billing/webhook
   ```
   It will print a `whsec_…` string — paste into `STRIPE_WEBHOOK_SECRET`.
5. Restart the backend.

Test cards: `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.

## Useful commands
```bash
npm run dev           # Frontend + backend together
npm run dev:frontend  # Vite dev server (5173)
npm run dev:backend   # Express API (3001)
npm run build:all     # Build both
npm run start:prod    # Run the built backend (serves frontend dist/)
```

## API

All `/api` endpoints are JSON; protected ones require an authenticated session cookie.

| Method | Path | Auth | Tier | Description |
|---|---|---|---|---|
| GET | `/api/health` | — | — | Health + feature flags |
| GET | `/api/public-config` | — | — | Public flags + quota limits |
| POST | `/api/auth/signup` | — | — | Create account |
| POST | `/api/auth/login` | — | — | Login + set cookie |
| POST | `/api/auth/logout` | ✅ | — | End session |
| GET | `/api/auth/me` | ✅ | — | Current user |
| GET | `/api/account` | ✅ | — | Profile + quota + streak + referral |
| POST | `/api/billing/checkout` | ✅ | — | Stripe Checkout URL |
| POST | `/api/billing/portal` | ✅ | — | Stripe billing portal URL |
| POST | `/api/billing/webhook` | sig | — | Stripe webhook |
| POST | `/api/translate` | ✅ | free+ | Translate (quota-gated) |
| POST | `/api/clone-voice` | ✅ | basic+ | Clone voice (multipart audio) |
| POST | `/api/synthesize` | ✅ | basic+ | TTS in cloned voice |
| GET | `/api/lessons` | ✅ | basic+ | Phrase packs |

## Security

- Passwords: **bcrypt** (12 rounds).
- Sessions: **JWT** signed with `JWT_SECRET`, stored in **httpOnly + SameSite=Lax/Strict** cookies; revocable via the `sessions` table.
- **Helmet** sets sensible security headers (CSP locked-down in prod).
- **CORS** allowlist restricted to `APP_URL` in production.
- **Rate limiting** (per-IP, global + auth-specific).
- **Zod** validates every payload. Audio uploads capped at 15 MB.
- **Tier checks server-side** — frontend can't bypass paywalls.
- **Voice ownership check** — synth requires the voice belongs to the requester.
- Stripe **webhook signature** verified against the raw request body.

## Marketing & growth

Hooks already wired:
- Open Graph + Twitter Card metadata for shareable links.
- `/sitemap.xml` and `/robots.txt`.
- GA4 (`VITE_GA_MEASUREMENT_ID`) and Meta Pixel (`VITE_META_PIXEL_ID`) — set the env vars and the app starts emitting events automatically.
- Conversion events fired: `page_view`, `sign_up`, `begin_checkout`, `CompleteRegistration` (Meta), `InitiateCheckout` (Meta).
- Built-in **referral codes** — every user gets a unique code, the signup page accepts a `?ref=ABC123` query param, and counts referred signups.

Suggested ad strategy:
- **Meta (FB/IG) Reels** showing yourself speaking 5 languages "in your own voice." This is the wow factor — short, demo-driven creatives convert.
- **TikTok** — same content cut to native vertical. Niche: travelers, polyglots, immigrants.
- **Google Ads — search** on `voice cloning`, `speak [language] in my own voice`, `language coach`.
- **Reddit** organic — r/languagelearning, r/Italian, r/Spanish — with a free-tier giveaway.
- **YouTube pre-roll** on language teachers' content (programmatic).
- Use the referral code to lower paid CAC.

## Privacy

- Voice clones live in your ElevenLabs account; we store only a `voice_id` reference per user.
- Translations and history (when authenticated) are kept locally in the browser and on your device — the server only stores usage counts (no content).
- Account deletion wipes all clones and references.

## License

MIT
