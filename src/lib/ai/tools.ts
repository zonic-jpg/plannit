import { z } from "zod";
import { LOCATIONS } from "@/data/locations";
import { estimateTripCost } from "@/lib/cost";
import { buildItinerary } from "@/lib/itinerary";
import { fetchRealtimeBatch } from "@/lib/realtime/fetch-realtime";
import {
  explainChoice,
  scoreLocations,
} from "@/lib/scoring/score-locations";
import type {
  CostEstimate,
  ItineraryDay,
  PreferenceWeights,
  ScoredLocation,
  TripRequest,
} from "@/types/domain";
import type { RealtimeSnapshot } from "@/lib/realtime/types";

export const scoreLocationsToolSchema = z.object({
  preferences: z.custom<PreferenceWeights>(),
  dates: z.string().optional(),
});

export const estimateCostsToolSchema = z.object({
  origin: z.string(),
  location: z.string(),
  duration: z.number().int().min(1),
  budgetTier: z.enum(["mid", "upper", "luxury"]),
});

export const generateItineraryToolSchema = z.object({
  scoredLocations: z.array(z.custom<ScoredLocation>()),
  preferences: z.custom<PreferenceWeights>(),
  duration: z.number().int().min(1),
});

export const fetchRealtimeToolSchema = z.object({
  locationIds: z.array(z.string()),
  date: z.string().optional(),
});

export const explainChoiceToolSchema = z.object({
  locationId: z.string(),
  scoredLocations: z.array(z.custom<ScoredLocation>()),
});

export type AgentTraceStep = {
  tool: string;
  input: unknown;
  outputSummary: string;
  at: string;
};

function trace(tool: string, input: unknown, outputSummary: string): AgentTraceStep {
  return { tool, input, outputSummary, at: new Date().toISOString() };
}

export async function toolScoreLocations(
  preferences: PreferenceWeights,
  dates?: string,
): Promise<{ data: ScoredLocation[]; step: AgentTraceStep; realtime: Record<string, RealtimeSnapshot> }> {
  const locationIds = LOCATIONS.map((l) => l.id);
  const realtime = await fetchRealtimeBatch(locationIds, dates);
  const data = scoreLocations({
    locations: LOCATIONS,
    preferences,
    dates,
    realtimeByLocation: realtime,
  });
  return {
    data,
    realtime,
    step: trace(
      "score_locations",
      { preferences, dates },
      `Ranked ${data.length} locations; top ${data[0]?.name} (${data[0]?.totalScore}).`,
    ),
  };
}

export function toolEstimateCosts(
  origin: string,
  location: string,
  duration: number,
  budgetTier: PreferenceWeights["budgetTier"],
): { data: CostEstimate; step: AgentTraceStep } {
  const request: TripRequest = {
    origin,
    durationDays: duration,
    preferences: {
      nightlife: 0.5,
      outdoor: 0.5,
      cultureArt: 0.5,
      luxury: 0.5,
      crowdTolerance: 0.5,
      beachFocus: 0.5,
      food: 0.5,
      safetyPriority: 0.5,
      budgetTier,
    },
  };
  const data = estimateTripCost(request);
  return {
    data,
    step: trace(
      "estimate_costs",
      { origin, location, duration, budgetTier },
      `Total range anchor €${data.total}; flights static band only.`,
    ),
  };
}

export function toolGenerateItinerary(
  scoredLocations: ScoredLocation[],
  preferences: PreferenceWeights,
  duration: number,
): { data: ItineraryDay[]; step: AgentTraceStep } {
  const request: TripRequest = {
    origin: "ABV",
    durationDays: duration,
    preferences,
  };
  const data = buildItinerary(request, scoredLocations);
  return {
    data,
    step: trace(
      "generate_itinerary",
      { duration, top: scoredLocations[0]?.id },
      `${data.length}-day timeline generated.`,
    ),
  };
}

export async function toolFetchRealtime(
  locationIds: string[],
  date?: string,
): Promise<{ data: Record<string, RealtimeSnapshot>; step: AgentTraceStep }> {
  const data = await fetchRealtimeBatch(locationIds, date);
  return {
    data,
    step: trace(
      "fetch_realtime",
      { locationIds, date },
      `Weather/events/seawater snapshot for ${locationIds.length} locations.`,
    ),
  };
}

export function toolExplainChoice(
  locationId: string,
  scoredLocations: ScoredLocation[],
): { data: string; step: AgentTraceStep } {
  const data = explainChoice(locationId, scoredLocations);
  return {
    data,
    step: trace("explain_choice", { locationId }, data.slice(0, 120)),
  };
}
