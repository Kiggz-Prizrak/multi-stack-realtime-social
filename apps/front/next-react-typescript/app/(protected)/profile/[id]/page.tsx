"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getUser, updateMe } from "@/features/api/users";
import { isApiError } from "@/features/api/error";
import { useAuth } from "@/features/context/auth-context";
import type { UserDetail } from "@/features/types/users";

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setStatus("loading");

        const res = await getUser(params.id);
        const nextProfile = "user" in res ? res.user : res;

        if (!active) return;

        setProfile(nextProfile);
        setUsername(nextProfile.username ?? "");
        setFirstName(nextProfile.firstName ?? "");
        setLastName(nextProfile.lastName ?? "");
        setEmail(nextProfile.email ?? "");
        setStatus("ready");
      } catch {
        if (!active) return;
        setStatus("error");
      }
    }

    if (params.id) {
      loadProfile();
    }

    return () => {
      active = false;
    };
  }, [params.id]);

  const isOwnProfile = useMemo(() => {
    if (!user?.id || !profile?.id) return false;
    return String(user.id) === String(profile.id);
  }, [user?.id, profile?.id]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isOwnProfile) return;

    try {
      setPending(true);

      const res = await updateMe({
        username,
        firstName,
        lastName,
        email,
      });

      setProfile(res.user);
      setEditing(false);
    } catch (error) {
      if (isApiError(error)) {
        alert(error.message);
      } else {
        alert("Impossible de mettre à jour le profil.");
      }
    } finally {
      setPending(false);
    }
  }

  if (status === "loading") {
    return (
      <section className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          Chargement du profil...
        </div>
      </section>
    );
  }

  if (status === "error" || !profile) {
    return (
      <section className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          Impossible de charger ce profil.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-zinc-100">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-zinc-600">
                {profile.username?.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold text-zinc-900">
              {[profile.firstName, profile.lastName]
                .filter(Boolean)
                .join(" ") || profile.username}
            </h1>

            <p className="mt-1 text-sm text-zinc-500">@{profile.username}</p>

            {isOwnProfile && profile.email && (
              <p className="mt-2 text-sm text-zinc-600">{profile.email}</p>
            )}
          </div>

          {isOwnProfile ? (
            <button
              type="button"
              onClick={() => setEditing((prev) => !prev)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              {editing ? "Fermer" : "Modifier le profil"}
            </button>
          ) : (
            <button
              type="button"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Message
            </button>
          )}
        </div>
      </div>

      {isOwnProfile && editing && (
        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Prénom
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Nom
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {pending ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
