import { NextResponse } from "next/server";
import { z } from "zod";
import { createTripPlan } from "@/lib/ai/planner";
import { planFingerprint, readCachedPlan, writeCachedPlan } from "@/lib/db";
import { DEFAULT_PREFERENCES, type TripPlanResponse } from "@/types/domain";
import {
  preferenceWeightsSchema,
  tripPlanResponseSchema,
  tripRequestSchema,
} from "@/types/domain.schema";

const planRequestBodySchema = tripRequestSchema.extend({
  preferences: preferenceWeightsSchema.optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = planRequestBodySchema.parse(body);
    const draft: TripPlanResponse = {
      request: {
        origin: parsed.origin,
        durationDays: parsed.durationDays,
        startDate: parsed.startDate,
        freeText: parsed.freeText,
        preferences: { ...DEFAULT_PREFERENCES, ...parsed.preferences },
      },
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
    const fingerprint = planFingerprint(draft);
    const cached = await readCachedPlan(fingerprint);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    const plan = await createTripPlan(draft.request);
    tripPlanResponseSchema.parse(plan);
    await writeCachedPlan(planFingerprint(plan), plan);
    return NextResponse.json({ ...plan, cached: false });
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.issues.map((i) => i.message).join(", ")
        : "Unable to build trip plan";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
