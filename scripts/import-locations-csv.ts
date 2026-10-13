#!/usr/bin/env npx tsx
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { parseLocationsCsv } from "../src/data/corpus/load-csv";
import { getGlobalCorpus } from "../src/data/corpus/corpus";

const file = process.argv[2];
if (!file) {
  console.error("Usage: npx tsx scripts/import-locations-csv.ts cities.csv");
  process.exit(1);
}

const csv = readFileSync(file, "utf-8");
const imported = parseLocationsCsv(csv);
const existing = getGlobalCorpus();
const ids = new Set(existing.map((l) => l.id));
const merged = [...existing];
for (const loc of imported) {
  if (!ids.has(loc.id)) merged.push(loc);
}

const out = path.join(process.cwd(), "public/data/locations.seed.json");
writeFileSync(
  out,
  JSON.stringify(
    {
      version: 1,
      locations: merged.map(({ baseScores: _b, ...rest }) => rest),
    },
    null,
    2,
  ),
);
console.log(`Merged ${imported.length} CSV rows → ${merged.length} total → ${out}`);
