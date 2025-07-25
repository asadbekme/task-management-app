import type { Task } from "@/types";
import axios from "axios";

// Environment variables
const API_KEY = process.env.NEXT_PUBLIC_JSONSTORAGE_API_KEY || "";
const USE_API = process.env.NEXT_PUBLIC_USE_API === "true";
const API_URL =
  "https://api.jsonstorage.net/v1/json/5eb3433d-d822-4943-ba3f-8f87832cb533/97ba58e0-6bf9-40c3-87d8-32169110d74e";

// Unique ID generator
export const generateId = (): string =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

// Fetch tasks from JSONStorage API
export const fetchTasks = async (): Promise<Task[]> => {
  if (!USE_API || !API_KEY) {
    throw new Error("API is disabled or missing API key");
  }

  const response = await axios.get(API_URL, {
    headers: { Accept: "application/json" },
  });

  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }
  return data.tasks || [];
};

// Save tasks to JSONStorage API
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  if (!USE_API || !API_KEY) return;

  const cleanedTasks = tasks.filter((task) => {
    if (task.status !== "done") return true;
    const updated = new Date(task.updatedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return updated > thirtyDaysAgo;
  });

  const response = await axios.put(
    `${API_URL}?apiKey=${API_KEY}`,
    cleanedTasks,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (response.status !== 200) {
    throw new Error(`Failed to save tasks: ${response.status}`);
  }
};

// Add a new task
export const addTask = async (
  tasks: Task[],
  newTask: Task
): Promise<Task[]> => {
  const updated = [...tasks, newTask];
  await saveTasks(updated);
  return updated;
};

// Update a task
export const updateTask = async (
  tasks: Task[],
  updatedTask: Task
): Promise<Task[]> => {
  const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
  await saveTasks(updated);
  return updated;
};

// Delete a task
export const deleteTask = async (
  tasks: Task[],
  taskId: string
): Promise<Task[]> => {
  const updated = tasks.filter((t) => t.id !== taskId);
  await saveTasks(updated);
  return updated;
};
