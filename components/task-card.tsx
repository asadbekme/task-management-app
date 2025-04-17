"use client";

import { useState } from "react";
import type { Task } from "@/types";
import {
  CheckCircle,
  Circle,
  Edit,
  Trash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task["status"]) => void;
  isDraggable?: boolean;
}

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isDraggable = false,
}: TaskCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const getTypeColor = (type: Task["type"]) => {
    switch (type) {
      case "bug":
        return "bg-red-100 text-red-800";
      case "feature":
        return "bg-blue-100 text-blue-800";
      case "improvement":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "backlog":
        return "bg-gray-100 text-gray-800";
      case "inprogress":
        return "bg-yellow-100 text-yellow-800";
      case "ready-to-check":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    onEdit({
      ...task,
      subtasks: updatedSubtasks,
    });
  };

  const completedSubtasks = task.subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow p-4 mb-3",
        isDraggable && "cursor-grab active:cursor-grabbing"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{task.title}</h3>
          <div className="flex space-x-2 mt-1">
            <span
              className={`text-xs px-2 py-1 rounded-full ${getTypeColor(
                task.type
              )}`}
            >
              {task.type}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
          </div>
        </div>
        {isAdmin && (
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-500 hover:text-blue-600"
              aria-label="Edit task"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-500 hover:text-red-600"
              aria-label="Delete task"
            >
              <Trash size={16} />
            </button>
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mt-2 mb-3">{task.description}</p>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
        <span>Assignee: {task.assignee || "Unassigned"}</span>
        {totalSubtasks > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-gray-500 hover:text-gray-700"
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse subtasks" : "Expand subtasks"}
          >
            <span className="mr-1">
              {completedSubtasks}/{totalSubtasks}
            </span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {expanded && task.subtasks.length > 0 && (
        <div className="mt-3 border-t pt-2">
          <ul>
            {task.subtasks.map((subtask) => (
              <li key={subtask.id} className="flex items-center py-1">
                <button
                  onClick={() => toggleSubtask(subtask.id)}
                  className="mr-2 text-gray-400 hover:text-green-500"
                  aria-label={
                    subtask.completed
                      ? "Mark as incomplete"
                      : "Mark as complete"
                  }
                >
                  {subtask.completed ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <Circle size={16} />
                  )}
                </button>
                <span
                  className={
                    subtask.completed ? "line-through text-gray-400" : ""
                  }
                >
                  {subtask.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
