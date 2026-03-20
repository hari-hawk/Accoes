"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "@/data/types";
import { mockUsers } from "@/data/mock-users";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = "accoes_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
    setIsLoading(false);
  }, []);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (isLoading) return;
    const isLoginPage = pathname === "/login";
    if (!user && !isLoginPage) {
      router.replace("/login");
    }
    if (user && isLoginPage) {
      router.replace("/project-v4");
    }
  }, [user, isLoading, pathname, router]);

  const login = useCallback((email: string) => {
    const found = mockUsers.find((u) => u.email === email) ?? mockUsers[0];
    setUser(found);
    localStorage.setItem(AUTH_KEY, JSON.stringify(found));
    router.replace("/project-v4");
  }, [router]);

  const loginWithGoogle = useCallback(() => {
    // Mock: simulate Google SSO by logging in as the first user
    const googleUser: User = {
      ...mockUsers[0],
      name: mockUsers[0].name,
      email: mockUsers[0].email,
    };
    setUser(googleUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(googleUser));
    router.replace("/project-v4");
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
