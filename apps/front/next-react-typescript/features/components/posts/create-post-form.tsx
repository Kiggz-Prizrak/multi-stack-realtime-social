"use client";

import { useRef, useState } from "react";
import { createPost } from "@/features/api/posts";
import { isApiError } from "@/features/api/error";

type CreatePostFormProps = {
  onCreated?: () => Promise<void> | void;
};

export function CreatePostForm({ onCreated }: CreatePostFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePickFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setMedia(file);

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!content.trim() && !media) {
      setError("Ajoute un texte ou une image.");
      return;
    }

    try {
      setPending(true);

      await createPost({
        content: content.trim() || undefined,
        media: media ?? undefined,
      });

      setContent("");
      setMedia(null);
      setPreviewUrl(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await onCreated?.();
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message);
      } else {
        setError("Impossible de publier pour le moment.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          Créer une publication
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Partage un texte ou une image.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="À quoi penses-tu ?"
          rows={4}
          className="w-full resize-none rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900"
        />

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
            Ajouter une image
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePickFile}
            />
          </label>

          {media && (
            <button
              type="button"
              onClick={() => {
                setMedia(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              Retirer l’image
            </button>
          )}
        </div>

        {previewUrl && (
          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Publication..." : "Publier"}
          </button>
        </div>
      </form>
    </section>
  );
}
