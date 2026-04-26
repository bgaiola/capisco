# CAPISCO

**Clone your voice. Speak another language — in your own voice.**

CAPISCO is a small, focused language coach. You speak (or type) a phrase in your language, it translates the phrase, and plays the translation back to you using a clone of your own voice.

Three supported UI / source / target languages: **🇪🇸 Español (España)**, **🇺🇸 English (US)**, **🇧🇷 Português (Brasil)**. The UI follows whichever you pick as your native language.

![Status](https://img.shields.io/badge/status-beta-orange) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/bgaiola/capisco)

## How it works

1. **Pick your languages** — what you speak, what you want to learn.
2. **Clone your voice** — read a short passage out loud (a different one each attempt, ~30s).
3. **Translate** — speak with the mic or type a phrase.
4. **Listen** — the translation is played back in your own cloned voice.

Your cloned voice is persisted in `localStorage` on the device, so once you record it you don't have to do it again.

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript + Tailwind CSS v4 + Vite |
| Backend | Express 5 + TypeScript |
| Translation | Google Translate (free, via `google-translate-api-x`) |
| Voice clone & TTS | [ElevenLabs](https://elevenlabs.io) |
| Speech recognition | Web Speech API (browser, Chrome/Edge recommended) |

## Running locally

### Requirements
- Node.js 18+
- An [ElevenLabs API key](https://elevenlabs.io) (free tier is enough for testing)
- A browser that supports the Web Speech API (Chrome/Edge for the voice mode; Safari falls back to text mode)

### Setup
```bash
git clone https://github.com/<your-user>/capisco.git
cd capisco

# Install all dependencies
npm run install:all

# Configure backend secrets
cp backend/.env.example backend/.env
# Edit backend/.env and paste your ELEVENLABS_API_KEY

# Run frontend + backend together
npm run dev
```

The app will be available at `http://localhost:5173`. The backend runs on `http://localhost:3001`.

### Useful commands
```bash
npm run dev           # Frontend + backend together
npm run dev:frontend  # Only the Vite dev server (5173)
npm run dev:backend   # Only the Express API (3001)
npm run build         # Production build of the frontend
npm run build:all     # Build both frontend and backend
npm run start:prod    # Run the built backend (serves the frontend dist/)
```

## Deploying

The repo is set up so the **backend serves the built frontend** in production. A single Node process is enough:

```bash
npm run build:all
npm run start:prod
```

Required env var:
- `ELEVENLABS_API_KEY` — your ElevenLabs key
- `PORT` (optional) — defaults to `3001`

You can deploy this to any Node host (Render, Fly.io, Railway, a tiny VPS, etc.). A `render.yaml` is included for reference.

## Features

- Voice mode (speak and translate)
- Text mode (type and translate)
- Translation history (kept locally)
- Voice cloning via ElevenLabs, with persistence
- Cultural notes for common idioms
- Web Speech Synthesis fallback if cloning is unavailable
- Mobile-first design, PWA-ready (installable to home screen)

## Privacy

- Your voice clone lives in your ElevenLabs account (the backend creates it on your key) and a reference (`voiceId`) is stored only in your browser's `localStorage`.
- Translations and history are kept locally — they don't leave the device.
- The backend stores nothing.

## License

MIT
