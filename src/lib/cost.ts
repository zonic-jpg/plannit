import { FLIGHT_BUSINESS_ABV, HOTEL_RANGES_5STAR } from "@/data/locations";
import type { CostEstimate, PreferenceWeights, TripRequest } from "@/types/domain";

const DAILY_SPEND_BY_TIER: Record<PreferenceWeights["budgetTier"], number> = {
  mid: 120,
  upper: 220,
  luxury: 380,
};

function hotelNightForTier(
  tier: PreferenceWeights["budgetTier"],
): number {
  const bands = Object.values(HOTEL_RANGES_5STAR);
  const mids = bands.map((b) => (b.min + b.max) / 2);
  const avg = mids.reduce((a, b) => a + b, 0) / mids.length;
  if (tier === "luxury") return Math.round(avg * 1.15);
  if (tier === "mid") return Math.round(avg * 0.75);
  return Math.round(avg);
}

export function estimateTripCost(request: TripRequest): CostEstimate {
  const tier = request.preferences.budgetTier;
  const band =
    request.origin.toUpperCase() === "ABV"
      ? FLIGHT_BUSINESS_ABV
      : { min: 2800, max: 4200, currency: "EUR" as const };

  const hotel5StarPerNight = hotelNightForTier(tier);
  const dailySpend = DAILY_SPEND_BY_TIER[tier];
  const flightMid = (band.min + band.max) / 2;
  const lodging = hotel5StarPerNight * request.durationDays;
  const onGround = dailySpend * request.durationDays;
  const total = Math.round(flightMid + lodging + onGround);

  return {
    flightsBusiness: {
      min: band.min,
      max: band.max,
      currency: band.currency,
    },
    hotel5StarPerNight,
    dailySpend,
    total,
    confidence: request.origin.toUpperCase() === "ABV" ? 0.78 : 0.62,
  };
}
