"use client";

import { useState } from "react";
import type { Task } from "@/types";
import { TaskCard } from "./task-card";
import { TaskForm } from "./task-form";
import { Plus, CheckCircle, Circle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface ListViewProps {
  activeTasks: Task[];
  completedTasks: Task[];
  onCreateTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateTask: (taskId: string, taskData: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const ListView = ({
  activeTasks,
  completedTasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}: ListViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleUpdateTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      onCreateTask(taskData);
    }
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task List</h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Task
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <TaskForm
            initialTask={editingTask || undefined}
            onSubmit={handleUpdateTask}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Active Tasks ({activeTasks.length})
        </h2>
        {activeTasks.length === 0 ? (
          <p className="text-gray-500">
            No active tasks. Create one to get started!
          </p>
        ) : (
          <div>
            {activeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center mb-4">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center text-gray-700 hover:text-gray-900"
            aria-expanded={showCompleted}
          >
            <h2 className="text-xl font-semibold mr-2">
              Completed Tasks ({completedTasks.length})
            </h2>
            {showCompleted ? (
              <CheckCircle size={20} className="text-green-500" />
            ) : (
              <Circle size={20} />
            )}
          </button>
        </div>

        {showCompleted && completedTasks.length > 0 && (
          <div>
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
