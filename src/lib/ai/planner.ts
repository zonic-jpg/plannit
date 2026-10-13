import { runPlanningAgent } from "@/lib/ai/agent";
import { buildLiveSignals } from "@/lib/signals";
import type { TripPlanResponse, TripRequest } from "@/types/domain";

export async function createTripPlan(
  request: TripRequest,
): Promise<TripPlanResponse> {
  const agent = await runPlanningAgent(request);

  return {
    request,
    locations: agent.scoredLocations,
    cost: agent.costEstimate,
    itinerary: agent.itinerary,
    summary: agent.summary,
    filterSummary: agent.filterSummary,
    signals: buildLiveSignals(agent.scoredLocations),
    agentTrace: agent.agentTrace,
    realtimeStatus: "estimate",
  };
}
