import type { Continent, Region } from "@/types/domain";

/** Spec-aligned region list — used for Zod + UI chips */
export const REGIONS = [
  "Western Europe",
  "Southern Europe",
  "Northern Europe",
  "Eastern Europe",
  "Balkans",
  "North America",
  "Central America",
  "South America",
  "Caribbean",
  "North Africa",
  "West Africa",
  "East Africa",
  "Southern Africa",
  "East Asia",
  "Southeast Asia",
  "South Asia",
  "Central Asia",
  "Middle East",
] as const satisfies readonly Region[];

export const CONTINENTS = [
  "Europe",
  "Americas",
  "Africa",
  "Asia",
] as const satisfies readonly Continent[];

export function isRegion(value: string): value is Region {
  return (REGIONS as readonly string[]).includes(value);
}
