import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, login as apiLogin, signup as apiSignup } from "../api";

type User = { id: number; username: string; createdAt: string };

type AuthContextValue = {
  ready: boolean;
  token: string | null;
  user: User | null;
  login: (input: { emailOrUsername: string; password: string }) => Promise<void>;
  signup: (input: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "records_accessToken";
const USER_KEY = "records_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  });

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const me = await getMe(token);
        if (cancelled) return;
        setUser({ id: me.id, username: me.username, createdAt: me.createdAt });
      } catch {
        if (cancelled) return;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    refresh();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function login(input: { emailOrUsername: string; password: string }) {
    const res = await apiLogin(input);
    setToken(res.accessToken);
    const u = res.user;
    setUser({ id: u.id, username: u.username, createdAt: u.createdAt });
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }

  async function signup(input: { username: string; email: string; password: string }) {
    await apiSignup(input);
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  const value = useMemo<AuthContextValue>(
    () => ({ ready, token, user, login, signup, logout }),
    [ready, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

