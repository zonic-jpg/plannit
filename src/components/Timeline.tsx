"use client";

import type { LifeGoal } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/types";

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
  spiritual: "bg-indigo-400",
  achievement: "bg-yellow-500",
  other: "bg-zinc-500",
};

export default function Timeline({ goals, userAge }: TimelineProps) {
  if (goals.length === 0) return null;

  const maxAge = Math.max(...goals.map((g) => g.endAge)) + 2;
  const totalYears = maxAge - userAge;

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-foreground mb-8">Your timeline</h2>

      {/* Age markers */}
      <div className="hidden sm:flex items-center justify-between text-xs text-muted mb-3">
        {Array.from({ length: Math.min(totalYears + 1, 8) }, (_, i) => {
          const age = userAge + Math.round((i / Math.min(totalYears, 7)) * totalYears);
          return <span key={i}>{age}</span>;
        })}
      </div>
      <div className="hidden sm:block h-px bg-zinc-200 mb-6" />

      {/* Goal bars */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const leftPct = ((goal.startAge - userAge) / totalYears) * 100;
          const widthPct = Math.max(((goal.endAge - goal.startAge) / totalYears) * 100, 10);

          return (
            <div key={goal.id} className="relative h-11 sm:h-10">
              {/* Desktop: positioned bar */}
              <div
                className="hidden sm:flex absolute h-full rounded-xl items-center px-4 min-w-[140px] transition-all"
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  backgroundColor: `var(--tw-${COLORS[goal.category]?.replace("bg-", "")}, #6366f1)`,
                }}
              >
                <span className={`absolute inset-0 rounded-xl ${COLORS[goal.category]}`} />
                <span className="relative text-white text-xs font-medium truncate">
                  {CATEGORY_ICONS[goal.category]} {goal.title} · {goal.startAge}–{goal.endAge}
                </span>
              </div>
              {/* Mobile: full-width card */}
              <div className={`sm:hidden flex items-center gap-3 px-4 h-full rounded-xl ${COLORS[goal.category]}`}>
                <span className="text-white text-xs font-medium truncate">
                  {CATEGORY_ICONS[goal.category]} {goal.title} · Age {goal.startAge}–{goal.endAge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
