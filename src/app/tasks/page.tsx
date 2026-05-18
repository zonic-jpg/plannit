"use client";

import { useState } from "react";
import Image from "next/image";
import { getTasks, addTask, updateTask, deleteTask, getGoals } from "@/lib/store";
import { useStoreData } from "@/lib/useStore";
import type { Task } from "@/lib/types";
import { PRIORITY_COLORS, STATUS_COLORS } from "@/lib/types";
import TaskForm from "@/components/TaskForm";

export default function TasksPage() {
  const [data, refresh] = useStoreData(() => ({ tasks: getTasks(), goals: getGoals() }));
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "todo" | "in_progress" | "done">("all");

  const { tasks, goals } = data;
  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const goalMap = Object.fromEntries(goals.map((g) => [g.id, g.title]));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden h-40 mb-8">
        <Image src="/images/productivity.jpg" alt="Productive planning" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-indigo-600/40 flex items-center justify-between px-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Tasks</h1>
            <p className="text-indigo-100 mt-1">Manage your daily tasks</p>
          </div>
          <button
            onClick={() => { setEditingTask(null); setShowForm(true); }}
            className="px-4 py-2 text-sm font-medium text-indigo-700 bg-white rounded-lg hover:bg-indigo-50 transition-colors"
          >
            + New Task
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "todo", "in_progress", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f === "todo" ? "To Do" : "Done"}
          </button>
        ))}
      </div>

      {(showForm || editingTask) && (
        <div className="mb-6">
          <TaskForm
            goals={goals}
            initial={editingTask ?? undefined}
            onSubmit={(data) => {
              if (editingTask) {
                updateTask(editingTask.id, data);
              } else {
                addTask(data);
              }
              setShowForm(false);
              setEditingTask(null);
              refresh();
            }}
            onCancel={() => { setShowForm(false); setEditingTask(null); }}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400 text-lg">
            {filter === "all" ? "No tasks yet. Create your first task!" : `No ${filter.replace("_", " ")} tasks.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <div key={task.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  onClick={() => {
                    const nextStatus = task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "done" : "todo";
                    updateTask(task.id, { status: nextStatus });
                    refresh();
                  }}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    task.status === "done"
                      ? "bg-green-500 border-green-500 text-white"
                      : task.status === "in_progress"
                      ? "bg-purple-500 border-purple-500 text-white"
                      : "border-zinc-300 hover:border-indigo-400"
                  }`}
                >
                  {task.status === "done" && "✓"}
                  {task.status === "in_progress" && "›"}
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-sm font-medium truncate ${task.status === "done" ? "line-through text-zinc-400" : "text-zinc-900"}`}>
                      {task.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[task.status]}`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-zinc-500 mb-1">{task.description}</p>
                  )}
                  <div className="flex gap-4 text-xs text-zinc-400">
                    {task.goalId && goalMap[task.goalId] && <span>Goal: {goalMap[task.goalId]}</span>}
                    {task.dueDate && <span>Due: {task.dueDate}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => { setEditingTask(task); setShowForm(false); }}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => { deleteTask(task.id); refresh(); }}
                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
