"use client";

import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

axios.defaults.withCredentials = true;

export type AppUser = {
  userId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  provider?: "local" | "google";
  emailVerified?: boolean;
  onboardingCompleted?: boolean;
};

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

const API = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const { data } = await axios.get<{ user: AppUser }>(`${API}/auth/me`, {
        withCredentials: true,
      });
      setUserState(data.user);
      return data.user;
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
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch {
      // Clear the client state even if the server call fails.
    } finally {
      setUserState(null);
    }
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
