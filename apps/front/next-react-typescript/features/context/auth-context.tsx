"use client";

import { createContext, useContext } from "react";

export type AuthUser = {
  id: number | string;
  email?: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  isAdmin?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
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
