"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildRequestFromStore, useTripStore } from "@/stores/trip-store";
import type { TripPlanResponse } from "@/types/domain";

async function fetchPlan(request: ReturnType<typeof buildRequestFromStore>) {
  const res = await fetch("/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const err = (await res.json()) as { error?: string };
    throw new Error(err.error ?? "Plan failed");
  }
  return (await res.json()) as TripPlanResponse & { cached?: boolean };
}

export function ChatComposer() {
  const request = useTripStore((s) => s.request);
  const setFreeText = useTripStore((s) => s.setFreeText);
  const setDuration = useTripStore((s) => s.setDuration);
  const setOrigin = useTripStore((s) => s.setOrigin);
  const setPlan = useTripStore((s) => s.setPlan);

  const [localText, setLocalText] = useState(request.freeText ?? "");

  const mutation = useMutation({
    mutationFn: () => fetchPlan(buildRequestFromStore(useTripStore.getState())),
    onSuccess: (plan) => setPlan(plan),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-200/90" />
          Describe your Montenegro trip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="text-xs uppercase tracking-[0.14em] text-stone-400">
            Origin IATA
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-stone-100 outline-none ring-amber-200/30 focus:ring-2"
              value={request.origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </label>
          <label className="text-xs uppercase tracking-[0.14em] text-stone-400">
            Days
            <input
              type="number"
              min={1}
              max={14}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-stone-100 outline-none ring-amber-200/30 focus:ring-2"
              value={request.durationDays}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </label>
        </div>
        <textarea
          className="min-h-[120px] w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-stone-100 outline-none ring-amber-200/30 placeholder:text-stone-500 focus:ring-2"
          placeholder="e.g. Five days from Abuja — old towns, Adriatic swims, one luxury evening in Porto Montenegro."
          value={localText}
          onChange={(e) => {
            setLocalText(e.target.value);
            setFreeText(e.target.value);
          }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Orchestrating…" : "Generate itinerary"}
          </Button>
          {mutation.isError && (
            <p className="text-sm text-red-300/90">{mutation.error.message}</p>
          )}
        </div>
        {mutation.isSuccess && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-stone-400"
          >
            Plan ready — scroll to explore scores, costs, and day-by-day flow.
          </motion.p>
        )}
      </CardContent>
    </Card>
  );
}
