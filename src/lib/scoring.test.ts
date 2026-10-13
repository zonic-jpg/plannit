import { describe, expect, it } from "vitest";
import { filterLocations } from "@/data/corpus/filter-locations";
import { getGlobalCorpus } from "@/data/corpus/corpus";
import { scoreLocations } from "@/lib/scoring/score-locations";
import { DEFAULT_PREFERENCES, type PreferenceWeights } from "@/types/domain";

const PROFILES: { name: string; prefs: PreferenceWeights; filters?: { regions?: ["Balkans"] } }[] = [
  { name: "default reference", prefs: DEFAULT_PREFERENCES, filters: { regions: ["Balkans"] } },
  {
    name: "beach party",
    prefs: {
      ...DEFAULT_PREFERENCES,
      beachFocus: 1,
      nightlife: 0.95,
      cultureArt: 0.2,
      crowdTolerance: 0.9,
    },
    filters: { regions: ["Balkans"] },
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
    filters: { regions: ["Balkans"] },
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
    filters: { regions: ["Balkans"] },
  },
  {
    name: "budget explorer global",
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
      const corpus = profile.filters
        ? filterLocations(getGlobalCorpus(), profile.filters).locations
        : getGlobalCorpus();
      const ranked = scoreLocations(profile.prefs, corpus);
      expect(ranked.length).toBeGreaterThan(0);
      for (const loc of ranked) {
        expect(loc.totalScore).toBeGreaterThanOrEqual(0);
        expect(loc.totalScore).toBeLessThanOrEqual(100);
      }
    });
  }

  it("ranks Budva first for beach party in Balkans", () => {
    const { locations } = filterLocations(getGlobalCorpus(), { regions: ["Balkans"] });
    const ranked = scoreLocations(PROFILES[1]!.prefs, locations);
    expect(ranked[0]?.name).toBe("Budva");
  });

  it("ranks Tivat first for luxury yacht in Balkans", () => {
    const { locations } = filterLocations(getGlobalCorpus(), { regions: ["Balkans"] });
    const ranked = scoreLocations(PROFILES[3]!.prefs, locations);
    expect(ranked[0]?.name).toBe("Tivat");
  });
});
