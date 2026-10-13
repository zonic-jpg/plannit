/**
 * Core domain model — Aether (global location engine + preference engine).
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

/** Global expansion — updated domain model §1 */
export type Continent = "Europe" | "Americas" | "Africa" | "Asia";

export type Region =
  | "Western Europe"
  | "Southern Europe"
  | "Northern Europe"
  | "Eastern Europe"
  | "Balkans"
  | "North America"
  | "Central America"
  | "South America"
  | "Caribbean"
  | "North Africa"
  | "West Africa"
  | "East Africa"
  | "Southern Africa"
  | "East Asia"
  | "Southeast Asia"
  | "South Asia"
  | "Central Asia"
  | "Middle East";

export type ClimateZone =
  | "mediterranean"
  | "continental"
  | "tropical"
  | "desert"
  | "oceanic"
  | "alpine"
  | "subtropical";

export type Location = {
  id: string; // slug, e.g. "lisbon-pt"
  name: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  continent: Continent;
  region: Region;
  coordinates: [number, number]; // [lng, lat]
  timezone: string;
  population?: number;
  isCapital: boolean;
  tourismTier: 1 | 2 | 3; // 1 = major global destination
  baseScores: Record<string, number>; // 0-100 per dimension
  tags: string[]; // e.g. ["beach", "nightlife", "tech", "history"]
  climateZone: ClimateZone;
};

export type TripFilters = {
  continents?: Continent[];
  regions?: Region[];
  climateZones?: ClimateZone[];
  requiredTags?: string[];
  tourismTierMax?: 1 | 2 | 3;
  maxResults?: number;
  /** §4 — pin a hub city while re-ranking peers in-region */
  lockedCityId?: string;
  lockedRegion?: Region;
};

export type ScoringContext = {
  dates?: string;
  origin?: string;
};

export type TripRequest = {
  origin: string;
  durationDays: number;
  startDate?: string;
  preferences: PreferenceWeights;
  freeText?: string;
  filters?: TripFilters;
};

export type ScoredLocation = Location & {
  totalScore: number;
  breakdown: Record<string, number>;
  rationale: string;
  topDimensions?: { id: string; label: string; points: number }[];
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

export type AgentTraceStep = {
  tool: string;
  input: unknown;
  outputSummary: string;
  at: string;
};

export type TripPlanApiResponse = {
  scoredLocations: ScoredLocation[];
  costEstimate: CostEstimate;
  itinerary: ItineraryDay[];
  agentTrace: AgentTraceStep[];
  summary?: string;
  filterSummary?: string;
};

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
  agentTrace?: AgentTraceStep[];
  filterSummary?: string;
  realtimeStatus?: "live" | "cached" | "estimate";
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
  filters: { regions: ["Balkans"], maxResults: 8 },
};
