import { z } from "zod";

/** Runtime validators — kept in sync with `domain.ts`. */

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

export const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["urban", "coastal", "bay"]),
  coordinates: z.tuple([z.number(), z.number()]),
  baseScores: z.record(z.string(), z.number()),
});

export const tripRequestSchema = z.object({
  origin: z.string().min(2).max(8),
  durationDays: z.number().int().min(1).max(14),
  startDate: z.string().optional(),
  preferences: preferenceWeightsSchema,
  freeText: z.string().max(2000).optional(),
});

export const scoredLocationSchema = locationSchema.extend({
  totalScore: z.number().min(0).max(100),
  breakdown: z.record(z.string(), z.number()),
  rationale: z.string(),
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
});

export const tripPlanResponseSchema = z.object({
  request: tripRequestSchema,
  locations: z.array(scoredLocationSchema),
  cost: costEstimateSchema,
  itinerary: z.array(itineraryDaySchema),
  summary: z.string(),
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
