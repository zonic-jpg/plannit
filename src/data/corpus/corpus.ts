import { SEED_LOCATIONS } from "@/data/corpus/seed-registry";
import type { Location } from "@/types/domain";

/** Client-safe global corpus accessor (no Node fs). */
export function getGlobalCorpus(): Location[] {
  return SEED_LOCATIONS;
}

export function getLocationById(id: string): Location | undefined {
  return SEED_LOCATIONS.find((l) => l.id === id);
}
