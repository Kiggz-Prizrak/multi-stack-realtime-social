import type { Id } from "@/features/api/types";

export type ReactionType = string;

export type Reaction = {
  id: Id;
  type: ReactionType;
  UserId?: Id;
  userId?: Id;
  PostId?: Id | null;
  postId?: Id | null;
  CommentId?: Id | null;
  commentId?: Id | null;
  createdAt?: string;
};
