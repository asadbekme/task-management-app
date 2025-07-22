"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { ListView } from "@/components/list-view";
import { StorageIndicator } from "@/components/storage-indicator";
import { useTasks } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import Loader from "@/components/loader";
import RetryComponent from "@/components/retry";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    tasks,
    loading,
    error,
    createTask,
    editTask,
    removeTask,
    getActiveTasks,
    getCompletedTasks,
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
    return <RetryComponent error={error.message} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <ListView
          activeTasks={getActiveTasks()}
          completedTasks={getCompletedTasks()}
          onCreateTask={createTask}
          onUpdateTask={editTask}
          onDeleteTask={removeTask}
        />
      </main>
      <StorageIndicator />
    </div>
  );
}
