import type { LiveSignal, ScoredLocation } from "@/types/domain";

export function buildLiveSignals(locations: ScoredLocation[]): LiveSignal[] {
  const now = new Date().toISOString();
  return locations.slice(0, 3).flatMap((loc) => [
    {
      kind: "weather" as const,
      location: loc.name,
      message: `Mild Adriatic breeze — ideal for ${loc.type === "urban" ? "city walks" : "golden-hour coast time"}.`,
      at: now,
    },
    {
      kind: "event" as const,
      location: loc.name,
      message:
        loc.name === "Kotor"
          ? "Old Town evening concerts on the marina promenade this week."
          : "Seasonal food festival pop-ups along the waterfront.",
      at: now,
    },
  ]);
}
