"use client";

import { motion } from "framer-motion";
import type { ScoredLocation } from "@/types/domain";
import { ScoreRing } from "@/components/ui/score-ring";
import { countryCodeToFlag } from "@/lib/flags";

export function LocationCard({
  location,
  rank,
}: {
  location: ScoredLocation;
  rank: number;
}) {
  const tops = location.topDimensions?.slice(0, 3) ?? [];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
    >
      <ScoreRing score={location.totalScore} label={location.name} />
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
          #{rank} · {location.region}
        </p>
        <h3 className="flex items-center gap-2 text-2xl font-light text-stone-50">
          <span aria-hidden>{countryCodeToFlag(location.countryCode)}</span>
          {location.name}
          <span className="text-base text-stone-500">{location.country}</span>
        </h3>
        {tops.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {tops.map((d) => (
              <li
                key={d.id}
                className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-stone-300"
              >
                {d.label}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-sm leading-relaxed text-stone-400">
          {location.rationale}
        </p>
      </div>
    </motion.article>
  );
}
