import OpenAI from "openai";
import {
  DEFAULT_PREFERENCES,
  type PreferenceWeights,
  type TripPlanResponse,
  type TripRequest,
} from "@/types/domain";
import { estimateTripCost } from "@/lib/cost";
import { buildItinerary } from "@/lib/itinerary";
import { getRegionLocations } from "@/lib/locations/montenegro";
import { scoreLocations } from "@/lib/scoring";
import {
  itineraryEnhancementSchema,
  preferenceAdjustmentsSchema,
  type ItineraryEnhancement,
  type PreferenceAdjustments,
} from "@/lib/ai/schemas";
import { buildLiveSignals } from "@/lib/signals";

function clampWeight(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function applyAdjustments(
  base: PreferenceWeights,
  adj?: PreferenceAdjustments,
): PreferenceWeights {
  if (!adj?.weightDeltas && !adj?.budgetTier) return base;
  const next = { ...base };
  if (adj.weightDeltas) {
    for (const [key, delta] of Object.entries(adj.weightDeltas)) {
      if (delta === undefined) continue;
      const k = key as keyof Omit<PreferenceWeights, "budgetTier">;
      next[k] = clampWeight(next[k] + delta);
    }
  }
  if (adj.budgetTier) next.budgetTier = adj.budgetTier;
  return next;
}

function mergeItineraryEnhancement(
  plan: TripPlanResponse,
  enhancement?: ItineraryEnhancement,
): TripPlanResponse {
  if (!enhancement?.days.length) return plan;
  const byDay = new Map(enhancement.days.map((d) => [d.day, d]));
  return {
    ...plan,
    itinerary: plan.itinerary.map((day) => {
      const patch = byDay.get(day.day);
      if (!patch) return day;
      return { ...day, ...patch, location: day.location };
    }),
  };
}

async function runStructured<T>(
  client: OpenAI,
  schema: { parse: (v: unknown) => T },
  schemaName: string,
  system: string,
  user: string,
): Promise<T | null> {
  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: schemaName,
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            ...(schemaName === "preference_adjustments"
              ? {
                  properties: {
                    summary: { type: "string" },
                    weightDeltas: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        nightlife: { type: "number" },
                        outdoor: { type: "number" },
                        cultureArt: { type: "number" },
                        luxury: { type: "number" },
                        crowdTolerance: { type: "number" },
                        beachFocus: { type: "number" },
                        food: { type: "number" },
                        safetyPriority: { type: "number" },
                      },
                    },
                    budgetTier: {
                      type: "string",
                      enum: ["mid", "upper", "luxury"],
                    },
                  },
                  required: ["summary"],
                }
              : {
                  properties: {
                    days: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                          day: { type: "integer" },
                          morning: { type: "string" },
                          afternoon: { type: "string" },
                          evening: { type: "string" },
                          notes: { type: "string" },
                        },
                        required: [
                          "day",
                          "morning",
                          "afternoon",
                          "evening",
                          "notes",
                        ],
                      },
                    },
                  },
                  required: ["days"],
                }),
          },
        },
      },
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) return null;
    return schema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

function heuristicAdjustments(freeText?: string): PreferenceAdjustments | null {
  if (!freeText?.trim()) return null;
  const text = freeText.toLowerCase();
  const deltas: NonNullable<PreferenceAdjustments["weightDeltas"]> = {};
  if (text.includes("beach") || text.includes("adriatic"))
    deltas.beachFocus = 0.15;
  if (text.includes("luxury") || text.includes("yacht") || text.includes("porto"))
    deltas.luxury = 0.12;
  if (text.includes("culture") || text.includes("old town"))
    deltas.cultureArt = 0.1;
  if (text.includes("quiet") || text.includes("avoid crowd"))
    deltas.crowdTolerance = -0.15;
  if (Object.keys(deltas).length === 0) return null;
  return {
    summary: "Applied keyword tuning from your brief.",
    weightDeltas: deltas,
  };
}

export async function createTripPlan(
  request: TripRequest,
): Promise<TripPlanResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  let preferences = request.preferences ?? DEFAULT_PREFERENCES;
  let summary =
    "Montenegro coast balanced for culture, Adriatic light, and a Porto Montenegro finish.";

  let adjustments: PreferenceAdjustments | null = null;
  if (apiKey && request.freeText) {
    const client = new OpenAI({ apiKey });
    adjustments = await runStructured(
      client,
      preferenceAdjustmentsSchema,
      "preference_adjustments",
      "You tune travel preference weights for Montenegro trips. Return small deltas only.",
      JSON.stringify({ preferences, freeText: request.freeText }),
    );
  }
  if (!adjustments) adjustments = heuristicAdjustments(request.freeText);
  if (adjustments) {
    preferences = applyAdjustments(preferences, adjustments);
    if (adjustments.summary) summary = adjustments.summary;
  }

  const locations = scoreLocations(getRegionLocations("montenegro"), preferences);
  const cost = estimateTripCost({ ...request, preferences });
  const itinerary = buildItinerary({ ...request, preferences }, locations);
  let plan: TripPlanResponse = {
    request: { ...request, preferences },
    locations,
    cost,
    itinerary,
    summary,
    signals: buildLiveSignals(locations),
  };

  if (apiKey) {
    const client = new OpenAI({ apiKey });
    const enhanced = await runStructured(
      client,
      itineraryEnhancementSchema,
      "itinerary_enhancement",
      "Polish day plans for a premium Montenegro itinerary. Keep locations unchanged.",
      JSON.stringify({ itinerary: plan.itinerary, freeText: request.freeText }),
    );
    plan = mergeItineraryEnhancement(plan, enhanced ?? undefined);
  }

  return plan;
}
