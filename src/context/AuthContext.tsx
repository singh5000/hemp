"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface WPUser {
  databaseId: number;
  name:        string;
  email:       string;
}

interface AuthCtx {
  user:    WPUser | null;
  loading: boolean;
  login:   (username: string, password: string) => Promise<{ error?: string }>;
  logout:  () => Promise<void>;
  register:(data: RegisterData) => Promise<{ error?: string }>;
}

interface RegisterData {
  username:  string;
  email:     string;
  password:  string;
  firstName?: string;
  lastName?:  string;
}

const Ctx = createContext<AuthCtx>({
  user: null, loading: true,
  login: async () => ({}),
  logout: async () => {},
  register: async () => ({}),
});

const STORAGE_KEY = "hb_user";
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function readStored(): WPUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { user, exp } = JSON.parse(raw) as { user: WPUser; exp: number };
    if (Date.now() > exp) { localStorage.removeItem(STORAGE_KEY); return null; }
    return user;
  } catch { return null; }
}

function saveStored(user: WPUser) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, exp: Date.now() + SESSION_TTL })); } catch { }
}

function clearStored() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<WPUser | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── Verify session with server, trust localStorage as fallback ── */
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json() as { user?: WPUser };
        if (data.user) {
          setUser(data.user);
          saveStored(data.user);
        } else {
          /* Server confirmed not logged in — clear everything */
          clearStored();
          setUser(null);
        }
      }
      /* If res is not ok (5xx / network error), keep whatever localStorage had */
    } catch {
      /* Network error: don't log the user out — they may be offline */
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── On mount: restore from localStorage instantly, then verify ── */
  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setUser(stored);
      setLoading(false);
      /* Still verify in background so an actually-expired session gets cleared */
      checkSession();
    } else {
      checkSession();
    }
  }, [checkSession]);

  /* ── Login ── */
  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
        credentials: "include",
      });
      const data = await res.json() as { user?: WPUser; error?: string };
      if (!res.ok) return { error: data.error ?? "Login failed" };
      if (data.user) { setUser(data.user); saveStored(data.user); }
      return {};
    } catch {
      return { error: "Network error. Please try again." };
    }
  }, []);

  /* ── Logout ── */
  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    clearStored();
    setUser(null);
    document.cookie = "woo-session=; path=/; max-age=0";
    document.cookie = "woo-auth=; path=/; max-age=0";
  }, []);

  /* ── Register ── */
  const register = useCallback(async (d: RegisterData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(d),
        credentials: "include",
      });
      const data = await res.json() as { user?: WPUser; error?: string };
      if (!res.ok) return { error: data.error ?? "Registration failed" };
      if (data.user) { setUser(data.user); saveStored(data.user); }
      return {};
    } catch {
      return { error: "Network error. Please try again." };
    }
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
