"use client";

import { useRef, useState } from "react";
import { updatePost } from "@/features/api/posts";
import { isApiError } from "@/features/api/error";
import type { Post } from "@/features/types/posts";

type EditPostFormProps = {
  post: Post;
  onSaved?: () => Promise<void> | void;
  onCancel?: () => void;
};

export function EditPostForm({ post, onSaved, onCancel }: EditPostFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [content, setContent] = useState(post.content ?? "");
  const [media, setMedia] = useState<File | null>(null);
  const [removeMedia, setRemoveMedia] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentMediaUrl = post.mediaUrl ?? post.media ?? null;
  const finalPreview = previewUrl ?? (removeMedia ? null : currentMediaUrl);

  function handlePickFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setMedia(file);
    setRemoveMedia(false);

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmed = content.trim();

    if (!trimmed && !media && !finalPreview) {
      setError("Le post doit contenir un texte ou une image.");
      return;
    }

    try {
      setPending(true);

      await updatePost(post.id, {
        content: trimmed,
        media: media ?? undefined,
        removeMedia,
      });

      await onSaved?.();
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message);
      } else {
        setError("Impossible de modifier le post.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={4}
        className="w-full resize-none rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-900"
      />

      <div className="flex flex-wrap gap-3">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          Remplacer l’image
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePickFile}
          />
        </label>

        {finalPreview && (
          <button
            type="button"
            onClick={() => {
              setRemoveMedia(true);
              setMedia(null);
              setPreviewUrl(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Retirer l’image
          </button>
        )}
      </div>

      {finalPreview && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <img
            src={finalPreview}
            alt="Aperçu"
            className="max-h-80 w-full object-cover"
          />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {pending ? "Modification..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
