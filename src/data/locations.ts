import type { Location } from "@/types/domain";

/**
 * Montenegro MVP seed — static dimension scores (0–100) from prior research bands.
 * Dynamic dimensions (weather, events, cleanliness live) start as baselines;
 * multipliers applied at request time in scoring engine.
 */
export const LOCATIONS: Location[] = [
  {
    id: "podgorica",
    name: "Podgorica",
    type: "urban",
    coordinates: [19.2594, 42.4304],
    baseScores: {
      nightlife: 58,
      outdoorSports: 52,
      cultureArtFashion: 54,
      luxuryDensity: 42,
      environmentCleanliness: 68,
      weatherSuitability: 72,
      safetyLawOrder: 86,
      marketLocalLife: 74,
      eventCalendar: 55,
      travelTimeFromBase: 88,
      costEfficiency: 78,
    },
  },
  {
    id: "budva",
    name: "Budva",
    type: "coastal",
    coordinates: [18.8383, 42.2911],
    baseScores: {
      nightlife: 88,
      outdoorSports: 76,
      cultureArtFashion: 62,
      luxuryDensity: 68,
      environmentCleanliness: 71,
      weatherSuitability: 84,
      safetyLawOrder: 82,
      marketLocalLife: 70,
      eventCalendar: 82,
      travelTimeFromBase: 62,
      costEfficiency: 58,
    },
  },
  {
    id: "kotor",
    name: "Kotor",
    type: "bay",
    coordinates: [18.7683, 42.4247],
    baseScores: {
      nightlife: 45,
      outdoorSports: 80,
      cultureArtFashion: 94,
      luxuryDensity: 58,
      environmentCleanliness: 79,
      weatherSuitability: 83,
      safetyLawOrder: 90,
      marketLocalLife: 66,
      eventCalendar: 74,
      travelTimeFromBase: 70,
      costEfficiency: 64,
    },
  },
  {
    id: "tivat",
    name: "Tivat",
    type: "bay",
    coordinates: [18.7235, 42.434],
    baseScores: {
      nightlife: 52,
      outdoorSports: 68,
      cultureArtFashion: 48,
      luxuryDensity: 96,
      environmentCleanliness: 82,
      weatherSuitability: 85,
      safetyLawOrder: 91,
      marketLocalLife: 58,
      eventCalendar: 68,
      travelTimeFromBase: 92,
      costEfficiency: 52,
    },
  },
];

export const HOTEL_RANGES_5STAR = {
  podgorica: { min: 140, max: 220, currency: "EUR" as const },
  budva: { min: 280, max: 520, currency: "EUR" as const },
  kotor: { min: 240, max: 450, currency: "EUR" as const },
  tivat: { min: 320, max: 680, currency: "EUR" as const },
};

export const FLIGHT_BUSINESS_ABV = {
  min: 3200,
  max: 4800,
  currency: "USD" as const,
  note: "Static range — live fetch required for booking.",
};

export function getLocationById(id: string): Location | undefined {
  return LOCATIONS.find((l) => l.id === id);
}
