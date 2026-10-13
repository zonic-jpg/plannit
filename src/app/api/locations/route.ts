import { filterLocations, getRegionIndex } from "@/data/corpus/filter-locations";
import { getGlobalCorpus } from "@/data/corpus/load-locations";
import { SCORING_DIMENSION_META } from "@/data/variables";
import { apiOk } from "@/lib/api/errors";
import type { Continent, Region } from "@/types/domain";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const continent = searchParams.get("continent") as Continent | null;
  const region = searchParams.get("region") as Region | null;

  const corpus = getGlobalCorpus();
  const { locations } = filterLocations(corpus, {
    continents: continent ? [continent] : undefined,
    regions: region ? [region] : undefined,
    maxResults: 200,
  });

  return apiOk({
    locations,
    dimensions: SCORING_DIMENSION_META,
    index: getRegionIndex(corpus),
  });
}
