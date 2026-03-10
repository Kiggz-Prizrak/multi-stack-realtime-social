import type { Id } from "@/features/api/types";
import type { UserSummary } from "./users";
import type { Reaction } from "./reactions";
import type { CommentItem } from "./comments";

export type PostAuthor = {
  id?: number | string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
};


export type PostComment = {
  id: number | string;
  content?: string | null;
  createdAt?: string;
  User?: PostAuthor;
  user?: PostAuthor;
};

export type Post = {
  id: Id;
  UserId?: Id;
  userId?: Id;
  content?: string | null;
  media?: string | null;
  mediaUrl?: string | null;
  createdAt?: string;
  User?: UserSummary;
  user?: UserSummary;
  Reactions?: Reaction[];
  reactions?: Reaction[];
  Comments?: CommentItem[];
  comments?: CommentItem[];
};

export type PostsResponse = {
  items: Post[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};
