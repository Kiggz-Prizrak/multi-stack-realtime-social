import { apiFetch } from "./http";
import type { Id, ApiMessageResponse } from "./types";

export async function listReactions() {
  return apiFetch<unknown[]>("/reactions");
}

export async function getReaction(id: Id) {
  return apiFetch<unknown>(`/reactions/${id}`);
}

export async function createReaction(input: {
  PostId?: Id;
  CommentId?: Id;
  type: string;
}) {
  return apiFetch<unknown>("/reactions", {
    method: "POST",
    body: input,
  });
}

export async function updateReaction(id: Id, input: { type: string }) {
  return apiFetch<unknown>(`/reactions/${id}`, {
    method: "PUT",
    body: input,
  });
}

export async function deleteReaction(id: Id) {
  return apiFetch<ApiMessageResponse>(`/reactions/${id}`, {
    method: "DELETE",
  });
}
