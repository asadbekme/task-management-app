"use client";

import type { Task, TaskStatus } from "@/types";
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  generateId,
} from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading: loading,
    error,
  } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: async (
      taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
    ) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      const updatedTasks = await addTask(tasks, newTask);
      return updatedTasks;
    },
    onSuccess: (updatedTasks) => {
      // queryClient.setQueryData(["tasks"], updatedTasks);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully");
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      taskId,
      taskData,
    }: {
      taskId: string;
      taskData: Partial<Task>;
    }) => {
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (!taskToUpdate) throw new Error("Task not found");

      const updatedTask: Task = {
        ...taskToUpdate,
        ...taskData,
        updatedAt: new Date().toISOString(),
      };
      const updatedTasks = await updateTask(tasks, updatedTask);
      return updatedTasks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully");
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const updatedTasks = await deleteTask(tasks, taskId);
      return updatedTasks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  // API methods
  const createTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    return addMutation.mutateAsync(taskData);
  };

  const editTask = async (taskId: string, taskData: Partial<Task>) => {
    return updateMutation.mutateAsync({ taskId, taskData });
  };

  const removeTask = async (taskId: string) => {
    return deleteMutation.mutateAsync(taskId);
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    return editTask(taskId, { status: newStatus });
  };

  // Memoized helpers
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

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
