import type { User, AuthState } from "@/types";

// Simple authentication service
export const login = (username: string): AuthState => {
  // In a real app, this would validate against a backend
  const isAdmin = username.toLowerCase() === "otabek";

  const user: User = {
    id: "1",
    username,
    role: isAdmin ? "admin" : "user",
  };

  // Store in localStorage for persistence
  localStorage.setItem("user", JSON.stringify(user));

  return {
    user,
    isAuthenticated: true,
  };
};

export const logout = (): AuthState => {
  localStorage.removeItem("user");

  return {
    user: null,
    isAuthenticated: false,
  };
};

export const getAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false };
  }

  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return { user: null, isAuthenticated: false };
  }

  try {
    const user = JSON.parse(storedUser) as User;
    return { user, isAuthenticated: true };
  } catch (error) {
    console.error("Error parsing stored user:", error);
    return { user: null, isAuthenticated: false };
  }
};
