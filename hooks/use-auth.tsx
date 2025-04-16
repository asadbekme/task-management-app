"use client";

import type React from "react";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import type { AuthState } from "@/types";
import {
  login as authLogin,
  logout as authLogout,
  getAuthState,
} from "@/lib/auth";

interface AuthContextType extends AuthState {
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state from localStorage
    const initialState = getAuthState();
    setAuthState(initialState);
  }, []);

  const login = (username: string) => {
    const newState = authLogin(username);
    setAuthState(newState);
    router.push("/dashboard");
  };

  const logout = () => {
    const newState = authLogout();
    setAuthState(newState);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
