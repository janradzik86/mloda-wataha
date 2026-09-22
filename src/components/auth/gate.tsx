import { Navigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { bootstrapFounderAdmin, getMyAccess, type AccessSnapshot } from "@/lib/api/rbac";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ForbiddenScreen } from "@/components/auth/forbidden-screen";
import { WolfMark } from "@/components/wolf-mark";

export function SessionGate({
  children,
  need,
}: {
  children: (access: AccessSnapshot) => ReactNode;
  need: "USER" | "ADMIN";
}) {
  const { user, isPending } = useCurrentUserState();
  const [access, setAccess] = useState<AccessSnapshot | null>(null);
  const [error, setError] = useState<"forbidden" | "unknown" | null>(null);
  const [booting, setBooting] = useState(false);

  useEffect(() => {
    if (isPending || !user) return;
    let cancelled = false;
    getMyAccess()
      .then((snap) => {
        if (!cancelled) setAccess(snap);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "";
        if (message === "Unauthorized") setAccess(null);
        else if (message.includes("FORBIDDEN") || (err as { status?: number }).status === 403) {
          setError("forbidden");
        } else setError("unknown");
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, user]);

  if (isPending) return <ShellSkeleton />;
  if (!user) {
    return <Navigate to="/login" search={{ intent: need === "ADMIN" ? "admin" : "user" }} />;
  }
  if (error === "unknown") {
    return (
      <div className="glade grid min-h-dvh place-items-center p-6">
        <p className="text-ink-soft">Nie udało się odczytać roli. Odśwież stronę.</p>
      </div>
    );
  }
  if (!access) return <ShellSkeleton />;

  if (need === "ADMIN" && !access.isAdmin) {
    return (
      <ForbiddenScreen
        canBootstrap={access.canBootstrapFounder}
        booting={booting}
        onBootstrap={async () => {
          setBooting(true);
          try {
            const next = await bootstrapFounderAdmin();
            setAccess(next);
            setError(null);
          } catch {
            setError("forbidden");
          } finally {
            setBooting(false);
          }
        }}
      />
    );
  }

  if (need === "USER" && !access.isUser && !access.isAdmin) {
    return <ForbiddenScreen canBootstrap={false} booting={false} />;
  }

  return <>{children(access)}</>;
}

function ShellSkeleton() {
  return (
    <div className="glade grid min-h-dvh place-items-center">
      <div className="flex flex-col items-center gap-3">
        <WolfMark size={56} />
        <div className="h-3 w-40 animate-pulse rounded-full bg-forest/15" />
      </div>
    </div>
  );
}
