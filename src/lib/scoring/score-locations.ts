import {
  SCORING_DIMENSIONS,
  dimensionLabel,
  type ScoringDimensionId,
} from "@/data/variables";
import type {
  Location,
  PreferenceWeights,
  ScoredLocation,
  ScoringContext,
} from "@/types/domain";
import { preferenceToDimensionWeights } from "@/lib/scoring/weights";
import type { RealtimeSnapshot } from "@/lib/realtime/types";

export type ScoreLocationsInput = {
  locations: Location[];
  preferences: PreferenceWeights;
  context?: ScoringContext;
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
): string {
  const top = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => dimensionLabel(k));

  return `${location.name}, ${location.country} — strongest on ${top.join(" and ")}.`;
}

function topDimensions(breakdown: Record<string, number>, n = 3) {
  return Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id, points]) => ({
      id,
      label: dimensionLabel(id),
      points,
    }));
}

function scoreLocationsInner(input: ScoreLocationsInput): ScoredLocation[] {
  const weights = preferenceToDimensionWeights(input.preferences);
  void input.context;

  const ranked = input.locations.map((location) => {
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
      topDimensions: topDimensions(breakdown),
      rationale: buildRationale(location, breakdown),
    };
  });

  ranked.sort((a, b) => b.totalScore - a.totalScore);
  return ranked;
}

/**
 * §5 — pure, unit-testable scoring entry point.
 * `scoreLocations(preferences, locations, context?)`
 */
export function scoreLocations(
  preferences: PreferenceWeights,
  locations: Location[],
  context?: ScoringContext,
  realtimeByLocation?: Record<string, RealtimeSnapshot>,
): ScoredLocation[] {
  return scoreLocationsInner({
    preferences,
    locations,
    context,
    realtimeByLocation,
  });
}

/** @deprecated Prefer ternary `scoreLocations(prefs, locations, context)` */
export function scoreLocationsFromInput(input: ScoreLocationsInput): ScoredLocation[] {
  return scoreLocationsInner(input);
}

export function explainChoice(
  locationId: string,
  scored: ScoredLocation[],
): string {
  const loc = scored.find((l) => l.id === locationId);
  if (!loc) return "Location not in current scored set.";
  return loc.rationale;
}
