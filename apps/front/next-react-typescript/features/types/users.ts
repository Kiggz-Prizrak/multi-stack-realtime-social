export type UserSummary = {
  id: number | string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
};

export type UserDetail = UserSummary & {
  email?: string;
  isAdmin?: boolean;
  bio?: string | null;
};
