import { describe, expect, it } from "vitest";
import { MONTENEGRO_LOCATIONS } from "@/lib/locations/montenegro";
import { scoreLocations } from "@/lib/scoring";
import { DEFAULT_PREFERENCES } from "@/types/domain";

describe("scoreLocations", () => {
  it("ranks Kotor highly for culture-forward defaults", () => {
    const ranked = scoreLocations(MONTENEGRO_LOCATIONS, DEFAULT_PREFERENCES);
    expect(ranked[0]?.name).toBeDefined();
    const kotor = ranked.find((l) => l.name === "Kotor");
    expect(kotor?.totalScore).toBeGreaterThan(0.5);
  });

  it("boosts Budva when beach focus is maximal", () => {
    const ranked = scoreLocations(MONTENEGRO_LOCATIONS, {
      ...DEFAULT_PREFERENCES,
      beachFocus: 1,
      cultureArt: 0.1,
      nightlife: 0.2,
    });
    expect(ranked[0]?.name).toBe("Budva");
  });
});
