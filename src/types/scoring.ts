import type { ScoringDimensionId } from "@/data/variables";
import { SCORING_DIMENSIONS } from "@/data/variables";

/**
 * §2 Dimension framework (global) — every Location.baseScores uses these keys (0–100).
 * PreferenceWeights (UI sliders) are unchanged; see `preferenceToDimensionWeights`.
 */
export type BaseDimensionScores = Record<ScoringDimensionId, number>;

export function isCompleteBaseScores(
  scores: Record<string, number>,
): scores is BaseDimensionScores {
  return SCORING_DIMENSIONS.every(
    (dim) => typeof scores[dim] === "number" && scores[dim] >= 0 && scores[dim] <= 100,
  );
}

export const DYNAMIC_SCORING_DIMENSIONS = [
  "environmentCleanliness",
  "weatherSuitability",
  "eventCalendar",
] as const satisfies readonly ScoringDimensionId[];
