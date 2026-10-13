# Aether

AI-native travel companion — **Montenegro MVP** (Podgorica, Budva, Kotor, Tivat / Porto Montenegro).

Reference trip: **5 days from Abuja (ABV)** with a multi-variable preference engine, scored locations, live cost estimate, and day-by-day itinerary.

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn-style UI, Framer Motion
- TanStack Query + Zustand (local persistence for preferences)
- Route handlers + optional OpenAI structured outputs
- Prisma + PostgreSQL (optional plan cache)
- Mapbox GL JS (dark style)
- Vitest + Playwright

## Getting started

```bash
npm install
cp .env.example .env.local   # optional keys
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), tune preferences, and click **Generate itinerary**.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright critical flow |

## Deploy (Vercel)

Set environment variables from `.env.example`. Database is optional — without `DATABASE_URL`, plans are computed on each request without Postgres caching.
