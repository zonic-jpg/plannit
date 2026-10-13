import { describe, expect, it } from "vitest";
import { createTripPlan } from "@/lib/ai/planner";
import { REFERENCE_TRIP } from "@/types/domain";
import { tripPlanResponseSchema } from "@/types/domain.schema";

describe("domain schema contracts", () => {
  it("reference trip plan satisfies TripPlanResponse shape", async () => {
    const plan = await createTripPlan(REFERENCE_TRIP);
    const parsed = tripPlanResponseSchema.safeParse(plan);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.locations.length).toBe(4);
      expect(parsed.data.itinerary.length).toBe(5);
    }
  });
});
