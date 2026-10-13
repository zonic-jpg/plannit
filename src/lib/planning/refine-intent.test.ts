import { describe, expect, it } from "vitest";
import { parseRefineIntent } from "@/lib/planning/refine-intent";
import type { TripPlanApiResponse } from "@/types/domain";

const mockPrevious = {
  scoredLocations: [
    {
      id: "kotor-me",
      name: "Kotor",
      region: "Balkans",
      tags: ["culture", "history"],
    },
  ],
} as unknown as TripPlanApiResponse;

describe("parseRefineIntent", () => {
  it("detects cheaper alternative", () => {
    const r = parseRefineIntent("find a cheaper alternative");
    expect(r.preferenceDelta?.budgetTier).toBe("mid");
  });

  it("detects better nightlife", () => {
    const r = parseRefineIntent("better nightlife please");
    expect(r.preferenceDelta?.nightlife).toBeGreaterThan(0);
  });

  it("detects more like this", () => {
    const r = parseRefineIntent("more like this", mockPrevious);
    expect(r.filters?.lockedCityId).toBe("kotor-me");
  });
});
