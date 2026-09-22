import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BookMarked,
  Gift,
  LayoutDashboard,
  Link2,
  Music,
  PawPrint,
  Settings,
  Users,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Pulpit", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Użytkownicy", icon: Users, exact: false },
  { to: "/admin/content", label: "Treści", icon: BookMarked, exact: false },
  { to: "/admin/young-wolf", label: "Młody Wilk", icon: PawPrint, exact: false },
  { to: "/admin/rewards", label: "Nagrody", icon: Gift, exact: false },
  { to: "/admin/songs", label: "Piosenki", icon: Music, exact: false },
  { to: "/admin/bridge", label: "Family Bridge", icon: Link2, exact: false },
  { to: "/admin/settings", label: "Konfiguracja", icon: Settings, exact: false },
] as const;

export function AdminShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    document.body.dataset.shell = "admin";
    return () => {
      delete document.body.dataset.shell;
    };
  }, []);

  return (
    <div className="admin-grid min-h-dvh font-admin text-admin-fg">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-admin-line bg-admin-surface/90 p-4 md:flex md:flex-col">
        <p className="px-2 text-[11px] font-medium tracking-[0.18em] text-admin-muted uppercase">
          Młoda Wataha
        </p>
        <h1 className="mt-1 px-2 text-lg font-semibold">Panel administratora</h1>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium",
                  active ? "bg-admin-raised text-white" : "text-admin-muted hover:bg-admin-raised/60 hover:text-admin-fg",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="rounded-xl bg-admin-raised p-3 text-xs text-admin-muted">
          <UserButton />
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="flex items-center justify-between border-b border-admin-line px-4 py-3 md:hidden">
          <span className="text-sm font-semibold">Admin</span>
          <UserButton />
        </header>
        <div className="flex gap-2 overflow-x-auto px-3 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="shrink-0 rounded-full bg-admin-surface px-3 py-2 text-xs text-admin-muted ring-1 ring-admin-line"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="px-4 py-6 md:px-10 md:py-10">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
