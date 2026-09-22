import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import { useEffect } from "react";
import { ForestBackdrop, WolfMark } from "@/components/wolf-mark";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();

  useEffect(() => {
    delete document.body.dataset.shell;
  }, []);

  return (
    <div className="glade relative min-h-dvh overflow-hidden bg-paper text-ink">
      <ForestBackdrop />
      <main className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col items-center px-5 pb-16 pt-[max(2rem,env(safe-area-inset-top))] text-center">
        <WolfMark size={88} />
        <p className="mt-5 text-xs font-extrabold tracking-[0.22em] text-moss uppercase">osobna aplikacja dziecka</p>
        <h1 className="font-display mt-2 text-5xl font-semibold tracking-tight text-forest md:text-6xl">
          Młoda Wataha
        </h1>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-ink-soft">
          Nie oceniamy dziecka. Sprawdzamy, czy sposób tłumaczenia zadziałał.
        </p>

        <div className="mt-10 flex w-full flex-col gap-3">
          <Button
            variant="honey"
            size="xl"
            className="w-full"
            onClick={() => {
              if (isPending) return;
              if (user) void navigate({ to: "/app" });
              else void navigate({ to: "/login", search: { intent: "user" } });
            }}
          >
            <WolfMark size={36} />
            <span className="text-left">
              Wejdź do Młodej Watahy
              <span className="block text-sm font-semibold text-ink/70">dla dziecka</span>
            </span>
          </Button>

          <Link
            to="/login"
            search={{ intent: "admin" }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] text-sm font-bold text-ink-soft hover:text-ink"
          >
            <Settings2 className="size-4" />
            Panel administratora
          </Link>
        </div>

        <p className="mt-auto pt-12 text-xs leading-relaxed text-ink-soft/80">
          To nie jest Polska Wataha. Rodzic łączy się później przez Family Bridge.
        </p>
      </main>
    </div>
  );
}
