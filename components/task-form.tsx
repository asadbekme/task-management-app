"use client";

import type React from "react";
import { useState } from "react";
import type { Task, TaskType, TaskStatus, SubTask } from "@/types";
import { X, Plus } from "lucide-react";
import { generateId } from "@/lib/api";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

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
        <Label htmlFor="title" className="mb-1">
          Title*
        </Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title && "border-red-500"}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="description" className="mb-1">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        ></Textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="type" className="mb-1">
            Type
          </Label>
          <Select
            value={type}
            onValueChange={(task: TaskType) => setType(task)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="impovement">Improvement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status" className="mb-1">
            Status
          </Label>
          <Select
            value={status}
            onValueChange={(status: TaskStatus) => setStatus(status)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="inprogress">In Progress</SelectItem>
              <SelectItem value="ready-to-check">Ready to Check</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="assignee" className="mb-1">
          Assignee
        </Label>
        <Input
          id="assignee"
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Enter assignee name"
        />
      </div>

      <div className="mb-4">
        <Label className="mb-1">Subtasks</Label>

        <div className={cn("space-y-2", subtasks.length > 0 && "my-2")}>
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-2">
              <span className="flex-grow">{subtask.title}</span>
              <button
                type="button"
                onClick={() => removeSubtask(subtask.id)}
                className="text-gray-400 hover:text-red-500"
                aria-label="Remove subtask"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <Input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Add a subtask"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSubtask();
              }
            }}
          />
          <Button
            type="button"
            onClick={addSubtask}
            aria-label="Add a subtask"
            size="sm"
            variant="secondary"
          >
            <Plus size={16} />
          </Button>
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
