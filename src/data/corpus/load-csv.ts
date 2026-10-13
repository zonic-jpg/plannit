import type { CitySeedInput } from "@/data/corpus/seed-helpers";
import type { ClimateZone, Continent, Region } from "@/types/domain";
import { city } from "@/data/corpus/seed-helpers";
import type { Location } from "@/types/domain";
import { isRegion } from "@/types/regions";

/**
 * Phase 2 — minimal CSV ingest (header row required).
 * Columns: id,name,country,countryCode,continent,region,lng,lat,timezone,isCapital,tourismTier,climateZone,tags
 * tags = pipe-separated e.g. beach|food|nightlife
 */
export function parseLocationsCsv(csv: string): Location[] {
  const lines = csv.trim().split(/\r?\n/);
  const header = lines.shift()?.split(",").map((h) => h.trim());
  if (!header?.includes("id")) {
    throw new Error("CSV must include header with id,name,... columns");
  }

  const rows: CitySeedInput[] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = line.split(",").map((c) => c.trim());
    const row: Record<string, string> = {};
    header.forEach((key, i) => {
      row[key] = cols[i] ?? "";
    });

    const region = row.region ?? "";
    if (!isRegion(region)) {
      throw new Error(`Invalid region "${region}" on row ${row.id}`);
    }

    rows.push({
      id: row.id,
      name: row.name,
      country: row.country,
      countryCode: row.countryCode,
      continent: row.continent as Continent,
      region: region as Region,
      coordinates: [Number(row.lng), Number(row.lat)],
      timezone: row.timezone,
      isCapital: row.isCapital === "true" || row.isCapital === "1",
      tourismTier: Number(row.tourismTier) as 1 | 2 | 3,
      climateZone: row.climateZone as ClimateZone,
      tags: (row.tags ?? "").split("|").filter(Boolean),
    });
  }

  return rows.map(city);
}
