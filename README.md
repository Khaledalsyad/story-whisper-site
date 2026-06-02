# Hekayet Makan — حكاية مكان

A cinematic, bilingual (Arabic / English) storytelling journey through Egypt's forgotten places.

## Features

- Bilingual UI with full RTL support (Arabic) and LTR (English)
- Cinematic hero, video, places, journey, impact, stats, and team sections
- Visitor Stories — readers can share their own story with an image, location, and mood; like stories from others
- Presentation mode (`/present`) for showcasing the project section-by-section
- Backend powered by Lovable Cloud (database + file storage)

## Tech stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion for animations
- Lovable Cloud (Supabase) for stories, likes, and image storage

## Getting started

```bash
npm install
npm run dev
```

## Project structure

- `src/pages/` — routes (`Index`, `Stats`, `Present`, `PresentMenu`, `PresentSection`)
- `src/components/` — section components and shared UI
- `src/contexts/LanguageContext.tsx` — language + direction (RTL/LTR) state
- `src/integrations/supabase/` — auto-generated backend client and types

## Customize

- Edit copy and place data inside each section component in `src/components/`
- Tweak colors, fonts, and gradients in `src/index.css` and `tailwind.config.ts`
- Replace the OG image and metadata in `index.html`
