import type { LiveSignal, ScoredLocation } from "@/types/domain";

export function buildLiveSignals(locations: ScoredLocation[]): LiveSignal[] {
  const now = new Date().toISOString();
  return locations.slice(0, 3).flatMap((loc) => {
    const coastal = loc.tags.some((t) =>
      ["beach", "coastal", "marina", "bay"].includes(t),
    );
    return [
      {
        kind: "weather" as const,
        location: loc.name,
        message: coastal
          ? "Coastal conditions favour golden-hour time outdoors."
          : "City rhythm suits museum mornings and relaxed evenings.",
        at: now,
      },
      {
        kind: "event" as const,
        location: loc.name,
        message: `${loc.region} calendar has active listings this week.`,
        at: now,
      },
    ];
  });
}
