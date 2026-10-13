"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSection } from "@/components/home/HeroSection";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TripMap } from "@/components/map/TripMap";
import { DockChat } from "@/components/planner/DockChat";
import { PreferencePanel } from "@/components/planner/PreferencePanel";
import { CostBar } from "@/components/results/CostBar";
import { ItineraryTimeline } from "@/components/results/ItineraryTimeline";
import { LocationCard } from "@/components/results/LocationCard";
import { copy } from "@/content/en";
import { useTripStore } from "@/stores/trip-store";

export function AetherExperience() {
  const plan = useTripStore((s) => s.plan);
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="relative min-h-screen pb-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_80%_0%,rgba(56,189,248,0.08),transparent)]" />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <HeroSection />

        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mb-6 overflow-hidden"
            >
              <PreferencePanel />
            </motion.div>
          )}
        </AnimatePresence>

        <section id="results" className="space-y-6">
          {!plan ? (
            <p className="text-center text-sm text-stone-500">{copy.emptyPlan}</p>
          ) : (
            <>
              {plan.summary && (
                <p className="text-lg font-light text-stone-200">{plan.summary}</p>
              )}
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  {copy.scoredLocations}
                </p>
                {plan.locations.map((loc, i) => (
                  <LocationCard key={loc.id} location={loc} rank={i + 1} />
                ))}
              </div>
              <CostBar cost={plan.cost} />
              <ItineraryTimeline days={plan.itinerary} />
              <TripMap />
            </>
          )}
        </section>
      </main>
      <DockChat onToggleFilters={() => setFiltersOpen((v) => !v)} />
    </div>
  );
}
