"use client";

import { motion } from "framer-motion";
import type { ScoredLocation } from "@/types/domain";
import { ScoreRing } from "@/components/ui/score-ring";

export function LocationCard({
  location,
  rank,
}: {
  location: ScoredLocation;
  rank: number;
}) {
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
          #{rank}
        </p>
        <h3 className="text-2xl font-light text-stone-50">{location.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-400">
          {location.rationale}
        </p>
      </div>
    </motion.article>
  );
}
