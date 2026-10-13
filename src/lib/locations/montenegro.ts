import type { Location } from "@/types/domain";

/** Montenegro MVP locations — extensible registry pattern for future regions. */
export const MONTENEGRO_LOCATIONS: Location[] = [
  {
    id: "podgorica",
    name: "Podgorica",
    type: "urban",
    coordinates: [19.2594, 42.4304],
    baseScores: {
      nightlife: 0.55,
      outdoor: 0.45,
      cultureArt: 0.5,
      luxury: 0.4,
      crowdTolerance: 0.75,
      beachFocus: 0.05,
      food: 0.6,
      safetyPriority: 0.85,
    },
  },
  {
    id: "budva",
    name: "Budva",
    type: "coastal",
    coordinates: [18.8383, 42.2911],
    baseScores: {
      nightlife: 0.85,
      outdoor: 0.7,
      cultureArt: 0.55,
      luxury: 0.65,
      crowdTolerance: 0.35,
      beachFocus: 0.9,
      food: 0.7,
      safetyPriority: 0.8,
    },
  },
  {
    id: "kotor",
    name: "Kotor",
    type: "bay",
    coordinates: [18.7683, 42.4247],
    baseScores: {
      nightlife: 0.4,
      outdoor: 0.75,
      cultureArt: 0.92,
      luxury: 0.55,
      crowdTolerance: 0.3,
      beachFocus: 0.35,
      food: 0.75,
      safetyPriority: 0.88,
    },
  },
  {
    id: "tivat",
    name: "Tivat",
    type: "bay",
    coordinates: [18.7235, 42.434],
    baseScores: {
      nightlife: 0.5,
      outdoor: 0.6,
      cultureArt: 0.45,
      luxury: 0.95,
      crowdTolerance: 0.55,
      beachFocus: 0.5,
      food: 0.8,
      safetyPriority: 0.9,
    },
  },
];

export function getRegionLocations(regionId: string): Location[] {
  if (regionId === "montenegro") return MONTENEGRO_LOCATIONS;
  return MONTENEGRO_LOCATIONS;
}
