"use client";

import { useState } from "react";
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/features/api/comments";
import { isApiError } from "@/features/api/error";
import { useAuth } from "@/features/context/auth-context";

type CommentAuthor = {
  id?: number | string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
};

type Comment = {
  id: number | string;
  UserId?: number | string;
  userId?: number | string;
  PostId?: number | string;
  postId?: number | string;
  content?: string | null;
  createdAt?: string;
  User?: CommentAuthor;
  user?: CommentAuthor;
};

type Post = {
  id: number | string;
  Comments?: Comment[];
  comments?: Comment[];
};

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

  const comments = post.Comments ?? post.comments ?? [];

  async function handleCreateComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      setPending(true);

      await createComment({
        content: trimmed,
        PostId: post.id,
      });

      setContent("");
      setOpen(true);
      await onRefresh?.();
    } catch (err) {
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
    try {
      await deleteComment(commentId);

      if (String(editingId) === String(commentId)) {
        setEditingId(null);
        setEditingContent("");
      }

      await onRefresh?.();
    } catch (err) {
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

    try {
      await updateComment(commentId, {
        content: trimmed,
      });

      setEditingId(null);
      setEditingContent("");
      await onRefresh?.();
    } catch (err) {
      if (isApiError(err)) {
        alert(err.message);
      } else {
        alert("Impossible de modifier ce commentaire.");
      }
    }
  }

  return (
    <div className="mt-4 border-t border-zinc-200 pt-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
      >
        {open
          ? "Masquer les commentaires"
          : `Afficher les commentaires (${comments.length})`}
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <form onSubmit={handleCreateComment} className="space-y-3">
            <textarea
              rows={3}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Écrire un commentaire..."
              className="w-full resize-none rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-900"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={pending || !user}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {pending ? "Envoi..." : "Commenter"}
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {comments.map((comment) => {
              const author = comment.User ?? comment.user;
              const ownerId = comment.UserId ?? comment.userId ?? author?.id;

              const authorName =
                author?.firstName || author?.lastName
                  ? `${author?.firstName ?? ""} ${author?.lastName ?? ""}`.trim()
                  : (author?.username ?? "Utilisateur");

              const isOwner =
                user && ownerId ? String(user.id) === String(ownerId) : false;

              const isAdmin = Boolean(user?.isAdmin);
              const canManage = isOwner || isAdmin;

              const isEditing = String(editingId) === String(comment.id);

              return (
                <article
                  key={comment.id}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {authorName}
                      </p>

                      {comment.createdAt && (
                        <p className="text-xs text-zinc-500">
                          {new Date(comment.createdAt).toLocaleString("fr-FR")}
                        </p>
                      )}
                    </div>

                    {canManage && !isEditing && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditingContent(comment.content ?? "");
                          }}
                          className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        value={editingContent}
                        onChange={(event) =>
                          setEditingContent(event.target.value)
                        }
                        className="w-full resize-none rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-900"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setEditingContent("");
                          }}
                          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                          Annuler
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveEdit(comment.id)}
                          className="rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-800">{comment.content}</p>
                  )}
                </article>
              );
            })}

            {comments.length === 0 && (
              <p className="text-sm text-zinc-500">
                Aucun commentaire pour le moment.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
