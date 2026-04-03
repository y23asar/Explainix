# Explainix
# AI Reel Generator 🎬

An AI-powered application that converts topics into animated reels, videos, memes, and visual explanations.

## 🚀 Features
- Generate 10–15 sec educational reels
- Create full-length videos (optional)
- Generate memes and concept images
- AI-powered script + voice + animation

## 🛠 Tech Stack
- Frontend: Next.js
- Backend: Node.js / FastAPI
- AI: OpenAI, Runway/Pika, ElevenLabs
- Video Processing: FFmpeg

## ⚙️ Setup

```bash
npm install
npm run dev
```

## Project layout (frontend vs backend)

- **`app/`** – Next.js **frontend** (pages, layouts, onboarding, home, settings).
- **`app/api/`** – Next.js **API routes** (backend surface today, e.g. `app/api/chat` for the assistant).
- **`lib/`**, **`components/`** – Shared helpers and UI.

Use **`OPENAI_API_KEY` in `.env.local`** (copy from `.env.example`) for production-style setup. The Settings page can also store a **temporary dev key** in the browser.

## Splitting into `frontend/` and `backend/` later

This repo is one Next.js app (UI + route handlers). To split for GitHub/deploy:

- Move this app under `frontend/`, and add a separate `backend/` (Node or FastAPI) when you outgrow `app/api/`, or keep using Next API routes as your backend.
