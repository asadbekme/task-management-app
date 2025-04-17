"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { Task, TaskStatus } from "@/types";
import { TaskCard } from "./task-card";
import { TaskForm } from "./task-form";
import { Plus } from "lucide-react";
import html2canvas from "html2canvas";
import { useAuth } from "@/hooks/use-auth";

interface KanbanBoardProps {
  tasks: Task[];
  onCreateTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateTask: (taskId: string, taskData: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

export const KanbanBoard = ({
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateTaskStatus,
}: KanbanBoardProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formStatus, setFormStatus] = useState<TaskStatus>("backlog");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const columns: { id: TaskStatus; title: string }[] = [
    { id: "backlog", title: "Backlog" },
    { id: "inprogress", title: "In Progress" },
    { id: "ready-to-check", title: "Ready to Check" },
    { id: "done", title: "Done" },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back in the same place
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Update the task status
    onUpdateTaskStatus(draggableId, destination.droppableId as TaskStatus);
  };

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
      onCreateTask({
        ...taskData,
        status: formStatus,
      });
    }
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleAddTask = (status: TaskStatus) => {
    setFormStatus(status);
    setShowForm(true);
  };

  const exportAsImage = async () => {
    const element = document.getElementById("kanban-board");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "kanban-board.png";
      link.click();
    } catch (error) {
      console.error("Error exporting board:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kanban Board</h1>
        <button
          onClick={exportAsImage}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Export as Image
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <TaskForm
            initialTask={editingTask || { status: formStatus }}
            onSubmit={handleUpdateTask}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          id="kanban-board"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {columns.map((column) => (
            <div key={column.id} className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-700">{column.title}</h2>
                <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleAddTask(column.id)}
                  className="w-full py-2 mb-3 bg-white border border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 flex items-center justify-center"
                >
                  <Plus size={16} className="mr-1" />
                  Add Task
                </button>
              )}

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onEdit={handleEditTask}
                              onDelete={onDeleteTask}
                              isDraggable={true}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
