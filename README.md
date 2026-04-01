# 🇮🇹 CAPISCO

**Aprenda italiano falando português.** Fale uma frase, o app traduz para italiano de forma natural e reproduz com a **sua própria voz** clonada.

![CAPISCO](https://img.shields.io/badge/Status-Beta-orange) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## ✨ Como funciona

1. 🎙️ **Clone sua voz** — Leia um texto curto e o app cria uma cópia da sua voz via ElevenLabs
2. 🗣️ **Fale em português** — Use o microfone ou digite uma frase
3. 🔄 **Tradução instantânea** — Google Translate converte para italiano coloquial
4. 🔊 **Ouça na sua voz** — A tradução é reproduzida com seu clone de voz em italiano

## 🛠️ Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS v4 + Vite |
| Backend | Express 5 + TypeScript |
| Tradução | Google Translate (gratuito) |
| Voice Clone & TTS | ElevenLabs API |
| Speech Recognition | Web Speech API (navegador) |

## 🚀 Rodando localmente

### Pré-requisitos

- Node.js 18+
- Uma [API key do ElevenLabs](https://elevenlabs.io) (plano gratuito funciona)
- Navegador com suporte a Web Speech API (Chrome/Edge)

### Setup

```bash
# Clone o repo
git clone https://github.com/SEU_USER/capisco.git
cd capisco

# Instale dependências
npm run install:all

# Configure o backend
cp backend/.env.example backend/.env
# Edite backend/.env com sua ELEVENLABS_API_KEY

# Rode tudo
bash start.sh
```

O app abre em `http://localhost:5173`

### Comandos úteis

```bash
npm run dev          # Roda frontend + backend juntos
npm run dev:frontend # Só o frontend (porta 5173)
npm run dev:backend  # Só o backend (porta 3001)
npm run build        # Build de produção do frontend
```

## 📱 Features

- ✅ Modo voz (fale e traduza)
- ✅ Modo texto (digite e traduza)
- ✅ Histórico de traduções
- ✅ Clonagem de voz com ElevenLabs
- ✅ Fallback para voz do sistema (sem ElevenLabs)
- ✅ Notas culturais PT → IT
- ✅ Design responsivo (mobile-first)
- ✅ PWA ready

## 📄 Licença

MIT

---

*Feito com ☕ e muitos "mamma mia"*
