import { apiFetch } from "./http";
import type {
  Id,
  PaginatedParams,
  ApiMessageResponse,
  PaginatedResponse,
} from "./types";
import type { CommentItem } from "@/features/types/comments";

export async function listComments(params?: PaginatedParams) {
  return apiFetch<PaginatedResponse<CommentItem>>("comments", {
    query: {
      limit: params?.limit,
      offset: params?.offset,
    },
  });
}

export async function getComment(id: Id) {
  return apiFetch<CommentItem>(`comments/${id}`);
}

export async function createComment(input: {
  content: string;
  PostId: Id;
  media?: File;
}) {
  const formData = new FormData();
  formData.append("content", input.content);
  formData.append("PostId", String(input.PostId));

  if (input.media) {
    formData.append("media", input.media);
  }

  return apiFetch<{ message: string; comment: CommentItem }>("comments", {
    method: "POST",
    body: formData,
  });
}

export async function updateComment(
  id: Id,
  input: {
    content?: string;
    media?: File;
  },
) {
  const formData = new FormData();

  if (input.content !== undefined) {
    formData.append("content", input.content);
  }

  if (input.media) {
    formData.append("media", input.media);
  }

  return apiFetch<ApiMessageResponse>(`comments/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteComment(id: Id) {
  return apiFetch<ApiMessageResponse>(`comments/${id}`, {
    method: "DELETE",
  });
}
