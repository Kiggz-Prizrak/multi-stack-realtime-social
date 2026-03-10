import type { Id } from "@/features/api/types";

export type RoomType = "dm" | "group";
export type RoomMemberRole = "admin" | "member";

export type Room = {
  id: Id;
  type: RoomType;
  name?: string | null;
  dmKey?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RoomMember = {
  userId: Id;
  role: RoomMemberRole;
  lastReadMessageId?: Id | null;
  lastReadAt?: string | null;
};
