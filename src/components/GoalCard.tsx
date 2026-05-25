"use client";

import Image from "next/image";
import type { LifeGoal } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/types";

interface GoalCardProps {
  goal: LifeGoal;
  onSelectOption: (goalId: string, optionId: string) => void;
  onEditGoal: (goalId: string, field: string, value: string) => void;
}

export default function GoalCard({ goal, onSelectOption, onEditGoal }: GoalCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{CATEGORY_ICONS[goal.category]}</span>
              <input
                type="text"
                defaultValue={goal.title}
                onBlur={(e) => onEditGoal(goal.id, "title", e.target.value)}
                className="text-lg font-semibold text-foreground bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus:border-accent focus:outline-none w-full transition-colors"
              />
            </div>
            <p className="text-sm text-muted mt-1">{goal.description}</p>
          </div>
          <div className="flex items-center gap-3 text-sm shrink-0">
            <span className="px-3 py-1 bg-card-bg rounded-full text-muted text-xs font-medium">
              Age {goal.startAge}–{goal.endAge}
            </span>
            {goal.concurrent && (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">Concurrent</span>
            )}
            {goal.dependsOn !== "none" && (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">Sequential</span>
            )}
          </div>
        </div>

        {/* Cost summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card-bg rounded-xl p-4">
            <p className="text-xs text-muted mb-1">Base cost</p>
            <p className="text-lg font-semibold text-foreground">
              {goal.currency} {goal.estimatedCost.toLocaleString()}
            </p>
          </div>
          <div className="bg-accent-light rounded-xl p-4">
            <p className="text-xs text-accent/70 mb-1">Inflation adjusted</p>
            <p className="text-lg font-semibold text-accent">
              {goal.currency} {goal.inflationAdjustedCost.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Options grid */}
        <p className="text-sm font-medium text-foreground mb-3">Choose an option</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {goal.options.map((option) => {
            const selected = goal.selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onSelectOption(goal.id, option.id)}
                className={`text-left rounded-xl border-2 overflow-hidden transition-all ${
                  selected
                    ? "border-accent ring-1 ring-accent/20"
                    : "border-zinc-100 hover:border-zinc-300"
                }`}
              >
                <div className="relative aspect-[16/10] bg-card-bg">
                  <Image
                    src={option.imageUrl}
                    alt={option.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  {selected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-foreground">{option.name}</p>
                  <p className="text-xs text-muted">{option.brand} · {option.supplier}</p>
                  <p className="text-sm font-bold text-accent mt-1">
                    {goal.currency} {option.estimatedPrice.toLocaleString()}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
