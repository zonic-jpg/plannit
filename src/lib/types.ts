export type Priority = "low" | "medium" | "high";
export type GoalStatus = "active" | "completed" | "archived";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: GoalStatus;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  goalId: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleEntry {
  id: string;
  taskId: string | null;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export const CATEGORIES = [
  "Health & Fitness",
  "Career & Work",
  "Finance",
  "Education",
  "Relationships",
  "Personal Growth",
  "Hobbies",
  "Other",
] as const;

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-purple-100 text-purple-800",
  done: "bg-green-100 text-green-800",
};
