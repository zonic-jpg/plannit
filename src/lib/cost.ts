import type { CostEstimate, PreferenceWeights, TripRequest } from "@/types/domain";

const ORIGIN_FLIGHT_BANDS: Record<
  string,
  { min: number; max: number; currency: "USD" | "EUR" }
> = {
  ABV: { min: 3200, max: 4800, currency: "USD" },
  DEFAULT: { min: 2800, max: 4200, currency: "EUR" },
};

const HOTEL_BY_TIER: Record<PreferenceWeights["budgetTier"], number> = {
  mid: 180,
  upper: 320,
  luxury: 520,
};

const DAILY_SPEND_BY_TIER: Record<PreferenceWeights["budgetTier"], number> = {
  mid: 120,
  upper: 220,
  luxury: 380,
};

export function estimateTripCost(request: TripRequest): CostEstimate {
  const band =
    ORIGIN_FLIGHT_BANDS[request.origin.toUpperCase()] ??
    ORIGIN_FLIGHT_BANDS.DEFAULT;
  const tier = request.preferences.budgetTier;
  const hotel5StarPerNight = HOTEL_BY_TIER[tier];
  const dailySpend = DAILY_SPEND_BY_TIER[tier];
  const flightMid = (band.min + band.max) / 2;
  const lodging = hotel5StarPerNight * request.durationDays;
  const onGround = dailySpend * request.durationDays;
  const total = Math.round(flightMid + lodging + onGround);

  return {
    flightsBusiness: band,
    hotel5StarPerNight,
    dailySpend,
    total,
    confidence: request.origin.toUpperCase() === "ABV" ? 0.78 : 0.62,
  };
}
