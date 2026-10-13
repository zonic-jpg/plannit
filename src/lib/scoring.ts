import {
  SCORE_DIMENSIONS,
  type PreferenceWeights,
  type ScoredLocation,
  type ScoreDimension,
} from "@/types/domain";
import type { Location } from "@/types/domain";

function dimensionWeight(
  prefs: PreferenceWeights,
  dimension: ScoreDimension,
): number {
  return prefs[dimension];
}

function budgetMultiplier(tier: PreferenceWeights["budgetTier"]): number {
  switch (tier) {
    case "luxury":
      return 1.08;
    case "upper":
      return 1.02;
    default:
      return 0.96;
  }
}

function buildRationale(
  location: Location,
  breakdown: Record<string, number>,
  prefs: PreferenceWeights,
): string {
  const top = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k);

  const crowdNote =
    prefs.crowdTolerance < 0.45 && location.baseScores.crowdTolerance < 0.45
      ? "Expect peak-season energy — plan mornings for quieter moments."
      : "Crowd levels align with your tolerance.";

  return `${location.name} excels on ${top.join(" & ")}. ${crowdNote}`;
}

export function scoreLocations(
  locations: Location[],
  prefs: PreferenceWeights,
): ScoredLocation[] {
  const multiplier = budgetMultiplier(prefs.budgetTier);

  return locations
    .map((location) => {
      const breakdown: Record<string, number> = {};
      let weightedSum = 0;
      let weightTotal = 0;

      for (const dim of SCORE_DIMENSIONS) {
        const w = dimensionWeight(prefs, dim);
        const base = location.baseScores[dim] ?? 0;
        const contribution = base * w;
        breakdown[dim] = Math.round(contribution * 1000) / 1000;
        weightedSum += contribution;
        weightTotal += w;
      }

      const normalized =
        weightTotal > 0 ? (weightedSum / weightTotal) * multiplier : 0;
      const totalScore = Math.round(Math.min(normalized, 1) * 1000) / 1000;

      return {
        ...location,
        totalScore,
        breakdown,
        rationale: buildRationale(location, breakdown, prefs),
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}
