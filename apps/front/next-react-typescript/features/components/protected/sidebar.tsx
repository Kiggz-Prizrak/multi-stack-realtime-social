"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./logout-button";
import type { AuthUser } from "@/features/types/auth";

type Props = {
  user: AuthUser;
};

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const myProfileHref = `/profile/${user.id}`;

  const navItems = [
    ...(user.isAdmin ? [{ href: "/home", label: "Dashboard" }] : []),
    { href: "/messages", label: "Messagerie" },
    { href: myProfileHref, label: "Profil" },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-white">
      <div className="flex items-center gap-3 border-b border-zinc-200 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white">
          RS
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900">Realtime Social</p>
          <p className="text-xs text-zinc-500">Plateforme</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4">
        <Link
          href={myProfileHref}
          className="mb-3 flex items-center gap-3 rounded-2xl p-2 transition hover:bg-zinc-50"
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{user.username[0].toUpperCase()}</span>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">
              {user.firstName || user.username}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {user.isAdmin ? "Admin" : "Utilisateur"}
            </p>
          </div>
        </Link>

        <LogoutButton />
      </div>
    </aside>
  );
}
