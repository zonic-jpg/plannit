import { describe, expect, it } from "vitest";
import { filterLocations } from "@/data/corpus/filter-locations";
import { getGlobalCorpus } from "@/data/corpus/corpus";
import { SEED_LOCATIONS } from "@/data/corpus/seed-registry";
import { locationSchema } from "@/types/domain.schema";
import { isRegion } from "@/types/regions";

describe("global corpus", () => {
  it("Phase 1 seed has 80+ cities", () => {
    expect(SEED_LOCATIONS.length).toBeGreaterThanOrEqual(80);
  });

  it("every seed city matches Location schema (§1)", () => {
    for (const loc of SEED_LOCATIONS) {
      expect(isRegion(loc.region)).toBe(true);
      const parsed = locationSchema.safeParse(loc);
      expect(parsed.success).toBe(true);
    }
  });

  it("filters Balkans to Montenegro-adjacent set", () => {
    const { locations } = filterLocations(getGlobalCorpus(), {
      regions: ["Balkans"],
    });
    const names = locations.map((l) => l.name);
    expect(names).toContain("Kotor");
    expect(names).toContain("Budva");
  });

  it("continent filter reduces pool", () => {
    const all = getGlobalCorpus().length;
    const { locations } = filterLocations(getGlobalCorpus(), {
      continents: ["Africa"],
    });
    expect(locations.length).toBeGreaterThan(5);
    expect(locations.length).toBeLessThan(all);
  });
});
