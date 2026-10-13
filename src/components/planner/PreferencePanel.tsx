"use client";

import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SCORE_DIMENSIONS, type PreferenceWeights } from "@/types/domain";
import { useTripStore } from "@/stores/trip-store";

const LABELS: Record<(typeof SCORE_DIMENSIONS)[number], string> = {
  nightlife: "Nightlife",
  outdoor: "Outdoors",
  cultureArt: "Culture & art",
  luxury: "Luxury",
  crowdTolerance: "Crowd comfort",
  beachFocus: "Beach focus",
  food: "Food",
  safetyPriority: "Safety priority",
};

export function PreferencePanel() {
  const preferences = useTripStore((s) => s.request.preferences);
  const setPreference = useTripStore((s) => s.setPreference);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Preference engine</CardTitle>
        <p className="text-sm text-stone-400">
          Fine-tune weights — scores update when you regenerate.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {SCORE_DIMENSIONS.map((key) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-[0.14em] text-stone-400">
              <span>{LABELS[key]}</span>
              <span>{Math.round(preferences[key] * 100)}%</span>
            </div>
            <Slider
              value={[preferences[key]]}
              max={1}
              step={0.05}
              onValueChange={([v]) =>
                setPreference(key, v as PreferenceWeights[typeof key])
              }
            />
          </div>
        ))}
        <div className="pt-2">
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-stone-400">
            Budget tier
          </p>
          <div className="flex gap-2">
            {(["mid", "upper", "luxury"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setPreference("budgetTier", tier)}
                className={`rounded-full px-4 py-2 text-xs capitalize transition ${
                  preferences.budgetTier === tier
                    ? "bg-amber-100/90 text-stone-950"
                    : "bg-white/5 text-stone-300 hover:bg-white/10"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
