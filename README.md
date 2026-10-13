# Aether

AI-native travel companion — **global modern cities** with Montenegro as the reference Balkans use case.

## Seed strategy (§3)

| Phase | What | In this repo |
|--------|------|----------------|
| **1 — Core seed** | ~80–100 Tier 1/2 cities, curated | **109 cities** in `src/data/corpus/seed/` + `public/data/locations.seed.json` |
| **2 — Expansion** | JSON/CSV ingest, rule-based scores | `loadLocationsFromJson`, `parseLocationsCsv`, `scripts/import-locations.ts`, `scripts/import-locations-csv.ts` |
| **3 — Dynamic** | Weather, events, seawater at runtime | `fetch-realtime.ts` + cached multipliers (OpenWeather optional) |

Do not invent cities in prompts — add rows to seed JSON/CSV and re-import.

## Filtering & ranking (§4)

1. Preferences + free text → agent  
2. Hard filter corpus (continent, region, tags, locks)  
3. `scoreLocations(preferences, locations, context?)` weighted 0–100 sum  
4. Top **8** with breakdown + rationale  
5. **Refine**: `POST /api/trip/refine` with `freeTextDelta` e.g. “cheaper alternative”, “better nightlife”, “more like this”

## Getting started

```bash
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

**Plan my trip** → then **continent chips** → plan again. Region metadata only: `GET /api/locations?meta=1`.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run seed:export` | Regenerate `public/data/locations.seed.json` |
| `npx tsx scripts/import-locations.ts file.json` | Merge JSON seed |
| `npx tsx scripts/import-locations-csv.ts file.csv` | Merge CSV seed |
| `npm run test` | Vitest |
| `npm run test:e2e` | Playwright |

## API

- `POST /api/trip/plan` — full plan + `filterSummary` + `agentTrace`
- `POST /api/trip/refine` — delta preferences / refine phrases
- `GET /api/dimensions` — global scoring dimension framework
- `GET /api/locations?meta=1` — continents/regions without full corpus payload
