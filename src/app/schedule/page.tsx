"use client";

import { useState } from "react";
import {
  getScheduleEntries,
  addScheduleEntry,
  deleteScheduleEntry,
  getTasks,
} from "@/lib/store";
import { useStoreData } from "@/lib/useStore";

export default function SchedulePage() {
  const [data, refresh] = useStoreData(() => ({
    entries: getScheduleEntries(),
    tasks: getTasks(),
  }));
  const { entries, tasks } = data;

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const dayEntries = entries
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const pendingTasks = tasks.filter((t) => t.status !== "done");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() && !taskId) return;
    const selectedTask = taskId ? tasks.find((t) => t.id === taskId) : null;
    addScheduleEntry({
      taskId,
      title: title.trim() || selectedTask?.title || "",
      date: selectedDate,
      startTime,
      endTime,
    });
    setTitle("");
    setTaskId(null);
    setStartTime("09:00");
    setEndTime("10:00");
    setShowForm(false);
    refresh();
  }

  const hours = Array.from({ length: 16 }, (_, i) => i + 6);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Schedule</h1>
          <p className="text-zinc-500 mt-1">Plan your day</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add Entry
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What's planned?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Or link a task</label>
              <select
                value={taskId ?? ""}
                onChange={(e) => {
                  setTaskId(e.target.value || null);
                  if (e.target.value) {
                    const t = tasks.find((x) => x.id === e.target.value);
                    if (t) setTitle(t.title);
                  }
                }}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">None</option>
                {pendingTasks.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              Add
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        {hours.map((hour) => {
          const hourEntries = dayEntries.filter((e) => {
            const eHour = parseInt(e.startTime.split(":")[0], 10);
            return eHour === hour;
          });

          return (
            <div key={hour} className="flex border-b border-zinc-100 last:border-b-0">
              <div className="w-20 py-3 px-4 text-xs font-mono text-zinc-400 border-r border-zinc-100 shrink-0">
                {`${hour.toString().padStart(2, "0")}:00`}
              </div>
              <div className="flex-1 py-2 px-4 min-h-[48px]">
                {hourEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between bg-indigo-50 rounded-lg px-3 py-2 mb-1 last:mb-0">
                    <div>
                      <span className="text-sm font-medium text-indigo-900">{entry.title}</span>
                      <span className="text-xs text-indigo-500 ml-2">
                        {entry.startTime} - {entry.endTime}
                      </span>
                    </div>
                    <button
                      onClick={() => { deleteScheduleEntry(entry.id); refresh(); }}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
