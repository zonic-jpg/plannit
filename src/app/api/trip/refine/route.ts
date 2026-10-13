import { z } from "zod";
import { runRefineAgent } from "@/lib/ai/agent";
import { apiError, apiOk } from "@/lib/api/errors";
import {
  preferenceWeightsSchema,
  tripPlanApiResponseSchema,
  tripRequestSchema,
} from "@/types/domain.schema";
import { DEFAULT_PREFERENCES } from "@/types/domain";

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
    const request = {
      ...parsed.request,
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...parsed.request.preferences,
      },
      freeText: [parsed.request.freeText, parsed.freeTextDelta]
        .filter(Boolean)
        .join(" "),
    };

    const refined = await runRefineAgent(
      request,
      parsed.previousPlan,
      parsed.preferenceDelta,
    );

    return apiOk({
      scoredLocations: refined.scoredLocations,
      costEstimate: refined.costEstimate,
      itinerary: refined.itinerary,
      agentTrace: refined.agentTrace,
      summary: refined.summary,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(400, "VALIDATION_ERROR", "Invalid refine payload");
    }
    return apiError(500, "REFINE_FAILED", "Unable to refine plan");
  }
}
