"use client";

import { motion } from "framer-motion";
import { useTripStore } from "@/stores/trip-store";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PlanResults() {
  const plan = useTripStore((s) => s.plan);
  if (!plan) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
      id="results"
    >
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">
          Live plan
        </p>
        <h2 className="mt-2 text-3xl font-light text-stone-50">{plan.summary}</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scored locations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.locations.map((loc, i) => (
              <div
                key={loc.id}
                className="rounded-xl border border-white/5 bg-black/20 p-4"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-xs text-stone-500">#{i + 1}</p>
                    <p className="text-lg text-stone-50">{loc.name}</p>
                  </div>
                  <p className="text-2xl font-light text-amber-100">
                    {Math.round(loc.totalScore * 100)}
                  </p>
                </div>
                <p className="mt-2 text-sm text-stone-400">{loc.rationale}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost estimate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-stone-300">
            <Row
              label="Business flights"
              value={`${formatCurrency(plan.cost.flightsBusiness.min, plan.cost.flightsBusiness.currency)} – ${formatCurrency(plan.cost.flightsBusiness.max, plan.cost.flightsBusiness.currency)}`}
            />
            <Row
              label="5★ hotel / night"
              value={formatCurrency(plan.cost.hotel5StarPerNight, "EUR")}
            />
            <Row
              label="Daily spend"
              value={formatCurrency(plan.cost.dailySpend, "EUR")}
            />
            <div className="border-t border-white/10 pt-4">
              <Row
                label="Trip total (est.)"
                value={formatCurrency(plan.cost.total, "EUR")}
                emphasis
              />
              <p className="mt-2 text-xs text-stone-500">
                Confidence {Math.round(plan.cost.confidence * 100)}% — live fares
                not booked in MVP.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Day by day</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {plan.itinerary.map((day) => (
            <div
              key={day.day}
              className="rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent p-4"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                Day {day.day} · {day.location}
              </p>
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
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.section>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={emphasis ? "text-stone-100" : "text-stone-400"}>
        {label}
      </span>
      <span className={emphasis ? "text-xl text-amber-100" : ""}>{value}</span>
    </div>
  );
}
