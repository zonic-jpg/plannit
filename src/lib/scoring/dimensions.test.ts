import { describe, expect, it } from "vitest";
import { SCORING_DIMENSIONS } from "@/data/variables";
import { getGlobalCorpus } from "@/data/corpus/corpus";
import { scoreLocations } from "@/lib/scoring/score-locations";
import { isCompleteBaseScores } from "@/types/scoring";
import { DEFAULT_PREFERENCES } from "@/types/domain";

describe("§2 global dimension framework", () => {
  it("every corpus city has all 11 dimension scores (0–100)", () => {
    for (const loc of getGlobalCorpus()) {
      expect(isCompleteBaseScores(loc.baseScores)).toBe(true);
    }
  });

  it("scoring breakdown uses the same dimension ids globally", () => {
    const ranked = scoreLocations({
      locations: getGlobalCorpus().slice(0, 5),
      preferences: DEFAULT_PREFERENCES,
    });
    for (const loc of ranked) {
      for (const dim of SCORING_DIMENSIONS) {
        expect(loc.breakdown[dim]).toBeDefined();
      }
    }
  });
});
