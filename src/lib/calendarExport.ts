import type { LifeGoal } from "./types";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toICSDate(date: Date): string {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T090000`;
}

export function generateICS(goals: LifeGoal[], userAge: number): string {
  const now = new Date();
  const currentYear = now.getFullYear();

  const events = goals.map((goal) => {
    const yearsUntilStart = goal.startAge - userAge;
    const yearsUntilEnd = goal.endAge - userAge;

    const startDate = new Date(currentYear + yearsUntilStart, 0, 1);
    const endDate = new Date(currentYear + yearsUntilEnd, 0, 1);

    const reminderDate = new Date(startDate);
    reminderDate.setMonth(reminderDate.getMonth() - 6);

    return [
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${toICSDate(startDate)}`,
      `DTEND;VALUE=DATE:${toICSDate(endDate)}`,
      `SUMMARY:🎯 ${goal.title}`,
      `DESCRIPTION:${goal.description}\\nEstimated cost: ${goal.currency} ${goal.inflationAdjustedCost.toLocaleString()}\\nAge ${goal.startAge}–${goal.endAge}`,
      "BEGIN:VALARM",
      "TRIGGER:-P180D",
      "ACTION:DISPLAY",
      `DESCRIPTION:Milestone ahead: ${goal.title} starts in 6 months`,
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-P30D",
      "ACTION:DISPLAY",
      `DESCRIPTION:Milestone ahead: ${goal.title} starts in 1 month`,
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RUBBA//Life Plan//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(goals: LifeGoal[], userAge: number) {
  const ics = generateICS(goals, userAge);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rubba-life-plan.ics";
  a.click();
  URL.revokeObjectURL(url);
}
