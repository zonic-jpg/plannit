import {
  SCORING_DIMENSIONS,
  dimensionLabel,
  type ScoringDimensionId,
} from "@/data/variables";
import type { PreferenceWeights, ScoredLocation } from "@/types/domain";
import type { Location } from "@/types/domain";
import { preferenceToDimensionWeights } from "@/lib/scoring/weights";
import type { RealtimeSnapshot } from "@/lib/realtime/types";

export type ScoreLocationsInput = {
  locations: Location[];
  preferences: PreferenceWeights;
  dates?: string;
  realtimeByLocation?: Record<string, RealtimeSnapshot>;
};

function applyDynamicMultipliers(
  baseScores: Record<string, number>,
  realtime?: RealtimeSnapshot,
): Record<ScoringDimensionId, number> {
  const scores = {} as Record<ScoringDimensionId, number>;
  for (const dim of SCORING_DIMENSIONS) {
    scores[dim] = baseScores[dim] ?? 50;
  }
  if (!realtime) return scores;

  scores.weatherSuitability = Math.min(
    100,
    scores.weatherSuitability * realtime.weather.suitabilityMultiplier,
  );
  scores.eventCalendar = Math.min(
    100,
    scores.eventCalendar * realtime.events.densityMultiplier,
  );
  scores.environmentCleanliness = Math.min(
    100,
    scores.environmentCleanliness * realtime.seawaterQuality.multiplier,
  );
  return scores;
}

function buildRationale(
  location: Location,
  breakdown: Record<string, number>,
  prefs: PreferenceWeights,
): string {
  const top = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => dimensionLabel(k));

  const crowdNote =
    prefs.crowdTolerance < 0.45 && location.name === "Budva"
      ? "Peak-season energy — plan mornings for quieter Adriatic time."
      : "Pacing aligns with your crowd comfort.";

  return `${location.name} leads on ${top.join(" and ")}. ${crowdNote}`;
}

/**
 * Spec §4: weighted sum of normalized dimension scores (0–100).
 * Returns totalScore 0–100 and breakdown as weighted contribution points.
 */
export function scoreLocations(input: ScoreLocationsInput): ScoredLocation[] {
  const weights = preferenceToDimensionWeights(input.preferences);

  return input.locations
    .map((location) => {
      const realtime = input.realtimeByLocation?.[location.id];
      const dimScores = applyDynamicMultipliers(location.baseScores, realtime);

      const breakdown: Record<string, number> = {};
      let total = 0;

      for (const dim of SCORING_DIMENSIONS) {
        const w = weights[dim];
        const points = w * dimScores[dim];
        breakdown[dim] = Math.round(points * 10) / 10;
        total += points;
      }

      const totalScore = Math.round(Math.min(100, Math.max(0, total)));

      return {
        ...location,
        totalScore,
        breakdown,
        rationale: buildRationale(location, breakdown, input.preferences),
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}

export function explainChoice(
  locationId: string,
  scored: ScoredLocation[],
): string {
  const loc = scored.find((l) => l.id === locationId);
  if (!loc) return "Location not in current scored set.";
  return loc.rationale;
}
