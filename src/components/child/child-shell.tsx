import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  HelpCircle,
  Home,
  LifeBuoy,
  PawPrint,
  Repeat,
  Tent,
  UserRound,
  Users,
  Volume2,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { WolfMark } from "@/components/wolf-mark";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/app", label: "Start", icon: Home, exact: true },
  { to: "/app/wilk", label: "Wilk", icon: PawPrint, exact: false },
  { to: "/app/nauka", label: "Nauka", icon: BookOpen, exact: false },
  { to: "/app/nora", label: "Nora", icon: Tent, exact: false },
  { to: "/app/profil", label: "Ja", icon: UserRound, exact: false },
] as const;

const MORE = [
  { to: "/app/szkola", label: "Nie zrozumiałem w szkole", icon: HelpCircle },
  { to: "/app/powtorka", label: "Powtórka", icon: Repeat },
  { to: "/app/lizaki", label: "Lizaki", icon: Volume2 },
  { to: "/app/nagrody", label: "Piosenka", icon: Volume2 },
  { to: "/app/rodzic", label: "Rodzic", icon: Users },
  { to: "/app/pomoc", label: "Pomoc", icon: LifeBuoy },
] as const;

export function ChildShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    document.body.dataset.shell = "child";
    return () => {
      delete document.body.dataset.shell;
    };
  }, []);

  return (
    <div className="glade grain relative min-h-dvh">
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col pb-24 md:pb-8 md:pl-56">
        <header className="flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] md:px-8">
          <Link to="/app" className="flex items-center gap-2">
            <WolfMark size={40} />
            <span className="font-display text-xl font-semibold tracking-tight text-forest">
              Młoda Wataha
            </span>
          </Link>
          <Link
            to="/app/pomoc"
            className="inline-flex h-11 items-center rounded-full bg-berry px-4 text-sm font-bold text-paper"
          >
            Potrzebuję pomocy
          </Link>
        </header>

        <aside className="fixed top-24 bottom-8 left-6 z-20 hidden w-44 flex-col gap-1 md:flex">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-12 items-center gap-3 rounded-2xl px-3 text-sm font-bold",
                  active ? "bg-forest text-paper" : "text-ink-soft hover:bg-white/50",
                )}
              >
                <Icon className="size-4" strokeWidth={2.2} />
                {item.label}
              </Link>
            );
          })}
          <div className="mt-4 space-y-1 border-t border-ink/10 pt-3">
            {MORE.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold",
                    active ? "text-forest" : "text-ink-soft hover:text-ink",
                  )}
                >
                  <Icon className="size-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 px-4 md:px-8">{children ?? <Outlet />}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] font-bold",
                    active ? "bg-forest text-paper" : "text-ink-soft",
                  )}
                >
                  <Icon className="size-5" strokeWidth={2.2} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
