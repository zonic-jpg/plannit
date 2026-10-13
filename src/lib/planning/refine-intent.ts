import type {
  PreferenceWeights,
  TripFilters,
  TripPlanApiResponse,
} from "@/types/domain";

export type RefineAdjustments = {
  preferenceDelta?: Partial<PreferenceWeights>;
  filters?: Partial<TripFilters>;
  note: string;
};

/** §4 step 5 — heuristic refine from free-text deltas */
export function parseRefineIntent(
  freeTextDelta: string,
  previousPlan?: TripPlanApiResponse,
): RefineAdjustments {
  const text = freeTextDelta.toLowerCase();
  const out: RefineAdjustments = { note: "Re-ranked with your refinement." };

  if (/cheaper|budget|affordable|cost/.test(text)) {
    out.preferenceDelta = {
      ...out.preferenceDelta,
      luxury: -0.2,
      budgetTier: "mid",
    };
    out.note = "Prioritizing cost efficiency and mid-tier value.";
  }

  if (/better nightlife|more nightlife|party|clubs/.test(text)) {
    out.preferenceDelta = {
      ...out.preferenceDelta,
      nightlife: 0.25,
      crowdTolerance: 0.15,
    };
    out.note = "Nightlife and event density weighted higher.";
  }

  if (/more like|similar to|like this/.test(text) && previousPlan?.scoredLocations[0]) {
    const anchor = previousPlan.scoredLocations[0];
    out.filters = {
      ...out.filters,
      regions: [anchor.region],
      lockedCityId: anchor.id,
    };
    out.preferenceDelta = {
      ...out.preferenceDelta,
      cultureArt: Math.min(1, anchor.tags.includes("culture") ? 0.85 : 0.6),
      beachFocus: anchor.tags.some((t) => t.includes("beach")) ? 0.8 : 0.4,
    };
    out.note = `Biased toward places like ${anchor.name} (${anchor.region}).`;
  }

  if (/lock.*region|stay in|only .*region/.test(text) && previousPlan?.scoredLocations[0]) {
    const region = previousPlan.scoredLocations[0].region;
    out.filters = { ...out.filters, lockedRegion: region, regions: [region] };
    out.note = `Locked to ${region} for re-ranking.`;
  }

  if (/lock.*city|focus on/.test(text) && previousPlan?.scoredLocations[0]) {
    const city = previousPlan.scoredLocations[0];
    out.filters = {
      ...out.filters,
      lockedCityId: city.id,
      regions: [city.region],
    };
    out.note = `Anchored on ${city.name}.`;
  }

  return out;
}
