import type { ScoringDimensionId } from "@/data/variables";
import { SCORING_DIMENSIONS } from "@/data/variables";
import type { Location } from "@/types/domain";

type SeedInput = Omit<Location, "baseScores">;

function clamp(n: number) {
  return Math.min(100, Math.max(20, Math.round(n)));
}

/** Rule-based placeholder scores — refine per city in seed JSON overrides. */
export function deriveBaseScores(city: SeedInput): Record<ScoringDimensionId, number> {
  const t = city.tourismTier;
  const tierBoost = t === 1 ? 12 : t === 2 ? 4 : 0;
  const tags = new Set(city.tags.map((x) => x.toLowerCase()));
  const has = (tag: string) => tags.has(tag);

  const scores = {} as Record<ScoringDimensionId, number>;

  scores.nightlife = clamp(45 + tierBoost + (has("nightlife") ? 25 : 0));
  scores.outdoorSports = clamp(
    40 + tierBoost + (has("outdoor") || has("mountain") ? 22 : 0) + (has("beach") ? 12 : 0),
  );
  scores.cultureArtFashion = clamp(
    42 + tierBoost + (has("culture") || has("history") ? 28 : 0) + (has("art") ? 10 : 0),
  );
  scores.luxuryDensity = clamp(
    35 + tierBoost + (has("luxury") ? 30 : 0) + (city.isCapital ? 5 : 0),
  );
  scores.environmentCleanliness = clamp(
    55 + (has("beach") ? 8 : 0) + (city.climateZone === "alpine" ? 10 : 0),
  );
  scores.weatherSuitability = clamp(
    50 +
      (city.climateZone === "mediterranean" || city.climateZone === "subtropical" ? 18 : 0) +
      (city.climateZone === "tropical" ? 15 : 0) +
      (city.climateZone === "desert" ? -5 : 0),
  );
  scores.safetyLawOrder = clamp(58 + tierBoost + (city.isCapital ? 8 : 0));
  scores.marketLocalLife = clamp(
    48 + (has("food") ? 18 : 0) + (has("market") ? 12 : 0) + (city.isCapital ? 10 : 0),
  );
  scores.eventCalendar = clamp(45 + tierBoost + (has("events") || has("festival") ? 20 : 0));
  scores.travelTimeFromBase = clamp(70 - (t === 1 ? 15 : t === 2 ? 8 : 0));
  scores.costEfficiency = clamp(
    75 - tierBoost - (has("luxury") ? 15 : 0) - (city.tourismTier === 1 ? 10 : 0),
  );

  for (const dim of SCORING_DIMENSIONS) {
    if (scores[dim] === undefined) scores[dim] = 50;
  }
  return scores;
}

export function assertCompleteBaseScores(
  scores: Record<string, number>,
): Record<(typeof SCORING_DIMENSIONS)[number], number> {
  for (const dim of SCORING_DIMENSIONS) {
    if (scores[dim] === undefined) scores[dim] = 50;
  }
  return scores as Record<(typeof SCORING_DIMENSIONS)[number], number>;
}

export function enrichLocation(city: SeedInput): Location {
  return { ...city, baseScores: deriveBaseScores(city) };
}
