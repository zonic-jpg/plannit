#!/usr/bin/env npx tsx
/**
 * Import cities from JSON into the running corpus (Phase 2).
 * Usage: npx tsx scripts/import-locations.ts path/to/locations.json
 */
import { loadLocationsFromJson, setCorpusOverride, getGlobalCorpus } from "../src/data/corpus/load-locations";

const file = process.argv[2];
if (!file) {
  console.error("Usage: npx tsx scripts/import-locations.ts <json-file>");
  process.exit(1);
}

const imported = loadLocationsFromJson(file);
const merged = [...getGlobalCorpus()];
const ids = new Set(merged.map((l) => l.id));
for (const loc of imported) {
  if (!ids.has(loc.id)) merged.push(loc);
}
setCorpusOverride(merged);
console.log(`Corpus size: ${merged.length} (${imported.length} imported from file).`);
