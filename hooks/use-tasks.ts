"use client";

import { useState, useEffect } from "react";
import type { Task, TaskStatus } from "@/types";
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  generateId,
} from "@/lib/api";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const loadedTasks = await fetchTasks();
        setTasks(loadedTasks);
        setError(null);
      } catch (err) {
        console.error("Error loading tasks:", err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Create a new task
  const createTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };

      const updatedTasks = await addTask(tasks, newTask);
      setTasks(updatedTasks);
      return newTask;
    } catch (err) {
      setError("Failed to create task");
      console.error(err);
      throw err;
    }
  };

  // Update an existing task
  const editTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId);

      if (!taskToUpdate) {
        throw new Error("Task not found");
      }

      const updatedTask: Task = {
        ...taskToUpdate,
        ...taskData,
        updatedAt: new Date().toISOString(),
      };

      const updatedTasks = await updateTask(tasks, updatedTask);
      setTasks(updatedTasks);
      return updatedTask;
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
      throw err;
    }
  };

  // Remove a task
  const removeTask = async (taskId: string) => {
    try {
      const updatedTasks = await deleteTask(tasks, taskId);
      setTasks(updatedTasks);
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
      throw err;
    }
  };

  // Update task status (for drag and drop)
  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    return editTask(taskId, { status: newStatus });
  };

  // Get tasks by status (for Kanban view)
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  // Get active and completed tasks (for List view)
  const getActiveTasks = () => {
    return tasks.filter((task) => task.status !== "done");
  };

  const getCompletedTasks = () => {
    return tasks.filter((task) => task.status === "done");
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    editTask,
    removeTask,
    updateTaskStatus,
    getTasksByStatus,
    getActiveTasks,
    getCompletedTasks,
  };
};
