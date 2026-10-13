import { NextResponse } from "next/server";
import { z } from "zod";
import { createTripPlan } from "@/lib/ai/planner";
import { planFingerprint, readCachedPlan, writeCachedPlan } from "@/lib/db";
import { DEFAULT_PREFERENCES, type TripPlanResponse } from "@/types/domain";

const tripRequestSchema = z.object({
  origin: z.string().min(2).max(8),
  durationDays: z.number().int().min(1).max(14),
  startDate: z.string().optional(),
  freeText: z.string().max(2000).optional(),
  preferences: z
    .object({
      nightlife: z.number().min(0).max(1),
      outdoor: z.number().min(0).max(1),
      cultureArt: z.number().min(0).max(1),
      luxury: z.number().min(0).max(1),
      crowdTolerance: z.number().min(0).max(1),
      beachFocus: z.number().min(0).max(1),
      food: z.number().min(0).max(1),
      safetyPriority: z.number().min(0).max(1),
      budgetTier: z.enum(["mid", "upper", "luxury"]),
    })
    .optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = tripRequestSchema.parse(body);
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
