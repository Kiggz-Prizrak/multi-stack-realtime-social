"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isApiError } from "@/features/api/error";
import { getMe } from "@/features/api/auth";

type Status = "loading" | "backend-down";

export function RootRedirect() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;

    async function resolveDefaultRoute() {
      try {
        const res = await getMe();

        if (!active) return;

        router.replace(res.user?.isAdmin ? "/home" : "/messages");
      } catch (error) {
        if (!active) return;

        if (isApiError(error) && error.status === 401) {
          router.replace("/login");
          return;
        }

        setStatus("backend-down");
      }
    }

    resolveDefaultRoute();

    return () => {
      active = false;
    };
  }, [router]);

  if (status === "backend-down") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-900">
            Backend indisponible
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Impossible de déterminer ta session pour le moment.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white"
          >
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-sm text-zinc-600 shadow-sm">
        Redirection...
      </div>
    </main>
  );
}
