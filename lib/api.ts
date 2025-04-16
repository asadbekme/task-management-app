import type { Task } from "@/types";

// JSON Storage API key - we'll use a more robust approach
const API_KEY = process.env.NEXT_PUBLIC_JSONSTORAGE_API_KEY || "default-key";
const API_URL = "https://api.jsonstorage.net/v1/json";

// Helper to generate a unique ID
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Sample initial tasks for new users
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Create project plan",
    description: "Outline the project scope and timeline",
    type: "task",
    status: "backlog",
    assignee: "User",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: "subtask-1", title: "Define objectives", completed: true },
      { id: "subtask-2", title: "Identify stakeholders", completed: false },
    ],
  },
  {
    id: "task-2",
    title: "Fix login button",
    description: "The login button doesn't work on mobile devices",
    type: "bug",
    status: "inprogress",
    assignee: "Developer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [],
  },
];

// Get tasks from local storage
const getLocalTasks = (): Task[] => {
  if (typeof window === "undefined") return [];

  try {
    const localTasks = localStorage.getItem("tasks");
    return localTasks ? JSON.parse(localTasks) : initialTasks;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return initialTasks;
  }
};

// Save tasks to local storage
const saveLocalTasks = (tasks: Task[]): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
  // First check if we're in a browser environment
  if (typeof window === "undefined") {
    return [];
  }

  try {
    // Try to get from local storage first
    const localTasks = getLocalTasks();

    // Only try the API if we have a valid API key
    if (API_KEY && API_KEY !== "default-key") {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${API_URL}/${API_KEY}`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        const apiTasks = data.tasks || [];

        // If we got tasks from the API, save them locally and return them
        if (apiTasks.length > 0) {
          saveLocalTasks(apiTasks);
          return apiTasks;
        }

        // If API returned empty array but we have local tasks, push local to API
        if (localTasks.length > 0) {
          await saveTasks(localTasks);
        }
      } catch (apiError) {
        console.warn("API fetch failed, using local data:", apiError);
        // Continue with local data on API failure
      }
    }

    // Return local tasks if API failed or wasn't attempted
    return localTasks;
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    // Last resort fallback
    return initialTasks;
  }
};

// Save tasks to API and local storage
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  // Always save to local storage first
  saveLocalTasks(tasks);

  // Skip API call if we're not in a browser or don't have a valid API key
  if (typeof window === "undefined" || !API_KEY || API_KEY === "default-key") {
    return;
  }

  try {
    // Clean up old tasks (tasks marked as done for more than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filteredTasks = tasks.filter((task) => {
      if (task.status !== "done") return true;
      const updatedDate = new Date(task.updatedAt);
      return updatedDate > thirtyDaysAgo;
    });

    // Try to save to API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_URL}/${API_KEY}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tasks: filteredTasks }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
  } catch (error) {
    console.warn(
      "Failed to save tasks to API, data is still saved locally:",
      error
    );
    // We already saved to localStorage, so no further action needed
  }
};

// Add a new task
export const addTask = async (
  tasks: Task[],
  newTask: Task
): Promise<Task[]> => {
  const updatedTasks = [...tasks, newTask];
  await saveTasks(updatedTasks);
  return updatedTasks;
};

// Update an existing task
export const updateTask = async (
  tasks: Task[],
  updatedTask: Task
): Promise<Task[]> => {
  const updatedTasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  await saveTasks(updatedTasks);
  return updatedTasks;
};

// Delete a task
export const deleteTask = async (
  tasks: Task[],
  taskId: string
): Promise<Task[]> => {
  const updatedTasks = tasks.filter((task) => task.id !== taskId);
  await saveTasks(updatedTasks);
  return updatedTasks;
};
