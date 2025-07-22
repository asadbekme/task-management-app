"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Task } from "@/types";
import { TaskCard } from "./task-card";
import { Button } from "./ui/button";
import TaskModal from "./task-modal";
import { EmptyStateCard } from "./empty-state-card";

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
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<"active" | "completed">("active");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const showActive = view === "active";
  const showCompleted = view === "completed";

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
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
    setShowModal(false);
  };

  const handleCancelForm = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-5 md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {showActive ? "Active Tasks" : "Completed Tasks"}
        </h1>
        <div className="flex items-center flex-wrap gap-2">
          <Button
            variant={showActive ? "default" : "outline"}
            aria-label="Active Tasks"
            onClick={() => setView("active")}
          >
            Active Tasks
          </Button>
          <Button
            variant={showCompleted ? "default" : "outline"}
            aria-label="Completed Tasks"
            onClick={() => setView("completed")}
          >
            Completed Tasks
          </Button>
          {isAdmin && (
            <Button onClick={() => setShowModal(true)} aria-label="Add Task">
              <Plus size={16} />
              Add Task
            </Button>
          )}
        </div>
      </div>

      {showModal && (
        <TaskModal
          isOpen={showModal}
          initialTask={editingTask || undefined}
          onSubmit={handleUpdateTask}
          onCancel={handleCancelForm}
        />
      )}

      {showActive && (
        <div>
          {activeTasks.length === 0 ? (
            <EmptyStateCard message="No active tasks. Create one to get started!" />
          ) : (
            <>
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </>
          )}
        </div>
      )}

      {showCompleted && (
        <div>
          {completedTasks.length === 0 ? (
            <EmptyStateCard message="No completed tasks yet." />
          ) : (
            <>
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
