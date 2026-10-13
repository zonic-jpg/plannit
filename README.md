# Aether

AI-native travel companion — **global modern cities** (Europe, Americas, Africa, Asia) with Montenegro as the reference Balkans use case.

Reference trip: **5 days from Abuja (ABV)** — preference engine, filtered corpus scoring (top 8), cost bands, day-by-day itinerary.

## Location engine

- **109 cities** in Phase 1 seed (`src/data/corpus/seed/`)
- Full schema: continent, region, tags, climate, tourism tier, 0–100 dimension scores
- Export JSON: `npm run seed:export` → `public/data/locations.seed.json`
- Import more cities: `npx tsx scripts/import-locations.ts path/to/locations.json`

## Stack

Next.js 15, TypeScript, Tailwind, TanStack Query, Zustand, Mapbox, Vitest, Playwright

## Getting started

```bash
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Plan my trip**. After the first plan, use **continent chips** to narrow the corpus, then plan again.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run test` | Vitest (scoring + corpus) |
| `npm run test:e2e` | Playwright plan flow |
| `npm run seed:export` | Regenerate `public/data/locations.seed.json` |

## API

- `POST /api/trip/plan` — `{ scoredLocations, costEstimate, itinerary, agentTrace, filterSummary }`
- `GET /api/locations?continent=Europe&region=Balkans`
- `GET /api/realtime?location=kotor-me`
