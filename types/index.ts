export type TaskStatus = "backlog" | "inprogress" | "ready-to-check" | "done";
export type TaskType = "feature" | "bug" | "task" | "improvement";
export type UserRole = "user" | "admin";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  subtasks: SubTask[];
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
