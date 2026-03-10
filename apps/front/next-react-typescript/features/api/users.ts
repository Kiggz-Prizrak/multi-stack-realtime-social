import { apiFetch } from "./http";
import type { Id, ApiMessageResponse, PaginatedResponse } from "./types";
import type { UserDetail, UserSummary } from "@/features/types/users";

export async function listUsers() {
  return apiFetch<PaginatedResponse<UserSummary> | UserSummary[]>("users");
}

export async function getUser(id: Id) {
  return apiFetch<{ user: UserDetail } | UserDetail>(`users/${id}`);
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

  return apiFetch<{ message: string; user: UserDetail }>(`users/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function updateMe(
  input: Record<string, string | File | null | undefined>,
) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  }

  return apiFetch<{ message: string; user: UserDetail }>("users/me", {
    method: "PUT",
    body: formData,
  });
}

export async function deleteUser(id: Id) {
  return apiFetch<ApiMessageResponse>(`users/${id}`, {
    method: "DELETE",
  });
}
