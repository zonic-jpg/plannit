import { enrichLocation } from "@/data/corpus/derive-scores";
import type {
  ClimateZone,
  Continent,
  Location,
  Region,
} from "@/types/domain";

export type CitySeedInput = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: Continent;
  region: Region;
  coordinates: [number, number];
  timezone: string;
  population?: number;
  isCapital: boolean;
  tourismTier: 1 | 2 | 3;
  tags: string[];
  climateZone: ClimateZone;
  baseScores?: Record<string, number>;
};

export function city(input: CitySeedInput): Location {
  const enriched = enrichLocation(input);
  if (input.baseScores) {
    enriched.baseScores = { ...enriched.baseScores, ...input.baseScores };
  }
  return enriched;
}
