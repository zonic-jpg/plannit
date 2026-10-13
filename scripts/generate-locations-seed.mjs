/**
 * Regenerates public/data/locations.seed.json from src/data/corpus/seed-registry.ts
 * Run: node scripts/generate-locations-seed.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { pathToFileURL } from "url";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");

async function main() {
  const mod = await import(
    pathToFileURL(path.join(root, "src/data/corpus/seed-registry.ts")).href
  );
  const locations = mod.SEED_LOCATIONS.map(
    ({ baseScores, ...rest }) => rest,
  );
  mkdirSync(path.join(root, "public/data"), { recursive: true });
  writeFileSync(
    path.join(root, "public/data/locations.seed.json"),
    JSON.stringify({ version: 1, locations }, null, 2),
  );
  console.log(`Wrote ${locations.length} cities to public/data/locations.seed.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
