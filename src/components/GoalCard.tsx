"use client";

import Image from "next/image";
import type { LifeGoal } from "@/lib/types";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/types";

interface GoalCardProps {
  goal: LifeGoal;
  onSelectOption: (goalId: string, optionId: string) => void;
}

export default function GoalCard({ goal, onSelectOption }: GoalCardProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{CATEGORY_ICONS[goal.category]}</span>
              <h3 className="text-lg font-semibold text-zinc-900">{goal.title}</h3>
            </div>
            <p className="text-sm text-zinc-500">{goal.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-zinc-400">{CATEGORY_LABELS[goal.category]}</p>
            <p className="text-xs text-zinc-400 mt-1">Age {goal.startAge} – {goal.endAge}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-4 text-sm">
          <div className="bg-zinc-50 rounded-lg px-4 py-2">
            <p className="text-xs text-zinc-400">Base Cost</p>
            <p className="font-semibold text-zinc-900">
              {goal.currency} {goal.estimatedCost.toLocaleString()}
            </p>
          </div>
          <div className="bg-indigo-50 rounded-lg px-4 py-2">
            <p className="text-xs text-indigo-400">Inflation Adjusted</p>
            <p className="font-semibold text-indigo-700">
              {goal.currency} {goal.inflationAdjustedCost.toLocaleString()}
            </p>
          </div>
          {goal.concurrent && (
            <div className="bg-green-50 rounded-lg px-4 py-2 flex items-center">
              <p className="text-xs font-medium text-green-700">Concurrent</p>
            </div>
          )}
          {goal.dependsOn !== "none" && (
            <div className="bg-amber-50 rounded-lg px-4 py-2 flex items-center">
              <p className="text-xs font-medium text-amber-700">Sequential</p>
            </div>
          )}
        </div>

        <p className="text-xs text-zinc-500 italic mb-4">{goal.aiNotes}</p>

        <h4 className="text-sm font-semibold text-zinc-700 mb-3">Select an option:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {goal.options.map((option) => {
            const selected = goal.selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onSelectOption(goal.id, option.id)}
                className={`text-left rounded-lg border-2 p-4 transition-all ${
                  selected
                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                    : "border-zinc-200 hover:border-indigo-300 bg-white"
                }`}
              >
                <div className="relative h-24 rounded-lg overflow-hidden mb-3 bg-zinc-100">
                  <Image
                    src={option.imageUrl}
                    alt={option.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-semibold text-zinc-900">{option.name}</p>
                <p className="text-xs text-zinc-500 mb-1">{option.brand}</p>
                <p className="text-xs text-zinc-400 mb-2">{option.description}</p>
                <p className="text-sm font-bold text-indigo-600">
                  {goal.currency} {option.estimatedPrice.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-400">{option.supplier}</p>
                {selected && (
                  <div className="mt-2 text-xs font-medium text-indigo-600">✓ Selected</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
