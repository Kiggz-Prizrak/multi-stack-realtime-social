import type { Id } from "@/features/api/types";
import type { UserSummary } from "./users";
import type { Reaction } from "./reactions";

export type CommentItem = {
  id: Id;
  UserId?: Id;
  userId?: Id;
  PostId?: Id;
  postId?: Id;
  content?: string | null;
  media?: string | null;
  mediaUrl?: string | null;
  createdAt?: string;
  User?: UserSummary;
  user?: UserSummary;
  Reactions?: Reaction[];
  reactions?: Reaction[];
};

export type CommentablePostRef = {
  id: Id;
};
