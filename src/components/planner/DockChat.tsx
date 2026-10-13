"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copy } from "@/content/en";
import { buildRequestFromStore, useTripStore } from "@/stores/trip-store";
import type { TripPlanResponse } from "@/types/domain";

type ApiPlan = {
  scoredLocations: TripPlanResponse["locations"];
  costEstimate: TripPlanResponse["cost"];
  itinerary: TripPlanResponse["itinerary"];
  agentTrace?: TripPlanResponse["agentTrace"];
  summary?: string;
  filterSummary?: string;
};

async function postPlan(request: ReturnType<typeof buildRequestFromStore>) {
  const res = await fetch("/api/trip/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? copy.errorPlan);
  }
  return data as ApiPlan;
}

export function DockChat({ onToggleFilters }: { onToggleFilters: () => void }) {
  const request = useTripStore((s) => s.request);
  const setFreeText = useTripStore((s) => s.setFreeText);
  const setPlan = useTripStore((s) => s.setPlan);
  const [text, setText] = useState(request.freeText ?? "");
  const [showChips, setShowChips] = useState(false);

  const mutation = useMutation({
    mutationFn: () => postPlan(buildRequestFromStore(useTripStore.getState())),
    onSuccess: (api) => {
      const full: TripPlanResponse = {
        request: buildRequestFromStore(useTripStore.getState()),
        locations: api.scoredLocations,
        cost: api.costEstimate,
        itinerary: api.itinerary,
        summary: api.summary ?? "",
        filterSummary: api.filterSummary,
        signals: [],
        agentTrace: api.agentTrace,
      };
      setPlan(full);
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    },
  });

  const chips = ["More Kotor culture", "Avoid crowds", "Luxury marina night"];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <motion.div
        layout
        className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0c0b09]/90 p-3 shadow-2xl backdrop-blur-xl"
      >
        {showChips && (
          <div className="mb-2 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-stone-300 transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-300/40"
                onClick={() => {
                  setText((t) => `${t} ${chip}`.trim());
                  setFreeText(`${text} ${chip}`.trim());
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggleFilters}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-stone-300 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sky-300/40"
            aria-label={copy.filters}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
          <textarea
            rows={1}
            value={text}
            onFocus={() => setShowChips(true)}
            onChange={(e) => {
              setText(e.target.value);
              setFreeText(e.target.value);
            }}
            placeholder={copy.chatPlaceholder}
            className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40"
          />
          <Button
            size="default"
            className="shrink-0"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            <Sparkles className="h-4 w-4" />
            {mutation.isPending ? copy.generating : copy.generate}
          </Button>
        </div>
        {mutation.isError && (
          <p className="mt-2 text-xs text-red-300" role="alert">
            {mutation.error.message}
          </p>
        )}
      </motion.div>
    </div>
  );
}
