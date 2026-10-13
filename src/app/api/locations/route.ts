import { LOCATIONS } from "@/data/locations";
import { SCORING_DIMENSION_META } from "@/data/variables";
import { apiOk } from "@/lib/api/errors";

export async function GET() {
  return apiOk({
    locations: LOCATIONS,
    dimensions: SCORING_DIMENSION_META,
  });
}
