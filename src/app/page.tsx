"use client";

import Image from "next/image";
import Link from "next/link";
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

  const isEmpty = goals.length === 0 && tasks.length === 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {isEmpty ? (
        <div className="mb-10">
          <div className="relative rounded-2xl overflow-hidden h-72 mb-6">
            <Image
              src="/images/woman-planning.jpg"
              alt="Woman planning her goals"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-transparent flex items-center">
              <div className="px-10">
                <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                  Plan your best life
                </h1>
                <p className="text-indigo-100 text-lg max-w-md mb-6">
                  Set meaningful goals, break them into tasks, and schedule your
                  days with intention.
                </p>
                <Link
                  href="/goals"
                  className="inline-block px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Create your first goal
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative rounded-xl overflow-hidden h-48 group">
              <Image
                src="/images/goals-motivation.jpg"
                alt="Setting goals and achieving dreams"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Link href="/goals" className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent hover:from-black/70 transition-colors flex items-end p-5">
                <div>
                  <h3 className="text-white font-bold text-lg">Set Goals</h3>
                  <p className="text-white/80 text-sm">Define what matters most to you</p>
                </div>
              </Link>
            </div>
            <div className="relative rounded-xl overflow-hidden h-48 group">
              <Image
                src="/images/productivity.jpg"
                alt="Staying productive and focused"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Link href="/tasks" className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent hover:from-black/70 transition-colors flex items-end p-5">
                <div>
                  <h3 className="text-white font-bold text-lg">Track Tasks</h3>
                  <p className="text-white/80 text-sm">Break goals into daily actions</p>
                </div>
              </Link>
            </div>
            <div className="relative rounded-xl overflow-hidden h-48 group">
              <Image
                src="/images/schedule-focus.jpg"
                alt="Planning your schedule"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Link href="/schedule" className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent hover:from-black/70 transition-colors flex items-end p-5">
                <div>
                  <h3 className="text-white font-bold text-lg">Own Your Day</h3>
                  <p className="text-white/80 text-sm">Schedule time blocks that work</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="relative rounded-2xl overflow-hidden h-44 mb-6">
            <Image
              src="/images/woman-planning.jpg"
              alt="Woman planning her goals"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-transparent flex items-center">
              <div className="px-10">
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Dashboard</h1>
                <p className="text-indigo-100 mt-1">Your life at a glance</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
