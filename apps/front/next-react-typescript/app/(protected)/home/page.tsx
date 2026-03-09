"use client";

import { useState } from "react";
import { CreatePostForm } from "@/features/components/posts/create-post-form";
import { PostsFeed } from "@/features/components/posts/posts-feed";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleCreated() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Bienvenue sur ton espace protégé.
        </p>
      </section>

      <CreatePostForm onCreated={handleCreated} />
      <PostsFeed refreshKey={refreshKey} />
    </div>
  );
}
