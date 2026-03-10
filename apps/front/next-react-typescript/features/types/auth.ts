import type { UserSummary } from "./users";

export type AuthUser = {
  id: number | string;
  email?: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  isAdmin?: boolean;
};

export type AuthUser = UserSummary & {
  email?: string;
  isAdmin?: boolean;
  role?: string;
};

export type AuthResponse = {
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};
