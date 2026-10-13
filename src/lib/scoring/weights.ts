import type { PreferenceWeights } from "@/types/domain";
import type { ScoringDimensionId } from "@/data/variables";

/**
 * Maps user preference sliders (0–1) to scoring-dimension weights, then normalizes to sum 1.
 */
export function preferenceToDimensionWeights(
  prefs: PreferenceWeights,
): Record<ScoringDimensionId, number> {
  const crowdAvoid = 1 - prefs.crowdTolerance;

  const raw: Record<ScoringDimensionId, number> = {
    nightlife: prefs.nightlife * 1.2,
    outdoorSports: prefs.outdoor * 1.1 + prefs.beachFocus * 0.4,
    cultureArtFashion: prefs.cultureArt * 1.15,
    luxuryDensity: prefs.luxury * 1.2,
    environmentCleanliness:
      prefs.beachFocus * 0.5 + prefs.safetyPriority * 0.35 + 0.15,
    weatherSuitability: prefs.outdoor * 0.4 + prefs.beachFocus * 0.5 + 0.2,
    safetyLawOrder: prefs.safetyPriority * 1.25,
    marketLocalLife: prefs.food * 1.1 + crowdAvoid * 0.25,
    eventCalendar: prefs.nightlife * 0.5 + crowdAvoid * 0.35 + 0.15,
    travelTimeFromBase: 0.35 + prefs.luxury * 0.25,
    costEfficiency:
      prefs.budgetTier === "mid"
        ? 1.1
        : prefs.budgetTier === "upper"
          ? 0.75
          : 0.45,
  };

  const sum = Object.values(raw).reduce((a, b) => a + b, 0);
  const out = { ...raw };
  if (sum <= 0) return out;
  for (const key of Object.keys(out) as ScoringDimensionId[]) {
    out[key] = out[key] / sum;
  }
  return out;
}
