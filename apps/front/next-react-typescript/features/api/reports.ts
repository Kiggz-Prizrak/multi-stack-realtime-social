import { apiFetch } from "./http";
import type { Id, ApiMessageResponse } from "./types";

export async function listReports() {
  return apiFetch<unknown[]>("/reports");
}

export async function getReport(id: Id) {
  return apiFetch<unknown>(`/reports/${id}`);
}

export async function createReport(input: { PostId?: Id; CommentId?: Id }) {
  return apiFetch<unknown>("/reports", {
    method: "POST",
    body: input,
  });
}

export async function deleteReport(id: Id) {
  return apiFetch<ApiMessageResponse>(`/reports/${id}`, {
    method: "DELETE",
  });
}
