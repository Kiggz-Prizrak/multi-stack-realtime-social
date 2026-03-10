import { apiFetch } from "./http";
import type { Id, PaginatedParams, ApiMessageResponse } from "./types";

type Post = {
  id: number | string;
  content?: string | null;
  media?: string | null;
  createdAt?: string;
};

type PostsResponse = {
  items: Post[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export async function listPosts(params?: PaginatedParams) {
  return apiFetch<PostsResponse>("posts", {
    query: {
      limit: params?.limit,
      offset: params?.offset,
    },
  });
}

export async function getPost(id: Id) {
  return apiFetch<unknown>(`posts/${id}`);
}

export async function createPost(input: { content?: string; media?: File }) {
  const formData = new FormData();

  if (input.content) formData.append("content", input.content);
  if (input.media) formData.append("media", input.media);

  return apiFetch<{ message: string; post: unknown }>("posts", {
    method: "POST",
    body: formData,
  });
}

export async function updatePost(
  id: Id,
  input: {
    content?: string;
    media?: File;
    removeMedia?: boolean;
  },
) {
  const formData = new FormData();

  if (input.content !== undefined) formData.append("content", input.content);
  if (input.media) formData.append("media", input.media);
  if (input.removeMedia) formData.append("removeMedia", "true");

  return apiFetch<ApiMessageResponse>(`posts/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deletePost(id: Id) {
  return apiFetch<ApiMessageResponse>(`posts/${id}`, {
    method: "DELETE",
  });
}
