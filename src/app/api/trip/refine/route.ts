import { z } from "zod";
import { runRefineAgent } from "@/lib/ai/agent";
import { parseRefineIntent } from "@/lib/planning/refine-intent";
import { apiError, apiOk } from "@/lib/api/errors";
import {
  preferenceWeightsSchema,
  tripPlanApiResponseSchema,
  tripRequestSchema,
} from "@/types/domain.schema";
import {
  DEFAULT_PREFERENCES,
  type TripPlanApiResponse,
  type TripRequest,
} from "@/types/domain";

const bodySchema = z.object({
  request: tripRequestSchema.extend({
    preferences: preferenceWeightsSchema.optional(),
  }),
  previousPlan: tripPlanApiResponseSchema,
  preferenceDelta: preferenceWeightsSchema.partial().optional(),
  freeTextDelta: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.parse(json);
    const intent = parsed.freeTextDelta
      ? parseRefineIntent(
          parsed.freeTextDelta,
          parsed.previousPlan as TripPlanApiResponse,
        )
      : { note: "" };

    const request: TripRequest = {
      ...parsed.request,
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...parsed.request.preferences,
        ...intent.preferenceDelta,
        ...parsed.preferenceDelta,
      },
      filters: {
        maxResults: 8,
        ...parsed.request.filters,
        ...intent.filters,
      } as TripRequest["filters"],
      freeText: [parsed.request.freeText, parsed.freeTextDelta]
        .filter(Boolean)
        .join(" "),
    };

    const refined = await runRefineAgent(
      request,
      parsed.previousPlan as TripPlanApiResponse,
      parsed.preferenceDelta,
    );

    return apiOk({
      scoredLocations: refined.scoredLocations,
      costEstimate: refined.costEstimate,
      itinerary: refined.itinerary,
      agentTrace: refined.agentTrace,
      summary: intent.note ? `${refined.summary} ${intent.note}` : refined.summary,
      filterSummary: refined.filterSummary,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(400, "VALIDATION_ERROR", "Invalid refine payload");
    }
    return apiError(500, "REFINE_FAILED", "Unable to refine plan");
  }
}
