import { apiFetch } from "./http";
import type { Id, ApiMessageResponse } from "./types";

export async function listUsers() {
  return apiFetch<unknown[]>("/users");
}

export async function getUser(id: Id) {
  return apiFetch<unknown>(`/users/${id}`);
}

export async function updateUser(
  id: Id,
  input: Record<string, string | File | null | undefined>,
) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  }

  return apiFetch<{ message: string; user: unknown }>(`/users/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteUser(id: Id) {
  return apiFetch<ApiMessageResponse>(`/users/${id}`, {
    method: "DELETE",
  });
}
