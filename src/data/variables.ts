/**
 * §2 Dimension framework (global)
 *
 * All locations — Montenegro or worldwide — use the same scoring dimensions so
 * filters and PreferenceWeights stay consistent. Scoring is a weighted sum of
 * these scores (0–100 per dimension); weights come from PreferenceWeights
 * (normalized to sum to 1). See `src/lib/scoring/weights.ts`.
 *
 * Static dimensions: pre-seeded in each Location.baseScores.
 * Dynamic dimensions: adjusted at request time (weather, events, seawater/air).
 */

export const SCORING_DIMENSIONS = [
  "nightlife",
  "outdoorSports",
  "cultureArtFashion",
  "luxuryDensity",
  "environmentCleanliness",
  "weatherSuitability",
  "safetyLawOrder",
  "marketLocalLife",
  "eventCalendar",
  "travelTimeFromBase",
  "costEfficiency",
] as const;

export type ScoringDimensionId = (typeof SCORING_DIMENSIONS)[number];

export type ScoringDimensionMeta = {
  id: ScoringDimensionId;
  label: string;
  description: string;
  dynamic: boolean;
};

export const SCORING_DIMENSION_META: Record<
  ScoringDimensionId,
  ScoringDimensionMeta
> = {
  nightlife: {
    id: "nightlife",
    label: "Nightlife intensity & quality",
    description: "Clubs, late dining, verified nightlife reputation",
    dynamic: false,
  },
  outdoorSports: {
    id: "outdoorSports",
    label: "Outdoor & sports access",
    description: "Hiking, water sports, parks, active itineraries",
    dynamic: false,
  },
  cultureArtFashion: {
    id: "cultureArtFashion",
    label: "Culture / art / fashion scene",
    description: "Museums, galleries, design, historic cores",
    dynamic: false,
  },
  luxuryDensity: {
    id: "luxuryDensity",
    label: "Luxury & 5-star density",
    description: "Premium hotels, marinas, high-end retail",
    dynamic: false,
  },
  environmentCleanliness: {
    id: "environmentCleanliness",
    label: "Environment cleanliness",
    description: "Air quality, seawater where relevant, urban cleanliness",
    dynamic: true,
  },
  weatherSuitability: {
    id: "weatherSuitability",
    label: "Weather suitability",
    description: "Fit to trip dates; live weather multipliers when available",
    dynamic: true,
  },
  safetyLawOrder: {
    id: "safetyLawOrder",
    label: "Safety & law-and-order perception",
    description: "Travel safety bands and stability",
    dynamic: false,
  },
  marketLocalLife: {
    id: "marketLocalLife",
    label: "Market & local life density",
    description: "Markets, street life, authentic food scenes",
    dynamic: false,
  },
  eventCalendar: {
    id: "eventCalendar",
    label: "Event calendar density",
    description: "Festivals, concerts, seasonal happenings",
    dynamic: true,
  },
  travelTimeFromBase: {
    id: "travelTimeFromBase",
    label: "Travel time from preferred base",
    description: "Connectivity within the trip hub / region",
    dynamic: false,
  },
  costEfficiency: {
    id: "costEfficiency",
    label: "Cost efficiency",
    description: "Value for tier; boosted when budgetTier is mid",
    dynamic: false,
  },
};

/** Maps unchanged PreferenceWeights fields → primary scoring dimensions (informative) */
export const PREFERENCE_DIMENSION_HINTS: Record<string, ScoringDimensionId[]> = {
  nightlife: ["nightlife", "eventCalendar"],
  outdoor: ["outdoorSports", "weatherSuitability"],
  cultureArt: ["cultureArtFashion"],
  luxury: ["luxuryDensity", "travelTimeFromBase"],
  crowdTolerance: ["eventCalendar", "marketLocalLife"],
  beachFocus: ["outdoorSports", "environmentCleanliness", "weatherSuitability"],
  food: ["marketLocalLife"],
  safetyPriority: ["safetyLawOrder", "environmentCleanliness"],
  budgetTier: ["costEfficiency", "luxuryDensity"],
};

export function dimensionLabel(id: string): string {
  const meta = SCORING_DIMENSION_META[id as ScoringDimensionId];
  return meta?.label ?? id;
}
