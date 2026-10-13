/**
 * Core domain model — Aether spec §3 (Montenegro MVP).
 * Single source of truth for preference, location, trip, score, cost, and itinerary shapes.
 */

export type PreferenceWeights = {
  nightlife: number; // 0-1
  outdoor: number;
  cultureArt: number;
  luxury: number;
  crowdTolerance: number; // 0 = avoid peak, 1 = indifferent
  beachFocus: number;
  food: number;
  safetyPriority: number;
  budgetTier: "mid" | "upper" | "luxury";
};

export type Location = {
  id: string;
  name: string; // 'Podgorica' | 'Budva' | 'Kotor' | 'Tivat'
  type: "urban" | "coastal" | "bay";
  coordinates: [number, number];
  baseScores: Record<string, number>; // pre-computed against variables
};

export type TripRequest = {
  origin: string; // 'ABV'
  durationDays: number;
  startDate?: string;
  preferences: PreferenceWeights;
  freeText?: string;
};

export type ScoredLocation = Location & {
  totalScore: number;
  breakdown: Record<string, number>;
  rationale: string;
};

export type CostEstimate = {
  flightsBusiness: { min: number; max: number; currency: "USD" | "EUR" };
  hotel5StarPerNight: number;
  dailySpend: number;
  total: number;
  confidence: number;
};

export type ItineraryDay = {
  day: number;
  location: string;
  morning: string;
  afternoon: string;
  evening: string;
  notes: string;
};

/** API envelope (extends §3 with live signals + summary). */
export type LiveSignal = {
  kind: "weather" | "event" | "status";
  location: string;
  message: string;
  at: string;
};

export type TripPlanResponse = {
  request: TripRequest;
  locations: ScoredLocation[];
  cost: CostEstimate;
  itinerary: ItineraryDay[];
  summary: string;
  signals: LiveSignal[];
};

export const SCORE_DIMENSIONS = [
  "nightlife",
  "outdoor",
  "cultureArt",
  "luxury",
  "crowdTolerance",
  "beachFocus",
  "food",
  "safetyPriority",
] as const satisfies readonly (keyof Omit<PreferenceWeights, "budgetTier">)[];

export type ScoreDimension = (typeof SCORE_DIMENSIONS)[number];

export const DEFAULT_PREFERENCES: PreferenceWeights = {
  nightlife: 0.35,
  outdoor: 0.55,
  cultureArt: 0.6,
  luxury: 0.7,
  crowdTolerance: 0.4,
  beachFocus: 0.5,
  food: 0.65,
  safetyPriority: 0.8,
  budgetTier: "upper",
};

export const REFERENCE_TRIP: TripRequest = {
  origin: "ABV",
  durationDays: 5,
  preferences: DEFAULT_PREFERENCES,
  freeText:
    "Five days from Abuja — mix Adriatic coast, old towns, and one relaxed luxury evening in Porto Montenegro.",
};
