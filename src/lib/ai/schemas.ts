import { z } from "zod";

export const preferenceAdjustmentsSchema = z.object({
  summary: z.string().max(500),
  weightDeltas: z
    .object({
      nightlife: z.number().min(-0.3).max(0.3).optional(),
      outdoor: z.number().min(-0.3).max(0.3).optional(),
      cultureArt: z.number().min(-0.3).max(0.3).optional(),
      luxury: z.number().min(-0.3).max(0.3).optional(),
      crowdTolerance: z.number().min(-0.3).max(0.3).optional(),
      beachFocus: z.number().min(-0.3).max(0.3).optional(),
      food: z.number().min(-0.3).max(0.3).optional(),
      safetyPriority: z.number().min(-0.3).max(0.3).optional(),
    })
    .optional(),
  budgetTier: z.enum(["mid", "upper", "luxury"]).optional(),
});

export type PreferenceAdjustments = z.infer<typeof preferenceAdjustmentsSchema>;

export const itineraryEnhancementSchema = z.object({
  days: z.array(
    z.object({
      day: z.number().int().min(1),
      morning: z.string().max(200),
      afternoon: z.string().max(200),
      evening: z.string().max(200),
      notes: z.string().max(300),
    }),
  ),
});

export type ItineraryEnhancement = z.infer<typeof itineraryEnhancementSchema>;
