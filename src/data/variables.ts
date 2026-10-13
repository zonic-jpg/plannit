/**
 * Scoring dimensions — spec §4 (static + dynamic slots).
 * Base location scores use these ids (0–100).
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
  dynamic: boolean;
};

export const SCORING_DIMENSION_META: Record<
  ScoringDimensionId,
  ScoringDimensionMeta
> = {
  nightlife: {
    id: "nightlife",
    label: "Nightlife intensity & quality",
    dynamic: false,
  },
  outdoorSports: {
    id: "outdoorSports",
    label: "Outdoor & sports access",
    dynamic: false,
  },
  cultureArtFashion: {
    id: "cultureArtFashion",
    label: "Culture / art / fashion",
    dynamic: false,
  },
  luxuryDensity: {
    id: "luxuryDensity",
    label: "Luxury & 5-star density",
    dynamic: false,
  },
  environmentCleanliness: {
    id: "environmentCleanliness",
    label: "Environment cleanliness",
    dynamic: true,
  },
  weatherSuitability: {
    id: "weatherSuitability",
    label: "Weather suitability",
    dynamic: true,
  },
  safetyLawOrder: {
    id: "safetyLawOrder",
    label: "Safety & law-and-order",
    dynamic: false,
  },
  marketLocalLife: {
    id: "marketLocalLife",
    label: "Market & local life",
    dynamic: false,
  },
  eventCalendar: {
    id: "eventCalendar",
    label: "Event calendar density",
    dynamic: true,
  },
  travelTimeFromBase: {
    id: "travelTimeFromBase",
    label: "Travel time from base",
    dynamic: false,
  },
  costEfficiency: {
    id: "costEfficiency",
    label: "Cost efficiency",
    dynamic: false,
  },
};

/** Human-readable labels for breakdown UI */
export function dimensionLabel(id: string): string {
  const meta = SCORING_DIMENSION_META[id as ScoringDimensionId];
  return meta?.label ?? id;
}
