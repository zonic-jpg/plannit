"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState, useEffect, Suspense } from "react";
import { analyzeGoals } from "@/lib/goalAnalyzer";
import { downloadICS } from "@/lib/calendarExport";
import { sharePlan, exportPlanAsJSON } from "@/lib/sharePlan";
import { getSiteConfig } from "@/lib/siteConfig";
import { getSession } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";
import type { AnalysisResult } from "@/lib/types";
import Header from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";
import GoalCard from "@/components/GoalCard";
import BrandCard from "@/components/BrandCard";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const age = parseInt(searchParams.get("age") ?? "25", 10);
  const gender = (searchParams.get("gender") ?? "") as import("@/lib/types").Gender;
  const country = searchParams.get("country") ?? "NG";
  const goals = searchParams.get("goals") ?? "";

  const initialResult = useMemo(
    () => analyzeGoals({ age, gender, country, goals }),
    [age, gender, country, goals]
  );

  const [result, setResult] = useState<AnalysisResult>(initialResult);
  const [shareMsg, setShareMsg] = useState("");
  const [editingAdvice, setEditingAdvice] = useState<number | null>(null);

  const user = getSession();
  const config = getSiteConfig();
  const activeBrands = config.brandPlacements.filter((b) => b.active);

  useEffect(() => {
    trackEvent("page_view", { userId: user?.id, metadata: { page: "results", gender } });
    result.goals.forEach((g) => {
      trackEvent("goal_created", { userId: user?.id, goalCategory: g.category, metadata: { goalTitle: g.title } });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function getBrandsForCategory(category: string) {
    return activeBrands.filter((b) => b.categories.includes(category));
  }

  function handleSelectOption(goalId: string, optionId: string) {
    const goal = result.goals.find((g) => g.id === goalId);
    trackEvent("option_selected", {
      userId: user?.id,
      goalCategory: goal?.category,
      metadata: { goalId, optionId },
    });
    setResult((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, selectedOptionId: optionId } : g
      ),
    }));
  }

  function handleEditGoal(goalId: string, field: string, value: string) {
    setResult((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, [field]: value } : g
      ),
    }));
  }

  function handleEditAdvice(index: number, value: string) {
    setResult((prev) => ({
      ...prev,
      advice: prev.advice.map((a, i) => (i === index ? value : a)),
    }));
    setEditingAdvice(null);
  }

  async function handleShare() {
    trackEvent("plan_shared", { userId: user?.id });
    const r = await sharePlan(result, age);
    if (r === "copied") {
      setShareMsg("Copied to clipboard!");
      setTimeout(() => setShareMsg(""), 2000);
    }
  }

  function handleExport() {
    trackEvent("plan_exported", { userId: user?.id });
    exportPlanAsJSON(result, age);
  }

  function handleCalendar() {
    trackEvent("calendar_synced", { userId: user?.id });
    downloadICS(result.goals, age);
  }

  const selectedTotal = result.goals.reduce((sum, g) => {
    if (g.selectedOptionId) {
      const opt = g.options.find((o) => o.id === g.selectedOptionId);
      return sum + (opt?.estimatedPrice ?? g.inflationAdjustedCost);
    }
    return sum + g.inflationAdjustedCost;
  }, 0);

  return (
    <div className="min-h-full flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Your Life Plan</h1>
            <p className="text-muted mt-1">
              Age {age} · {result.goals.length} goals · {result.timelineYears} years
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm font-medium text-muted bg-card-bg rounded-full hover:bg-zinc-200 transition-colors"
            >
              Start over
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 text-sm font-medium text-foreground bg-card-bg rounded-full hover:bg-zinc-200 transition-colors"
            >
              {shareMsg || "Share"}
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-foreground bg-card-bg rounded-full hover:bg-zinc-200 transition-colors"
            >
              Export
            </button>
            <button
              onClick={handleCalendar}
              className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-full hover:bg-accent/90 transition-colors"
            >
              Sync to calendar
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-10">
          <Timeline goals={result.goals} userAge={age} />
        </div>

        {/* Goal Cards */}
        <div className="space-y-6 mb-10">
          {result.goals.map((goal) => {
            const brands = getBrandsForCategory(goal.category);
            return (
              <div key={goal.id} className="space-y-3">
                <GoalCard
                  goal={goal}
                  onSelectOption={handleSelectOption}
                  onEditGoal={handleEditGoal}
                />
                {brands.length > 0 && (
                  <div className="space-y-2 pl-4 border-l-2 border-accent/10">
                    {brands.map((b) => (
                      <BrandCard key={b.id} brand={b} goalCategory={goal.category} userId={user?.id ?? null} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cost Summary */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-6">Cost summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card-bg rounded-xl p-5">
              <p className="text-xs text-muted mb-1">Base total</p>
              <p className="text-2xl font-bold text-foreground">
                {result.currency} {result.totalCost.toLocaleString()}
              </p>
            </div>
            <div className="bg-accent-light rounded-xl p-5">
              <p className="text-xs text-accent/70 mb-1">Inflation adjusted</p>
              <p className="text-2xl font-bold text-accent">
                {result.currency} {result.totalInflationAdjusted.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-5">
              <p className="text-xs text-green-600 mb-1">Your selections</p>
              <p className="text-2xl font-bold text-green-700">
                {result.currency} {selectedTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* AI Advice — editable */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Advice</h2>
            <p className="text-xs text-muted">Click any item to edit</p>
          </div>
          <ul className="space-y-4">
            {result.advice.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent-light text-accent text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {editingAdvice === i ? (
                  <textarea
                    defaultValue={tip}
                    autoFocus
                    rows={2}
                    onBlur={(e) => handleEditAdvice(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleEditAdvice(i, e.currentTarget.value);
                      }
                    }}
                    className="flex-1 text-sm text-foreground bg-card-bg rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                  />
                ) : (
                  <p
                    onClick={() => setEditingAdvice(i)}
                    className="flex-1 text-sm text-muted leading-relaxed cursor-pointer hover:text-foreground transition-colors"
                  >
                    {tip}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleShare}
            className="px-8 py-4 text-base font-medium text-foreground bg-card-bg rounded-full hover:bg-zinc-200 transition-colors"
          >
            Share plan
          </button>
          <button
            onClick={handleCalendar}
            className="px-8 py-4 text-base font-medium text-white bg-accent rounded-full hover:bg-accent/90 transition-colors"
          >
            Sync milestones to calendar
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted text-lg">Analyzing your goals...</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
