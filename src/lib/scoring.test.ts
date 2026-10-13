import { describe, expect, it } from "vitest";
import { LOCATIONS } from "@/data/locations";
import { scoreLocations } from "@/lib/scoring/score-locations";
import { DEFAULT_PREFERENCES, type PreferenceWeights } from "@/types/domain";

const PROFILES: { name: string; prefs: PreferenceWeights }[] = [
  { name: "default reference", prefs: DEFAULT_PREFERENCES },
  {
    name: "beach party",
    prefs: {
      ...DEFAULT_PREFERENCES,
      beachFocus: 1,
      nightlife: 0.95,
      cultureArt: 0.2,
      crowdTolerance: 0.9,
    },
  },
  {
    name: "culture quiet",
    prefs: {
      ...DEFAULT_PREFERENCES,
      cultureArt: 1,
      crowdTolerance: 0.15,
      nightlife: 0.1,
      beachFocus: 0.2,
    },
  },
  {
    name: "luxury yacht",
    prefs: {
      ...DEFAULT_PREFERENCES,
      luxury: 1,
      budgetTier: "luxury",
      beachFocus: 0.55,
      nightlife: 0.45,
    },
  },
  {
    name: "budget explorer",
    prefs: {
      ...DEFAULT_PREFERENCES,
      budgetTier: "mid",
      luxury: 0.15,
      food: 0.9,
      outdoor: 0.85,
    },
  },
];

describe("scoreLocations (spec §4)", () => {
  for (const profile of PROFILES) {
    it(`scores 0–100 for profile: ${profile.name}`, () => {
      const ranked = scoreLocations({
        locations: LOCATIONS,
        preferences: profile.prefs,
      });
      expect(ranked).toHaveLength(4);
      for (const loc of ranked) {
        expect(loc.totalScore).toBeGreaterThanOrEqual(0);
        expect(loc.totalScore).toBeLessThanOrEqual(100);
        expect(loc.rationale.length).toBeGreaterThan(10);
      }
      expect(ranked[0]!.totalScore).toBeGreaterThanOrEqual(ranked[1]!.totalScore);
    });
  }

  it("ranks Budva first for beach party profile", () => {
    const ranked = scoreLocations({
      locations: LOCATIONS,
      preferences: PROFILES[1]!.prefs,
    });
    expect(ranked[0]?.name).toBe("Budva");
  });

  it("ranks Tivat first for luxury yacht profile", () => {
    const ranked = scoreLocations({
      locations: LOCATIONS,
      preferences: PROFILES[3]!.prefs,
    });
    expect(ranked[0]?.name).toBe("Tivat");
  });
});
