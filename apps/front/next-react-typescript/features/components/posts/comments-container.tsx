"use client";

import { useEffect, useRef, useState } from "react";
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/features/api/comments";
import { isApiError } from "@/features/api/error";
import { useAuth } from "@/features/context/auth-context";
import type { Post } from "@/features/types/posts";
import type { CommentItem } from "@/features/types/comments";

type CommentsContainerProps = {
  post: Post;
  onRefresh?: () => Promise<void> | void;
};

export function CommentsContainer({ post, onRefresh }: CommentsContainerProps) {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [optimisticComments, setOptimisticComments] = useState<CommentItem[]>(
    post.Comments ?? post.comments ?? [],
  );

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setOptimisticComments(post.Comments ?? post.comments ?? []);
  }, [post.Comments, post.comments]);

  async function handleCreateComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = content.trim();
    if (!trimmed || !user) return;

    const previous = optimisticComments;

    const tempComment: CommentItem = {
      id: `temp-comment-${Date.now()}`,
      content: trimmed,
      createdAt: new Date().toISOString(),
      userId: user.id,
      User: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    };

    try {
      setPending(true);
      setOptimisticComments((prev) => [tempComment, ...prev]);
      setContent("");
      setOpen(true);
      resetTextareaHeight();

      await createComment({
        content: trimmed,
        PostId: post.id,
      });

      await onRefresh?.();
    } catch (err) {
      setOptimisticComments(previous);

      if (isApiError(err)) {
        alert(err.message);
      } else {
        alert("Impossible d'ajouter le commentaire.");
      }
    } finally {
      setPending(false);
    }
  }

  async function handleDeleteComment(commentId: number | string) {
    const previous = optimisticComments;

    try {
      setOptimisticComments((prev) =>
        prev.filter((comment) => String(comment.id) !== String(commentId)),
      );

      if (String(editingId) === String(commentId)) {
        setEditingId(null);
        setEditingContent("");
      }

      await deleteComment(commentId);
      await onRefresh?.();
    } catch (err) {
      setOptimisticComments(previous);

      if (isApiError(err)) {
        alert(err.message);
      } else {
        alert("Impossible de supprimer ce commentaire.");
      }
    }
  }

  async function handleSaveEdit(commentId: number | string) {
    const trimmed = editingContent.trim();
    if (!trimmed) return;

    const previous = optimisticComments;

    try {
      setOptimisticComments((prev) =>
        prev.map((comment) =>
          String(comment.id) === String(commentId)
            ? { ...comment, content: trimmed }
            : comment,
        ),
      );

      await updateComment(commentId, {
        content: trimmed,
      });

      setEditingId(null);
      setEditingContent("");
      await onRefresh?.();
    } catch (err) {
      setOptimisticComments(previous);

      if (isApiError(err)) {
        alert(err.message);
      } else {
        alert("Impossible de modifier ce commentaire.");
      }
    }
  }

  function startEdit(comment: CommentItem) {
    setEditingId(comment.id);
    setEditingContent(comment.content ?? "");
    if (!open) setOpen(true);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingContent("");
  }

  function autoResizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }

  function resetTextareaHeight() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "64px";
  }

  return (
    <div className="mt-5 border-t border-zinc-200 pt-4">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
        >
          {open ? "Masquer les commentaires" : "Afficher les commentaires"}
        </button>

        <span className="text-xs text-zinc-500">
          {optimisticComments.length} commentaire
          {optimisticComments.length > 1 ? "s" : ""}
        </span>
      </div>

      <form onSubmit={handleCreateComment} className="mt-4">
        <div className="flex gap-3">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              autoResizeTextarea();
            }}
            placeholder="Ajouter un commentaire..."
            rows={2}
            className="min-h-[64px] max-h-48 flex-1 resize-none overflow-y-auto rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900"
          />

          <button
            type="submit"
            disabled={pending || !content.trim()}
            className="self-end rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
          >
            {pending ? "Envoi..." : "Commenter"}
          </button>
        </div>
      </form>

      {open && (
        <div className="mt-4 space-y-3 pl-10">
          {optimisticComments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-500">
              Aucun commentaire pour le moment.
            </div>
          ) : (
            optimisticComments.map((comment) => {
              const author = comment.User ?? comment.user;
              const authorName =
                author?.firstName || author?.lastName
                  ? `${author?.firstName ?? ""} ${author?.lastName ?? ""}`.trim()
                  : (author?.username ?? "Utilisateur");

              const commentOwnerId =
                comment.UserId ?? comment.userId ?? author?.id;
              const isOwner =
                user && commentOwnerId
                  ? String(user.id) === String(commentOwnerId)
                  : false;

              const canManage = isOwner || Boolean(user?.isAdmin);
              const isEditingThis = String(editingId) === String(comment.id);

              return (
                <article
                  key={comment.id}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700">
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

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="text-sm font-semibold text-zinc-900">
                            {authorName}
                          </p>

                          {comment.createdAt && (
                            <p className="text-xs text-zinc-500">
                              {new Date(comment.createdAt).toLocaleString(
                                "fr-FR",
                              )}
                            </p>
                          )}
                        </div>

                        {isEditingThis ? (
                          <div className="mt-3 space-y-3">
                            <textarea
                              value={editingContent}
                              onChange={(event) =>
                                setEditingContent(event.target.value)
                              }
                              rows={3}
                              className="w-full resize-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-900"
                            />

                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                              >
                                Annuler
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSaveEdit(comment.id)}
                                disabled={!editingContent.trim()}
                                className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                              >
                                Enregistrer
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </div>

                    {canManage && !isEditingThis && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(comment)}
                          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                        >
                          ✏ Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          🗑 Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
