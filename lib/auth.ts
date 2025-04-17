import type { User, AuthState } from "@/types";
import { serialize, parse } from "cookie";

export const setCookie = (name: string, value: string, options: any = {}) => {
  if (typeof window === "undefined") return;

  document.cookie = serialize(name, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 hafta
    ...options,
  });
};

export const getCookie = (name: string) => {
  if (typeof window === "undefined") return null;

  const cookies = parse(document.cookie);
  return cookies[name] || null;
};

export const removeCookie = (name: string) => {
  if (typeof window === "undefined") return;

  document.cookie = serialize(name, "", {
    path: "/",
    maxAge: -1,
  });
};

// Simple authentication service
export const login = (username: string): AuthState => {
  // In a real app, this would validate against a backend service
  // and return a JWT or session token.
  const isAdmin = username.toLowerCase() === "otabek";

  const user: User = {
    id: "1",
    username,
    role: isAdmin ? "admin" : "user",
  };

  // Save user data to cookie
  setCookie("user", JSON.stringify(user));

  return {
    user,
    isAuthenticated: true,
  };
};

export const logout = (): AuthState => {
  // Remove user data from cookie
  removeCookie("user");

  return {
    user: null,
    isAuthenticated: false,
  };
};

export const getAuthState = (): AuthState => {
  const storedUser = getCookie("user");

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
