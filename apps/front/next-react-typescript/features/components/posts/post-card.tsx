"use client";

import { useEffect, useMemo, useState } from "react";
import { createReaction, deleteReaction } from "@/features/api/reactions";
import { createReport } from "@/features/api/reports";
import { isApiError } from "@/features/api/error";
import { CommentsContainer } from "./comments-container";
import { EditPostForm } from "./edit-post-from";
import type { Post } from "@/features/types/posts";
import type { Reaction } from "@/features/types/reactions";
import type { AuthUser } from "@/features/types/auth";

type PostCardProps = {
  post: Post;
  currentUser?: AuthUser | null;
  onDelete?: (postId: number | string) => void | Promise<void>;
  onRefresh?: () => Promise<void> | void;
};

export function PostCard({
  post,
  currentUser,
  onDelete,
  onRefresh,
}: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [reactionPending, setReactionPending] = useState(false);
  const [reportPending, setReportPending] = useState(false);

  const author = post.User ?? post.user;

  const authorName =
    author?.firstName || author?.lastName
      ? `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
      : (author?.username ?? "Utilisateur");

  const mediaUrl = post.mediaUrl ?? post.media ?? null;
  const ownerId = post.UserId ?? post.userId ?? author?.id;

  const isOwner =
    currentUser && ownerId ? String(currentUser.id) === String(ownerId) : false;

  const isAdmin = Boolean(currentUser?.isAdmin);
  const canManage = isOwner || isAdmin;
  const canReport = Boolean(currentUser) && !canManage;

  const initialReactions = useMemo<Reaction[]>(
    () => post.Reactions ?? post.reactions ?? [],
    [post.Reactions, post.reactions],
  );

  const [optimisticReactions, setOptimisticReactions] =
    useState<Reaction[]>(initialReactions);

  useEffect(() => {
    setOptimisticReactions(initialReactions);
  }, [initialReactions]);

  const likes = optimisticReactions.filter(
    (reaction) => reaction.type === "like",
  );

  const myLike = likes.find((reaction) => {
    const reactionUserId = reaction.UserId ?? reaction.userId;
    return String(reactionUserId) === String(currentUser?.id);
  });

  const commentsCount = (post.Comments ?? post.comments ?? []).length;

  async function handleToggleLike() {
    if (!currentUser || reactionPending) return;

    const previous = optimisticReactions;

    try {
      setReactionPending(true);

      if (myLike) {
        setOptimisticReactions((prev) =>
          prev.filter((reaction) => String(reaction.id) !== String(myLike.id)),
        );

        await deleteReaction(myLike.id);
      } else {
        const tempReaction: Reaction = {
          id: `temp-like-${currentUser.id}-${post.id}`,
          type: "like",
          userId: currentUser.id,
          PostId: post.id,
        };

        setOptimisticReactions((prev) => [...prev, tempReaction]);

        await createReaction({
          PostId: post.id,
          type: "like",
        });
      }

      await onRefresh?.();
    } catch (err) {
      setOptimisticReactions(previous);

      if (isApiError(err)) {
        alert(err.message);
      } else {
        alert("Impossible de mettre à jour le like.");
      }
    } finally {
      setReactionPending(false);
    }
  }

  async function handleReport() {
    if (!canReport || reportPending) return;

    try {
      setReportPending(true);
      await createReport({ PostId: post.id });
      alert("Publication signalée.");
    } catch (err) {
      if (isApiError(err)) {
        alert(err.message);
      } else {
        alert("Impossible de signaler cette publication.");
      }
    } finally {
      setReportPending(false);
    }
  }

  if (isEditing) {
    return (
      <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <EditPostForm
          post={post}
          onCancel={() => setIsEditing(false)}
          onSaved={async () => {
            setIsEditing(false);
            await onRefresh?.();
          }}
        />
      </article>
    );
  }

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
            {author?.avatar ? (
              <img
                src={author.avatar}
                alt={authorName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{authorName.slice(0, 1).toUpperCase()}</span>
            )}
          </div>

          <div className="w- flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {authorName}
              </p>

              {post.createdAt && (
                <p className="text-xs text-zinc-500">
                  {new Date(post.createdAt).toLocaleString("fr-FR")}
                </p>
              )}
            </div>

            {post.content && (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                {post.content}
              </p>
            )}

            {mediaUrl && (
              <div className={post.content ? "mt-4" : "mt-3"}>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={mediaUrl}
                    alt="Publication"
                    className="max-h-[480px] w-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-4">
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={!currentUser || reactionPending}
                className={[
                  "rounded-full border px-3 py-2 text-xs font-medium transition",
                  myLike
                    ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                  !currentUser || reactionPending ? "opacity-60" : "",
                ].join(" ")}
              >
                {myLike ? "❤️" : "🤍"} {likes.length}
              </button>

              <span className="text-xs text-zinc-500">
                {commentsCount} commentaire{commentsCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {canManage && (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
              >
                ✏ Modifier
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(post.id)}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
              >
                🗑 Supprimer
              </button>
            </>
          )}

          {!canManage && canReport && (
            <button
              type="button"
              onClick={handleReport}
              disabled={reportPending}
              className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-60"
            >
              {reportPending ? "Signalement..." : "Signaler"}
            </button>
          )}
        </div>
      </div>

      <CommentsContainer post={post} onRefresh={onRefresh} />
    </article>
  );
}
