"use client";

import { useEffect, useState } from "react";
import { listPosts } from "@/features/api/posts";
import { isApiError } from "@/features/api/error";
import { PostCard } from "./post-card";

type Post = {
  id: number | string;
  content?: string | null;
  media?: string | null;
  createdAt?: string;
  User?: {
    username?: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
  };
};

type PostsResponse = {
  items: Post[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

type PostsFeedProps = {
  refreshKey?: number;
};

export function PostsFeed({ refreshKey = 0 }: PostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  async function loadPosts(initial = false) {
    try {
      setLoading(true);

      const res = (await listPosts({
        limit,
        offset: initial ? 0 : offset,
      })) as PostsResponse;

      if (initial) {
        setPosts(res.items);
        setOffset(limit);
      } else {
        setPosts((prev) => [...prev, ...res.items]);
        setOffset((prev) => prev + limit);
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

  useEffect(() => {
    loadPosts(true);
  }, [refreshKey]);

  const hasMore = posts.length < total;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => loadPosts()}
            disabled={loading}
            className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Chargement..." : "Charger plus"}
          </button>
        </div>
      )}
    </div>
  );
}
