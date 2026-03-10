"use client";

import { useEffect, useState } from "react";
import { listPosts, deletePost } from "@/features/api/posts";
import { isApiError } from "@/features/api/error";
import { PostCard } from "./post-card";
import { useAuth } from "@/features/context/auth-context";
import type { Post } from "@/features/types/posts";
import type { PaginatedResponse } from "@/features/api/types";

type PostsFeedProps = {
  refreshKey?: number;
};

export function PostsFeed({ refreshKey = 0 }: PostsFeedProps) {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 20;

  async function loadPosts(initial = false) {
    try {
      setLoading(true);

      const nextOffset = initial ? 0 : offset;

      const res: PaginatedResponse<Post> = await listPosts({
        limit,
        offset: nextOffset,
      });
      if (initial) {
        setPosts(res.items);
        setOffset(res.items.length);
      } else {
        setPosts((prev) => [...prev, ...res.items]);
        setOffset((prev) => prev + res.items.length);
      }

      setTotal(res.pagination.total);
    } catch (err) {
      if (!isApiError(err)) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function refreshFeed() {
    setOffset(0);
    await loadPosts(true);
  }

  async function handleDelete(postId: number | string) {
    try {
      await deletePost(postId);

      setPosts((prev) =>
        prev.filter((post) => String(post.id) !== String(postId)),
      );

      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      if (isApiError(err)) {
        alert(err.message);
      } else {
        alert("Impossible de supprimer ce post.");
      }
    }
  }

  useEffect(() => {
    loadPosts(true);
  }, [refreshKey]);

  const hasMore = posts.length < total;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUser={user}
          onDelete={handleDelete}
          onRefresh={refreshFeed}
        />
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={() => loadPosts(false)}
          disabled={loading}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
        >
          {loading ? "Chargement..." : "Charger plus"}
        </button>
      )}
    </div>
  );
}
