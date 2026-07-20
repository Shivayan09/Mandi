"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { getCurrentUser, logout as logoutRequest } from "@/services/auth/api";
import type { AppUser } from "@/services/auth/types";

type AppContextValue = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  refreshAuth: () => Promise<AppUser | null>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUserState(currentUser);
      return currentUser;
    } catch {
      setUserState(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshAuth();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshAuth]);

  const setUser = useCallback((nextUser: AppUser | null) => {
    setUserState(nextUser);
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUserState(null);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      setUser,
      clearUser,
      logout,
      isAuthenticated: Boolean(user),
      loading,
      refreshAuth,
    }),
    [user, loading, refreshAuth, setUser, clearUser, logout],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
