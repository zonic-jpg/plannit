import type { ItineraryDay, ScoredLocation, TripRequest } from "@/types/domain";

const ACTIVITY_TEMPLATES: Record<
  string,
  { morning: string; afternoon: string; evening: string }
> = {
  Podgorica: {
    morning: "Millennium Bridge walk & coffee at a riverside café",
    afternoon: "National Museum & Old Town Ribnica stroll",
    evening: "Modern Montenegrin tasting menu in city center",
  },
  Budva: {
    morning: "Mogren Beach swim before day-trippers arrive",
    afternoon: "Citadel walls & Old Town lanes",
    evening: "Sunset yacht lounge along the marina",
  },
  Kotor: {
    morning: "Bay of Kotor kayak or quiet waterfront promenade",
    afternoon: "San Giovanni fortress climb (start early)",
    evening: "Seafood in the square with live acoustic sets",
  },
  Tivat: {
    morning: "Porto Montenegro marina walk & design boutiques",
    afternoon: "Luštica peninsula cove hop by boat",
    evening: "Champagne bar overlooking super-yachts",
  },
};

function allocateDays(
  locations: ScoredLocation[],
  durationDays: number,
): string[] {
  if (locations.length === 0) return [];
  const names = locations.map((l) => l.name);
  const slots: string[] = [];
  let idx = 0;
  while (slots.length < durationDays) {
    slots.push(names[idx % names.length]);
    idx += 1;
  }
  return slots;
}

export function buildItinerary(
  request: TripRequest,
  locations: ScoredLocation[],
): ItineraryDay[] {
  const schedule = allocateDays(locations, request.durationDays);

  return schedule.map((location, index) => {
    const template = ACTIVITY_TEMPLATES[location] ?? ACTIVITY_TEMPLATES.Kotor;
    const scored = locations.find((l) => l.name === location);
    return {
      day: index + 1,
      location,
      morning: template.morning,
      afternoon: template.afternoon,
      evening: template.evening,
      notes: scored
        ? `Match score ${Math.round(scored.totalScore * 100)}% — ${scored.rationale}`
        : "Balanced pacing day.",
    };
  });
}
