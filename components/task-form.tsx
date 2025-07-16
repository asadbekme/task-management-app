"use client";

import type React from "react";
import { useState } from "react";
import type { Task, TaskType, TaskStatus, SubTask } from "@/types";
import { X, Plus } from "lucide-react";
import { generateId } from "@/lib/api";
import { Button } from "./ui/button";

export interface TaskFormProps {
  initialTask?: Partial<Task>;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export const TaskForm = ({
  initialTask,
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || ""
  );
  const [type, setType] = useState<TaskType>(initialTask?.type || "task");
  const [status, setStatus] = useState<TaskStatus>(
    initialTask?.status || "backlog"
  );
  const [assignee, setAssignee] = useState(initialTask?.assignee || "");
  const [subtasks, setSubtasks] = useState<SubTask[]>(
    initialTask?.subtasks || []
  );
  const [newSubtask, setNewSubtask] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      title,
      description,
      type,
      status,
      assignee,
      subtasks,
    });
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;

    const newSubtaskItem: SubTask = {
      id: generateId(),
      title: newSubtask,
      completed: false,
    };

    setSubtasks([...subtasks, newSubtaskItem]);
    setNewSubtask("");
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title*
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.title ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as TaskType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="task">Task</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="backlog">Backlog</option>
            <option value="inprogress">In Progress</option>
            <option value="ready-to-check">Ready to Check</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="assignee"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Assignee
        </label>
        <input
          id="assignee"
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter assignee name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtasks
        </label>

        <div className="space-y-2 mb-3">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center">
              <span className="flex-grow">{subtask.title}</span>
              <button
                type="button"
                onClick={() => removeSubtask(subtask.id)}
                className="ml-2 text-gray-400 hover:text-red-500"
                aria-label="Remove subtask"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a subtask"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSubtask();
              }
            }}
          />
          <button
            type="button"
            onClick={addSubtask}
            className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-200"
            aria-label="Add subtask"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button onClick={onCancel} aria-label="Cancel" variant="secondary">
          Cancel
        </Button>

        <Button type="submit" aria-label="Save Task">
          {initialTask?.id ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};
