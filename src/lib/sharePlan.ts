import type { AnalysisResult } from "./types";

export function generateShareText(result: AnalysisResult, userAge: number): string {
  const lines = [
    `🎯 My RUBBA Life Plan (Age ${userAge})`,
    "",
    "Goals:",
    ...result.goals.map(
      (g) =>
        `• ${g.title} (age ${g.startAge}–${g.endAge}) — ${g.currency} ${g.inflationAdjustedCost.toLocaleString()}`
    ),
    "",
    `Total estimated cost: ${result.currency} ${result.totalInflationAdjusted.toLocaleString()} (inflation adjusted)`,
    "",
    "Built with RUBBA — Plan your life, your way.",
  ];
  return lines.join("\n");
}

export async function sharePlan(result: AnalysisResult, userAge: number) {
  const text = generateShareText(result, userAge);

  if (navigator.share) {
    try {
      await navigator.share({ title: "My RUBBA Life Plan", text });
      return;
    } catch {
      // user cancelled or not supported
    }
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}

export function exportPlanAsJSON(result: AnalysisResult, userAge: number) {
  const data = { userAge, ...result };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rubba-life-plan.json";
  a.click();
  URL.revokeObjectURL(url);
}
