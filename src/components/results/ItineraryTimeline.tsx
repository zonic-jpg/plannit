"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ItineraryDay } from "@/types/domain";
import { copy } from "@/content/en";

export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  const [openDay, setOpenDay] = useState<number | null>(days[0]?.day ?? null);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
        {copy.itinerary}
      </p>
      <ol className="relative mt-6 space-y-0 border-l border-white/10 pl-6">
        {days.map((day) => {
          const expanded = openDay === day.day;
          return (
            <li key={day.day} className="relative pb-6 last:pb-0">
              <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-sky-300/90 ring-4 ring-[#070605]" />
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50"
                onClick={() => setOpenDay(expanded ? null : day.day)}
                aria-expanded={expanded}
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                    Day {day.day}
                  </p>
                  <p className="text-lg text-stone-50">{day.location}</p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-stone-400 transition-transform duration-300 ease-out ${expanded ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-3 space-y-2 text-sm text-stone-300">
                      <li>
                        <span className="text-stone-500">Morning — </span>
                        {day.morning}
                      </li>
                      <li>
                        <span className="text-stone-500">Afternoon — </span>
                        {day.afternoon}
                      </li>
                      <li>
                        <span className="text-stone-500">Evening — </span>
                        {day.evening}
                      </li>
                    </ul>
                    <p className="mt-3 text-xs text-stone-500">{day.notes}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
