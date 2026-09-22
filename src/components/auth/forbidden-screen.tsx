import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function ForbiddenScreen({
  canBootstrap,
  booting,
  onBootstrap,
}: {
  canBootstrap: boolean;
  booting: boolean;
  onBootstrap?: () => void;
}) {
  return (
    <div className="admin-grid grid min-h-dvh place-items-center px-6 font-admin text-admin-fg">
      <div className="w-full max-w-md rounded-2xl bg-admin-surface p-8 ring-1 ring-admin-line">
        <p className="text-xs font-medium tracking-[0.2em] text-admin-muted uppercase">403</p>
        <h1 className="mt-2 text-2xl font-semibold">Brak dostępu</h1>
        <p className="mt-3 text-sm leading-relaxed text-admin-muted">
          Panel administratora jest zarezerwowany dla roli ADMIN. Rola jest sprawdzana na serwerze.
          Zmiana <code className="text-admin-fg">localStorage</code> nic nie daje.
        </p>
        {canBootstrap && onBootstrap ? (
          <div className="mt-6 rounded-xl bg-admin-raised p-4">
            <p className="text-sm text-admin-fg">Pierwsze konto w podglądzie może zostać założycielem.</p>
            <Button
              className="mt-3 w-full"
              variant="admin"
              disabled={booting}
              onClick={onBootstrap}
            >
              {booting ? "Nadawanie…" : "Nadaj rolę założyciela"}
            </Button>
          </div>
        ) : null}
        <div className="mt-6 flex flex-col gap-2">
          <Link to="/" className="text-sm text-admin-accent underline-offset-4 hover:underline">
            Wróć na start
          </Link>
          <Link to="/app" className="text-sm text-admin-muted underline-offset-4 hover:underline">
            Wejście dziecka
          </Link>
        </div>
      </div>
    </div>
  );
}
