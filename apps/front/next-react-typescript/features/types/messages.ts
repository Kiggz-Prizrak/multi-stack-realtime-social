import type { Id } from "@/features/api/types";
import type { UserSummary } from "./users";

export type Message = {
  id: Id;
  roomId: Id;
  senderId?: Id;
  content: string;
  createdAt?: string;
  sender?: UserSummary;
};
