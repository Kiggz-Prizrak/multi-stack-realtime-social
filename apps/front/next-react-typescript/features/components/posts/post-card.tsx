type PostAuthor = {
  id?: number | string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
};

type Post = {
  id: number | string;
  content?: string | null;
  media?: string | null;
  mediaUrl?: string | null;
  createdAt?: string;
  User?: PostAuthor;
  user?: PostAuthor;
};

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const author = post.User ?? post.user;
  const authorName =
    author?.firstName || author?.lastName
      ? `${author?.firstName ?? ""} ${author?.lastName ?? ""}`.trim()
      : (author?.username ?? "Utilisateur");

  const mediaUrl = post.mediaUrl ?? post.media ?? null;

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
          {author?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.avatar}
              alt={authorName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{authorName.slice(0, 1).toUpperCase()}</span>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900">{authorName}</p>
          {post.createdAt && (
            <p className="text-xs text-zinc-500">
              {new Date(post.createdAt).toLocaleString("fr-FR")}
            </p>
          )}
        </div>
      </div>

      {post.content && (
        <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">
          {post.content}
        </p>
      )}

      {mediaUrl && (
        <div className={post.content ? "mt-4" : ""}>
          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl}
              alt="Publication"
              className="max-h-[480px] w-full object-cover"
            />
          </div>
        </div>
      )}
    </article>
  );
}
