"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { KanbanBoard } from "@/components/kanban-board";
import { StorageIndicator } from "@/components/storage-indicator";
import { useTasks } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import Loader from "@/components/loader";
import RetryComponent from "@/components/retry";

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
    return <Loader />;
  }

  if (error) {
    return <RetryComponent error={error} />;
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
      <StorageIndicator />
    </div>
  );
}
