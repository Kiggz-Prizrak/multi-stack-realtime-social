"use client";

import { createContext, useContext } from "react";
import type { AuthUser } from "@/features/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthContext.Provider");
  }

  return context;
}
