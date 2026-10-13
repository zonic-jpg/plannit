import {
  PREFERENCE_DIMENSION_HINTS,
  SCORING_DIMENSION_META,
  SCORING_DIMENSIONS,
} from "@/data/variables";
import { apiOk } from "@/lib/api/errors";

/** §2 — global dimension framework (for UI/docs/clients) */
export async function GET() {
  return apiOk({
    dimensions: SCORING_DIMENSIONS,
    meta: SCORING_DIMENSION_META,
    preferenceHints: PREFERENCE_DIMENSION_HINTS,
    note: "PreferenceWeights sliders unchanged; weights map to these dimensions at score time.",
  });
}
