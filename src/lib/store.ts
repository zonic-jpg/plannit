"use client";

import { v4 as uuidv4 } from "uuid";
import type { Goal, Task, ScheduleEntry } from "./types";

const GOALS_KEY = "plannit_goals";
const TASKS_KEY = "plannit_tasks";
const SCHEDULE_KEY = "plannit_schedule";

function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getGoals(): Goal[] {
  return load<Goal>(GOALS_KEY);
}

export function addGoal(
  goal: Omit<Goal, "id" | "createdAt" | "updatedAt">
): Goal {
  const goals = getGoals();
  const now = new Date().toISOString();
  const newGoal: Goal = { ...goal, id: uuidv4(), createdAt: now, updatedAt: now };
  goals.push(newGoal);
  save(GOALS_KEY, goals);
  return newGoal;
}

export function updateGoal(id: string, updates: Partial<Goal>): Goal | null {
  const goals = getGoals();
  const idx = goals.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  goals[idx] = { ...goals[idx], ...updates, updatedAt: new Date().toISOString() };
  save(GOALS_KEY, goals);
  return goals[idx];
}

export function deleteGoal(id: string) {
  save(GOALS_KEY, getGoals().filter((g) => g.id !== id));
}

export function getTasks(): Task[] {
  return load<Task>(TASKS_KEY);
}

export function addTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt">
): Task {
  const tasks = getTasks();
  const now = new Date().toISOString();
  const newTask: Task = { ...task, id: uuidv4(), createdAt: now, updatedAt: now };
  tasks.push(newTask);
  save(TASKS_KEY, tasks);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = getTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() };
  save(TASKS_KEY, tasks);
  return tasks[idx];
}

export function deleteTask(id: string) {
  save(TASKS_KEY, getTasks().filter((t) => t.id !== id));
}

export function getScheduleEntries(): ScheduleEntry[] {
  return load<ScheduleEntry>(SCHEDULE_KEY);
}

export function addScheduleEntry(
  entry: Omit<ScheduleEntry, "id" | "createdAt">
): ScheduleEntry {
  const entries = getScheduleEntries();
  const newEntry: ScheduleEntry = {
    ...entry,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  entries.push(newEntry);
  save(SCHEDULE_KEY, entries);
  return newEntry;
}

export function deleteScheduleEntry(id: string) {
  save(SCHEDULE_KEY, getScheduleEntries().filter((e) => e.id !== id));
}
