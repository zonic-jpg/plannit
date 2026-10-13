import { z } from "zod";
import { CONTINENTS, REGIONS } from "@/types/regions";

export const preferenceWeightsSchema = z.object({
  nightlife: z.number().min(0).max(1),
  outdoor: z.number().min(0).max(1),
  cultureArt: z.number().min(0).max(1),
  luxury: z.number().min(0).max(1),
  crowdTolerance: z.number().min(0).max(1),
  beachFocus: z.number().min(0).max(1),
  food: z.number().min(0).max(1),
  safetyPriority: z.number().min(0).max(1),
  budgetTier: z.enum(["mid", "upper", "luxury"]),
});

const continentSchema = z.enum(CONTINENTS);
const regionSchema = z.enum(REGIONS);

export const tripFiltersSchema = z.object({
  continents: z.array(continentSchema).optional(),
  regions: z.array(regionSchema).optional(),
  climateZones: z
    .array(
      z.enum([
        "mediterranean",
        "continental",
        "tropical",
        "desert",
        "oceanic",
        "alpine",
        "subtropical",
      ]),
    )
    .optional(),
  requiredTags: z.array(z.string()).optional(),
  tourismTierMax: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  maxResults: z.number().int().min(1).max(20).optional(),
});

export const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  countryCode: z.string().length(2),
  continent: continentSchema,
  region: regionSchema,
  coordinates: z.tuple([z.number(), z.number()]),
  timezone: z.string(),
  population: z.number().optional(),
  isCapital: z.boolean(),
  tourismTier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  baseScores: z.record(z.string(), z.number()),
  tags: z.array(z.string()),
  climateZone: z.enum([
    "mediterranean",
    "continental",
    "tropical",
    "desert",
    "oceanic",
    "alpine",
    "subtropical",
  ]),
});

export const tripRequestSchema = z.object({
  origin: z.string().min(2).max(8),
  durationDays: z.number().int().min(1).max(14),
  startDate: z.string().optional(),
  preferences: preferenceWeightsSchema,
  freeText: z.string().max(2000).optional(),
  filters: tripFiltersSchema.optional(),
});

export const scoredLocationSchema = locationSchema.extend({
  totalScore: z.number().min(0).max(100),
  breakdown: z.record(z.string(), z.number()),
  rationale: z.string(),
  topDimensions: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        points: z.number(),
      }),
    )
    .optional(),
});

export const costEstimateSchema = z.object({
  flightsBusiness: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.enum(["USD", "EUR"]),
  }),
  hotel5StarPerNight: z.number(),
  dailySpend: z.number(),
  total: z.number(),
  confidence: z.number().min(0).max(1),
});

export const itineraryDaySchema = z.object({
  day: z.number().int().min(1),
  location: z.string(),
  morning: z.string(),
  afternoon: z.string(),
  evening: z.string(),
  notes: z.string(),
});

export const agentTraceStepSchema = z.object({
  tool: z.string(),
  input: z.unknown(),
  outputSummary: z.string(),
  at: z.string(),
});

export const tripPlanApiResponseSchema = z.object({
  scoredLocations: z.array(scoredLocationSchema),
  costEstimate: costEstimateSchema,
  itinerary: z.array(itineraryDaySchema),
  agentTrace: z.array(agentTraceStepSchema),
  summary: z.string().optional(),
  filterSummary: z.string().optional(),
});

export const tripPlanResponseSchema = z.object({
  request: tripRequestSchema,
  locations: z.array(scoredLocationSchema),
  cost: costEstimateSchema,
  itinerary: z.array(itineraryDaySchema),
  summary: z.string(),
  filterSummary: z.string().optional(),
  agentTrace: z.array(agentTraceStepSchema).optional(),
  signals: z
    .array(
      z.object({
        kind: z.enum(["weather", "event", "status"]),
        location: z.string(),
        message: z.string(),
        at: z.string(),
      }),
    )
    .optional()
    .default([]),
});
