import { apiFetch } from "./http";
import type { Id } from "./types";

export async function listRooms() {
  return apiFetch<unknown[]>("/rooms");
}

export async function createRoom(input: {
  type: string;
  name?: string;
  memberIds?: Id[];
}) {
  return apiFetch<unknown>("/rooms", {
    method: "POST",
    body: input,
  });
}
