import type { Id } from "@/features/api/types";

export type Report = {
  id: Id;
  UserId?: Id;
  userId?: Id;
  PostId?: Id | null;
  postId?: Id | null;
  CommentId?: Id | null;
  commentId?: Id | null;
  createdAt?: string;
};
