import { city } from "@/data/corpus/seed-helpers";
import { AFRICA_CITIES } from "@/data/corpus/seed/africa";
import { AMERICAS_CITIES } from "@/data/corpus/seed/americas";
import { ASIA_CITIES } from "@/data/corpus/seed/asia";
import { EUROPE_CITIES } from "@/data/corpus/seed/europe";
import type { Location } from "@/types/domain";

const RAW = [
  ...EUROPE_CITIES,
  ...AMERICAS_CITIES,
  ...AFRICA_CITIES,
  ...ASIA_CITIES,
];

export const SEED_LOCATIONS: Location[] = RAW.map(city);
