"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMe } from "@/features/api/auth";
import { isApiError } from "@/features/api/error";
import { Sidebar } from "./sidebar";
import { AuthContext } from "@/features/context/auth-context";
import type { AuthUser } from "@/features/types/auth";
type ProtectedShellProps = {
  children: React.ReactNode;
};

type Status = "loading" | "ready" | "backend-down";

export function ProtectedShell({ children }: ProtectedShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;

    async function hydrateSession() {
      try {
        const res = await getMe();

        if (!active) return;

        setUser(res.user);
        setStatus("ready");
      } catch (error) {
        if (!active) return;

        if (isApiError(error) && error.status === 401) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }

        setStatus("backend-down");
      }
    }

    hydrateSession();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-sm text-zinc-600 shadow-sm">
          Chargement...
        </div>
      </div>
    );
  }

  if (status === "backend-down" || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900">
            Backend indisponible
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Impossible de vérifier ta session pour le moment.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true,
      }}
    >
      <div className="flex min-h-screen max-h-screen bg-zinc-50">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </AuthContext.Provider>
  );
}
