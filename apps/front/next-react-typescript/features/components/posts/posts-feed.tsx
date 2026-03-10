"use client";

import { useEffect, useState } from "react";
import { listPosts, deletePost } from "@/features/api/posts";
import { isApiError } from "@/features/api/error";
import { PostCard } from "./post-card";
import { useAuth } from "@/features/context/auth-context";

type PostAuthor = {
  id?: number | string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
};

type Reaction = {
  id: number | string;
  type: string;
  UserId?: number | string;
  userId?: number | string;
};

type Comment = {
  id: number | string;
  content?: string | null;
  createdAt?: string;
  User?: PostAuthor;
  user?: PostAuthor;
};

type Post = {
  id: number | string;
  content?: string | null;
  media?: string | null;
  mediaUrl?: string | null;
  createdAt?: string;
  User?: PostAuthor;
  user?: PostAuthor;
  Reactions?: Reaction[];
  reactions?: Reaction[];
  Comments?: Comment[];
  comments?: Comment[];
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

      const res = (await listPosts({
        limit,
        offset: nextOffset,
      })) as PostsResponse;

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
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => loadPosts(false)}
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
