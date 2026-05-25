"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState, Suspense } from "react";
import { analyzeGoals } from "@/lib/goalAnalyzer";
import type { AnalysisResult } from "@/lib/types";
import Timeline from "@/components/Timeline";
import GoalCard from "@/components/GoalCard";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const age = parseInt(searchParams.get("age") ?? "25", 10);
  const country = searchParams.get("country") ?? "NG";
  const goals = searchParams.get("goals") ?? "";

  const initialResult = useMemo(
    () => analyzeGoals({ age, country, goals }),
    [age, country, goals]
  );

  const [result, setResult] = useState<AnalysisResult>(initialResult);

  function handleSelectOption(goalId: string, optionId: string) {
    setResult((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, selectedOptionId: optionId } : g
      ),
    }));
  }

  const selectedTotal = result.goals.reduce((sum, g) => {
    if (g.selectedOptionId) {
      const opt = g.options.find((o) => o.id === g.selectedOptionId);
      return sum + (opt?.estimatedPrice ?? g.inflationAdjustedCost);
    }
    return sum + g.inflationAdjustedCost;
  }, 0);

  const allSelected = result.goals.every((g) => g.selectedOptionId !== null);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Your Life Plan</h1>
          <p className="text-zinc-500 mt-1">
            Starting at age {age} — {result.goals.length} goals across{" "}
            {result.timelineYears} years
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Start Over
        </button>
      </div>

      <Timeline goals={result.goals} userAge={age} />

      <div className="mt-8 space-y-6">
        {result.goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onSelectOption={handleSelectOption}
          />
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Cost Summary
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-50 rounded-lg p-4">
            <p className="text-xs text-zinc-400">Base Total</p>
            <p className="text-xl font-bold text-zinc-900">
              {result.currency} {result.totalCost.toLocaleString()}
            </p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-xs text-indigo-400">Inflation Adjusted</p>
            <p className="text-xl font-bold text-indigo-700">
              {result.currency}{" "}
              {result.totalInflationAdjusted.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-xs text-green-500">
              {allSelected ? "Your Selections" : "Estimated Total"}
            </p>
            <p className="text-xl font-bold text-green-700">
              {result.currency} {selectedTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          AI Advice
        </h2>
        <ul className="space-y-3">
          {result.advice.map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-zinc-700">{tip}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-zinc-400">
          Analyzing your goals...
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
