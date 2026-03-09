"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/features/api/auth";
import { isApiError } from "@/features/api/error";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    try {
      setPending(true);
      await logout();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error(error);

      if (isApiError(error)) {
        alert(error.message);
      } else {
        alert("Une erreur est survenue lors de la déconnexion.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Déconnexion..." : "Se déconnecter"}
    </button>
  );
}
