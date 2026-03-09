"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMe } from "../api";
import { isApiError } from "../api/error";

type AuthGateProps = {
  children: ReactNode;
};

type Status = "loading" | "allowed" | "backend-down";

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        await getMe();

        if (!active) return;
        setStatus("allowed");
      } catch (error) {
        if (!active) return;

        if (isApiError(error) && error.status === 401) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }

        setStatus("backend-down");
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [router, pathname]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-sm text-zinc-600 shadow-sm">
          Chargement...
        </div>
      </div>
    );
  }

  if (status === "backend-down") {
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

  return <>{children}</>;
}
