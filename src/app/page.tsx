"use client";

import { getGoals, getTasks, getScheduleEntries } from "@/lib/store";
import { useStoreData } from "@/lib/useStore";
import { PRIORITY_COLORS, STATUS_COLORS } from "@/lib/types";

export default function Dashboard() {
  const [goals] = useStoreData(getGoals);
  const [tasks] = useStoreData(getTasks);
  const [schedule] = useStoreData(getScheduleEntries);

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");
  const pendingTasks = tasks.filter((t) => t.status !== "done");
  const doneTasks = tasks.filter((t) => t.status === "done");
  const today = new Date().toISOString().split("T")[0];
  const todaySchedule = schedule.filter((s) => s.date === today);

  const stats = [
    { label: "Active Goals", value: activeGoals.length, color: "bg-indigo-500" },
    { label: "Completed Goals", value: completedGoals.length, color: "bg-green-500" },
    { label: "Pending Tasks", value: pendingTasks.length, color: "bg-amber-500" },
    { label: "Done Tasks", value: doneTasks.length, color: "bg-emerald-500" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Your life at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
            <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center text-white text-lg font-bold mb-3`}>
              {s.value}
            </div>
            <p className="text-sm font-medium text-zinc-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Active Goals</h2>
          {activeGoals.length === 0 ? (
            <p className="text-zinc-400 text-sm">No active goals. Create one to get started!</p>
          ) : (
            <ul className="space-y-3">
              {activeGoals.slice(0, 5).map((g) => (
                <li key={g.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{g.title}</p>
                    <p className="text-xs text-zinc-500">{g.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[g.priority]}`}>
                    {g.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Pending Tasks</h2>
          {pendingTasks.length === 0 ? (
            <p className="text-zinc-400 text-sm">No pending tasks. Nice work!</p>
          ) : (
            <ul className="space-y-3">
              {pendingTasks.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{t.title}</p>
                    <p className="text-xs text-zinc-500">{t.dueDate || "No due date"}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[t.status]}`}>
                    {t.status.replace("_", " ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Today&apos;s Schedule</h2>
          {todaySchedule.length === 0 ? (
            <p className="text-zinc-400 text-sm">Nothing scheduled for today.</p>
          ) : (
            <ul className="space-y-3">
              {todaySchedule
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((s) => (
                  <li key={s.id} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-50">
                    <div className="text-sm font-mono text-indigo-600 font-medium whitespace-nowrap">
                      {s.startTime} - {s.endTime}
                    </div>
                    <p className="text-sm font-medium text-zinc-900">{s.title}</p>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
