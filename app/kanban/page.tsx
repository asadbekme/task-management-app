"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { KanbanBoard } from "@/components/kanban-board";
import { useTasks } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";

export default function KanbanPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    tasks,
    loading,
    error,
    createTask,
    editTask,
    removeTask,
    updateTaskStatus,
  } = useTasks();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <p className="text-amber-600 mb-4">{error}</p>
            <p className="mb-4">
              You can still use the app with local data, or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <KanbanBoard
          tasks={tasks}
          onCreateTask={createTask}
          onUpdateTask={editTask}
          onDeleteTask={removeTask}
          onUpdateTaskStatus={updateTaskStatus}
        />
      </main>
    </div>
  );
}
