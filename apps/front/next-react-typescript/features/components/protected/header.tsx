"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./logout-button";

type ProtectedHeaderProps = {
  user: {
    id: number | string;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string;
    avatar?: string | null;
    isAdmin?: boolean;
  };
};

type NavItem = {
  href: string;
  label: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function NavLink({ href, label, pathname }: NavItem & { pathname: string }) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition",
        isActive
          ? "bg-zinc-900 text-white shadow-sm"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
      )}
    >
      {label}
    </Link>
  );
}

export function ProtectedHeader({ user }: ProtectedHeaderProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    ...(user.isAdmin ? [{ href: "/home", label: "Dashboard" }] : []),
    { href: "/messages", label: "Messagerie" },
    { href: "/profile", label: "Profil" },
  ];

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href={user.isAdmin ? "/home" : "/messages"}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-semibold text-white shadow-sm">
              RS
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-tight text-zinc-900">
                Realtime Social
              </p>
              <p className="text-xs text-zinc-500">Plateforme sociale</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="hidden items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-2 transition hover:bg-zinc-50 sm:flex"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{user.username.slice(0, 1).toUpperCase()}</span>
              )}
            </div>

            <div className="max-w-[180px] text-left">
              <p className="truncate text-sm font-medium text-zinc-900">
                {fullName}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {user.isAdmin ? "Administrateur" : "Utilisateur"}
              </p>
            </div>
          </Link>

          <LogoutButton />
        </div>
      </div>

      <div className="border-t border-zinc-200 px-4 py-2 md:hidden">
        <nav className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              pathname={pathname}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}
