import { z } from "zod";
import { apiError, apiOk } from "@/lib/api/errors";
import { createTripPlan } from "@/lib/ai/planner";
import { planFingerprint, readCachedPlan, writeCachedPlan } from "@/lib/db";
import {
  preferenceWeightsSchema,
  tripRequestSchema,
} from "@/types/domain.schema";
import {
  DEFAULT_PREFERENCES,
  type TripPlanResponse,
  type TripRequest,
} from "@/types/domain";

const bodySchema = tripRequestSchema.extend({
  preferences: preferenceWeightsSchema.optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.parse(json);
    const request: TripRequest = {
      ...parsed,
      preferences: { ...DEFAULT_PREFERENCES, ...parsed.preferences },
      filters: parsed.filters as TripRequest["filters"],
    };

    const draft: TripPlanResponse = {
      request,
      locations: [],
      cost: {
        flightsBusiness: { min: 0, max: 0, currency: "USD" },
        hotel5StarPerNight: 0,
        dailySpend: 0,
        total: 0,
        confidence: 0,
      },
      itinerary: [],
      summary: "",
      signals: [],
    };
    const fp = planFingerprint(draft);
    const cached = await readCachedPlan(fp);
    if (cached) {
      return apiOk({
        scoredLocations: cached.locations,
        costEstimate: cached.cost,
        itinerary: cached.itinerary,
        agentTrace: cached.agentTrace ?? [],
        summary: cached.summary,
        filterSummary: cached.filterSummary,
        cached: true,
      });
    }

    const plan = await createTripPlan(request);
    await writeCachedPlan(planFingerprint(plan), plan);

    return apiOk({
      scoredLocations: plan.locations,
      costEstimate: plan.cost,
      itinerary: plan.itinerary,
      agentTrace: plan.agentTrace ?? [],
      summary: plan.summary,
      filterSummary: plan.filterSummary,
      cached: false,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(
        400,
        "VALIDATION_ERROR",
        error.issues[0]?.message ?? "Invalid body",
      );
    }
    return apiError(500, "PLAN_FAILED", "Unable to build trip plan");
  }
}
