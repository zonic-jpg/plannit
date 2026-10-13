"use client";

import { motion } from "framer-motion";
import type { CostEstimate } from "@/types/domain";
import { formatCurrency } from "@/lib/utils";
import { copy } from "@/content/en";

export function CostBar({ cost }: { cost: CostEstimate }) {
  const max = cost.flightsBusiness.max + cost.hotel5StarPerNight * 7 + cost.dailySpend * 7;
  const segments = [
    { label: "Flights", value: (cost.flightsBusiness.min + cost.flightsBusiness.max) / 2, color: "bg-sky-400/80" },
    { label: "Hotels", value: cost.hotel5StarPerNight * 5, color: "bg-amber-200/80" },
    { label: "On ground", value: cost.dailySpend * 5, color: "bg-stone-400/70" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            {copy.costEstimate}
          </p>
          <p className="mt-1 text-3xl font-light text-stone-50">
            {formatCurrency(cost.total, "EUR")}
          </p>
        </div>
        <p className="text-xs text-stone-500">{copy.flightDisclaimer}</p>
      </div>
      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/5">
        {segments.map((seg) => (
          <motion.div
            key={seg.label}
            className={seg.color}
            initial={{ width: 0 }}
            animate={{ width: `${(seg.value / max) * 100}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            title={seg.label}
          />
        ))}
      </div>
      <ul className="mt-4 grid gap-2 text-sm text-stone-400 sm:grid-cols-3">
        <li>
          Flights{" "}
          {formatCurrency(cost.flightsBusiness.min, cost.flightsBusiness.currency)}–
          {formatCurrency(cost.flightsBusiness.max, cost.flightsBusiness.currency)}
        </li>
        <li>5★ / night {formatCurrency(cost.hotel5StarPerNight, "EUR")}</li>
        <li>Daily {formatCurrency(cost.dailySpend, "EUR")}</li>
      </ul>
    </div>
  );
}
