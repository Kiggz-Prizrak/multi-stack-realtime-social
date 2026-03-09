"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getMe } from "@/features/api/auth";
import { isApiError } from "@/features/api/error";
import { Sidebar } from "./sidebar";

type User = {
  id: number;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  isAdmin?: boolean;
};

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const res = await getMe();

        if (!active) return;

        setUser(res.user);
        setStatus("ready");
      } catch (error) {
        if (!active) return;

        if (isApiError(error) && error.status === 401) {
          router.replace(`/login?next=${pathname}`);
          return;
        }

        setStatus("error");
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (status === "error" || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Backend indisponible
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar user={user} />

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
