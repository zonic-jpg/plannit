import type {
  CostEstimate,
  ItineraryDay,
  PreferenceWeights,
  ScoredLocation,
  TripPlanApiResponse,
  TripRequest,
} from "@/types/domain";
import type { AgentTraceStep } from "@/lib/ai/tools";
import {
  toolEstimateCosts,
  toolExplainChoice,
  toolGenerateItinerary,
  toolScoreLocations,
} from "@/lib/ai/tools";

export type TripPlanResult = {
  scoredLocations: ScoredLocation[];
  costEstimate: CostEstimate;
  itinerary: ItineraryDay[];
  agentTrace: AgentTraceStep[];
  summary: string;
};

const AGENT_SUMMARY =
  "Grounded in scored Adriatic data — ranges only, no invented fares or room inventory.";

export async function runPlanningAgent(
  request: TripRequest,
): Promise<TripPlanResult> {
  const trace: AgentTraceStep[] = [];
  const prefs = request.preferences;

  const scored = await toolScoreLocations(prefs, request.startDate);
  trace.push(scored.step);
  const top = scored.data[0];

  const costs = toolEstimateCosts(
    request.origin,
    top?.name ?? "Montenegro",
    request.durationDays,
    prefs.budgetTier,
  );
  trace.push(costs.step);

  const itinerary = toolGenerateItinerary(
    scored.data,
    prefs,
    request.durationDays,
  );
  trace.push(itinerary.step);

  const explain = toolExplainChoice(top?.id ?? "kotor", scored.data);
  trace.push(explain.step);

  return {
    scoredLocations: scored.data,
    costEstimate: costs.data,
    itinerary: itinerary.data,
    agentTrace: trace,
    summary: request.freeText?.trim()
      ? `${AGENT_SUMMARY} ${explain.data}`
      : explain.data,
  };
}

export async function runRefineAgent(
  request: TripRequest,
  _previous: TripPlanApiResponse,
  preferenceDelta?: Partial<PreferenceWeights>,
): Promise<TripPlanResult> {
  const merged: PreferenceWeights = {
    ...request.preferences,
    ...preferenceDelta,
  };
  return runPlanningAgent({ ...request, preferences: merged });
}
