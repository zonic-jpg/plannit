"use client";

import type { LifeGoal } from "@/lib/types";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/types";

interface TimelineProps {
  goals: LifeGoal[];
  userAge: number;
}

const COLORS: Record<string, string> = {
  education: "bg-blue-500",
  career: "bg-purple-500",
  property: "bg-emerald-500",
  vehicle: "bg-orange-500",
  family: "bg-pink-500",
  travel: "bg-cyan-500",
  luxury: "bg-amber-500",
  investment: "bg-green-500",
  health: "bg-red-400",
  business: "bg-violet-500",
  other: "bg-zinc-500",
};

export default function Timeline({ goals, userAge }: TimelineProps) {
  if (goals.length === 0) return null;

  const minAge = userAge;
  const maxAge = Math.max(...goals.map((g) => g.endAge)) + 2;
  const totalYears = maxAge - minAge;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900 mb-6">Your Life Timeline</h2>

      <div className="relative">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 px-1">
          {Array.from({ length: Math.min(totalYears + 1, 12) }, (_, i) => {
            const age = minAge + Math.round((i / Math.min(totalYears, 11)) * totalYears);
            return <span key={i}>Age {age}</span>;
          })}
        </div>

        <div className="h-1 bg-zinc-100 rounded-full mb-6" />

        <div className="space-y-3">
          {goals.map((goal) => {
            const leftPct = ((goal.startAge - minAge) / totalYears) * 100;
            const widthPct = ((goal.endAge - goal.startAge) / totalYears) * 100;

            return (
              <div key={goal.id} className="relative h-12">
                <div
                  className={`absolute h-full rounded-lg ${COLORS[goal.category] ?? "bg-zinc-400"} flex items-center px-3 min-w-[120px] transition-all`}
                  style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 8)}%` }}
                >
                  <span className="text-white text-xs font-medium truncate">
                    {CATEGORY_ICONS[goal.category]} {goal.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center gap-1.5 text-xs text-zinc-600">
              <div className={`w-3 h-3 rounded ${COLORS[goal.category] ?? "bg-zinc-400"}`} />
              {CATEGORY_LABELS[goal.category]}
              {goal.concurrent && <span className="text-zinc-400">(concurrent)</span>}
              {goal.dependsOn !== "none" && <span className="text-zinc-400">(sequential)</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
