import { describe, expect, it } from "vitest";
import { parseLocationsCsv } from "@/data/corpus/load-csv";

const SAMPLE = `id,name,country,countryCode,continent,region,lng,lat,timezone,isCapital,tourismTier,climateZone,tags
test-city-xx,Test City,Testland,TX,Europe,Western Europe,1,2,Europe/Test,false,2,oceanic,food|culture
`;

describe("parseLocationsCsv", () => {
  it("parses Phase 2 CSV rows into Location records", () => {
    const locs = parseLocationsCsv(SAMPLE);
    expect(locs).toHaveLength(1);
    expect(locs[0]?.id).toBe("test-city-xx");
    expect(locs[0]?.baseScores.nightlife).toBeGreaterThan(0);
  });
});
