"use client";

import { useState } from "react";
import { getGoals, addGoal, updateGoal, deleteGoal } from "@/lib/store";
import { useStoreData } from "@/lib/useStore";
import type { Goal } from "@/lib/types";
import { PRIORITY_COLORS } from "@/lib/types";
import GoalForm from "@/components/GoalForm";

export default function GoalsPage() {
  const [goals, refresh] = useStoreData(getGoals);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Goals</h1>
          <p className="text-zinc-500 mt-1">Track your life goals</p>
        </div>
        <button
          onClick={() => { setEditingGoal(null); setShowForm(true); }}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New Goal
        </button>
      </div>

      {(showForm || editingGoal) && (
        <div className="mb-6">
          <GoalForm
            initial={editingGoal ?? undefined}
            onSubmit={(data) => {
              if (editingGoal) {
                updateGoal(editingGoal.id, data);
              } else {
                addGoal(data);
              }
              setShowForm(false);
              setEditingGoal(null);
              refresh();
            }}
            onCancel={() => { setShowForm(false); setEditingGoal(null); }}
          />
        </div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400 text-lg">No goals yet. Create your first goal!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-zinc-900 truncate">{goal.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[goal.priority]}`}>
                    {goal.priority}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    goal.status === "active" ? "bg-indigo-100 text-indigo-800" :
                    goal.status === "completed" ? "bg-green-100 text-green-800" :
                    "bg-zinc-100 text-zinc-600"
                  }`}>
                    {goal.status}
                  </span>
                </div>
                {goal.description && (
                  <p className="text-sm text-zinc-500 mb-1">{goal.description}</p>
                )}
                <div className="flex gap-4 text-xs text-zinc-400">
                  <span>{goal.category}</span>
                  {goal.targetDate && <span>Target: {goal.targetDate}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => { setEditingGoal(goal); setShowForm(false); }}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => { deleteGoal(goal.id); refresh(); }}
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
