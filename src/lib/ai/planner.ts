import { runPlanningAgent } from "@/lib/ai/agent";
import { fetchRealtimeBatch } from "@/lib/realtime/fetch-realtime";
import { buildLiveSignals } from "@/lib/signals";
import type { TripPlanResponse, TripRequest } from "@/types/domain";

/** Legacy entry — delegates to structured agent (spec §5). */
export async function createTripPlan(
  request: TripRequest,
): Promise<TripPlanResponse> {
  const agent = await runPlanningAgent(request);
  const realtime = await fetchRealtimeBatch(
    agent.scoredLocations.map((l) => l.id),
    request.startDate,
  );

  return {
    request,
    locations: agent.scoredLocations,
    cost: agent.costEstimate,
    itinerary: agent.itinerary,
    summary: agent.summary,
    signals: buildLiveSignals(agent.scoredLocations),
    agentTrace: agent.agentTrace,
    realtimeStatus: Object.values(realtime)[0]?.weather.source ?? "estimate",
  };
}
