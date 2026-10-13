import { readFileSync } from "fs";
import path from "path";
import { enrichLocation } from "@/data/corpus/derive-scores";
import type { CitySeedInput } from "@/data/corpus/seed-helpers";
import type { Location } from "@/types/domain";
import { getGlobalCorpus as getClientCorpus } from "@/data/corpus/corpus";

let corpusOverride: Location[] | null = null;

export function getGlobalCorpus(): Location[] {
  return corpusOverride ?? getClientCorpus();
}

export function setCorpusOverride(locations: Location[]): void {
  corpusOverride = locations;
}

export function loadLocationsFromJson(filePath: string): Location[] {
  const raw = readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw) as { locations: CitySeedInput[] };
  return parsed.locations.map((entry) => {
    const enriched = enrichLocation(entry);
    if (entry.baseScores) {
      enriched.baseScores = { ...enriched.baseScores, ...entry.baseScores };
    }
    return enriched;
  });
}

export function loadOptionalFileCorpus(): Location[] {
  try {
    const file = path.join(process.cwd(), "public/data/locations.seed.json");
    return loadLocationsFromJson(file);
  } catch {
    return getGlobalCorpus();
  }
}

export { getLocationById } from "@/data/corpus/corpus";
