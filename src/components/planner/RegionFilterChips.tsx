"use client";

import type { Continent } from "@/types/domain";
import { useTripStore } from "@/stores/trip-store";

const CONTINENTS: Continent[] = ["Europe", "Americas", "Africa", "Asia"];

export function RegionFilterChips() {
  const hasPlannedOnce = useTripStore((s) => s.hasPlannedOnce);
  const active = useTripStore((s) => s.request.filters?.continents?.[0] ?? null);
  const setContinentFilter = useTripStore((s) => s.setContinentFilter);

  if (!hasPlannedOnce) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2" aria-label="Continent filters">
      <button
        type="button"
        onClick={() => setContinentFilter(null)}
        className={`rounded-full px-3 py-1.5 text-xs transition duration-300 ease-out focus-visible:ring-2 focus-visible:ring-sky-300/50 ${
          !active
            ? "bg-sky-400/20 text-sky-100"
            : "bg-white/5 text-stone-400 hover:bg-white/10"
        }`}
      >
        Global
      </button>
      {CONTINENTS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setContinentFilter(c)}
          className={`rounded-full px-3 py-1.5 text-xs transition duration-300 ease-out focus-visible:ring-2 focus-visible:ring-sky-300/50 ${
            active === c
              ? "bg-sky-400/20 text-sky-100"
              : "bg-white/5 text-stone-400 hover:bg-white/10"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
