import type { Continent, Location, PreferenceWeights, Region, TripFilters } from "@/types/domain";

export type FilterContext = {
  freeText?: string;
  preferences?: PreferenceWeights;
};

const BEACH_TERMS = /beach|coast|adriatic|sea|island|swim/i;
const LUXURY_TERMS = /luxury|yacht|5-star|five star|marina|porto/i;
const CULTURE_TERMS = /culture|museum|old town|history|art/i;
const CONTINENT_TERMS: Record<string, Continent> = {
  europe: "Europe",
  americas: "Americas",
  america: "Americas",
  africa: "Africa",
  asia: "Asia",
};

function inferFromFreeText(text: string): Partial<TripFilters> {
  const lower = text.toLowerCase();
  const inferred: Partial<TripFilters> = {};
  for (const [term, continent] of Object.entries(CONTINENT_TERMS)) {
    if (lower.includes(term)) {
      inferred.continents = [continent];
      break;
    }
  }
  if (lower.includes("balkans") || lower.includes("montenegro")) {
    inferred.regions = ["Balkans"];
    inferred.continents = ["Europe"];
  }
  if (BEACH_TERMS.test(text)) {
    inferred.requiredTags = ["beach"];
  }
  if (LUXURY_TERMS.test(text)) {
    inferred.requiredTags = [...(inferred.requiredTags ?? []), "luxury"];
  }
  if (CULTURE_TERMS.test(text) && !inferred.regions?.includes("Balkans")) {
    inferred.requiredTags = [...(inferred.requiredTags ?? []), "culture"];
  }
  return inferred;
}

export function mergeFilters(
  explicit?: TripFilters,
  context?: FilterContext,
): TripFilters {
  const inferred = context?.freeText ? inferFromFreeText(context.freeText) : {};
  return {
    maxResults: explicit?.maxResults ?? inferred.maxResults ?? 8,
    continents: explicit?.continents ?? inferred.continents,
    regions: explicit?.regions ?? inferred.regions,
    climateZones: explicit?.climateZones ?? inferred.climateZones,
    requiredTags: explicit?.requiredTags ?? inferred.requiredTags,
    tourismTierMax: explicit?.tourismTierMax ?? inferred.tourismTierMax,
  };
}

export function filterLocations(
  corpus: Location[],
  filters: TripFilters,
): { locations: Location[]; summary: string } {
  let pool = [...corpus];
  const notes: string[] = [];

  if (filters.continents?.length) {
    pool = pool.filter((l) => filters.continents!.includes(l.continent));
    notes.push(`continent ∈ ${filters.continents.join(", ")}`);
  }
  if (filters.regions?.length) {
    pool = pool.filter((l) => filters.regions!.includes(l.region));
    notes.push(`region ∈ ${filters.regions.join(", ")}`);
  }
  if (filters.climateZones?.length) {
    pool = pool.filter((l) => filters.climateZones!.includes(l.climateZone));
    notes.push(`climate ∈ ${filters.climateZones.join(", ")}`);
  }
  if (filters.tourismTierMax) {
    pool = pool.filter((l) => l.tourismTier <= filters.tourismTierMax!);
    notes.push(`tier ≤ ${filters.tourismTierMax}`);
  }
  if (filters.requiredTags?.length) {
    for (const tag of filters.requiredTags) {
      pool = pool.filter((l) =>
        l.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
      );
    }
    notes.push(`tags ⊇ ${filters.requiredTags.join(", ")}`);
  }

  const summary =
    notes.length > 0
      ? `${pool.length} cities after filters (${notes.join("; ")}).`
      : `${pool.length} cities in scope (global corpus).`;

  return { locations: pool, summary };
}

export function getRegionIndex(corpus: Location[]) {
  const continents = new Set<Continent>();
  const regions = new Set<Region>();
  for (const loc of corpus) {
    continents.add(loc.continent);
    regions.add(loc.region);
  }
  return {
    continents: [...continents].sort(),
    regions: [...regions].sort(),
    total: corpus.length,
  };
}
