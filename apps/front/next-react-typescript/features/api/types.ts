export type Id = number | string;

export type PaginatedParams = {
  limit?: number;
  offset?: number;
};

export type CursorParams = {
  limit?: number;
  before?: string;
};

export type AuthUser = {
  id?: number;
  email?: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  role?: string;
};

export type AuthResponse = {
  user: AuthUser;
};

export type ApiMessageResponse = {
  message: string;
};

