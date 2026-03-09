import { apiFetch } from "./http";
import type { Id } from "./types";

export async function listRoomMessages(
  roomId: Id,
  params?: { limit?: number; before?: string },
) {
  return apiFetch<unknown>(`/rooms/${roomId}/messages`, {
    query: {
      limit: params?.limit,
      before: params?.before,
    },
  });
}

export async function createRoomMessage(
  roomId: Id,
  input: { content: string },
) {
  return apiFetch<unknown>(`/rooms/${roomId}/messages`, {
    method: "POST",
    body: input,
  });
}

export async function markRoomAsRead(
  roomId: Id,
  input?: { lastReadMessageId?: Id },
) {
  return apiFetch<unknown>(`/rooms/${roomId}/read`, {
    method: "POST",
    body: input ?? {},
  });
}
