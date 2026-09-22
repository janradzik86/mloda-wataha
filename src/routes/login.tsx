import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { FieldLabel, TextField } from "@/components/ui/field";
import { ForestBackdrop, WolfMark } from "@/components/wolf-mark";
import { cn } from "@/lib/utils";

type Intent = "user" | "admin";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { intent: Intent } => ({
    intent: search.intent === "admin" ? "admin" : "user",
  }),
  component: Login,
});

function Login() {
  const { intent } = Route.useSearch();
  const admin = intent === "admin";
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.body.dataset.shell = admin ? "admin" : "child";
    return () => {
      delete document.body.dataset.shell;
    };
  }, [admin]);

  useEffect(() => {
    if (!isPending && user) {
      void navigate({ to: admin ? "/admin" : "/app" });
    }
  }, [admin, isPending, navigate, user]);

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (err) {
      setError(err.message ?? "Nie udało się zalogować.");
      return;
    }
    void navigate({ to: admin ? "/admin" : "/app" });
  }

  return (
    <div
      className={cn(
        "relative min-h-dvh",
        admin ? "admin-grid font-admin text-admin-fg" : "glade bg-paper text-ink",
      )}
    >
      {!admin ? <ForestBackdrop /> : null}
      <main className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-12">
        {admin ? null : <WolfMark size={56} />}
        <p className={cn("text-xs font-bold tracking-[0.18em] uppercase", admin ? "text-admin-muted" : "mt-4 text-moss")}>
          {admin ? "wejście personelu" : "wejście dziecka"}
        </p>
        <h1 className={cn("mt-2 text-3xl font-semibold tracking-tight", admin ? "font-admin text-admin-fg" : "font-display text-forest")}>
          {admin ? "Panel administratora" : "Witaj w Młodej Watasze"}
        </h1>
        <p className={cn("mt-2 text-sm leading-relaxed", admin ? "text-admin-muted" : "text-ink-soft")}>
          {admin
            ? "Rola ADMIN nie powstaje przy rejestracji. Serwer sprawdza uprawnienia."
            : "Zaloguj się albo załóż konto. Zawsze dostajesz shell dziecka."}
        </p>

        {!authEnabled ? (
          <p className="mt-6 text-sm">Logowanie jest wyłączone.</p>
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  variant={admin ? "adminLine" : "paper"}
                  className="w-full"
                  onClick={() =>
                    signIn(p.providerId, {
                      callbackURL: admin ? "/admin" : "/app",
                      errorCallbackURL: "/login",
                    })
                  }
                >
                  Kontynuuj przez {p.label}
                </Button>
              ))}
            </div>

            <form onSubmit={onEmail} className="mt-6 space-y-3">
              <div>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <TextField
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={admin ? "bg-admin-raised text-admin-fg" : undefined}
                  required
                />
              </div>
              <div>
                <FieldLabel htmlFor="password">Hasło</FieldLabel>
                <TextField
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={admin ? "bg-admin-raised text-admin-fg" : undefined}
                  required
                />
              </div>
              {error ? <p className="text-sm text-berry">{error}</p> : null}
              <Button type="submit" variant={admin ? "admin" : "honey"} className="w-full" disabled={busy}>
                {busy ? "Logowanie…" : "Zaloguj"}
              </Button>
            </form>

            {admin ? null : (
              <p className="mt-6 text-sm text-ink-soft">
                Nie masz jeszcze nory?{" "}
                <Link to="/register" className="font-bold text-forest underline-offset-4 hover:underline">
                  Załóż konto dziecka
                </Link>
              </p>
            )}
          </>
        )}

        <Link to="/" className={cn("mt-8 text-sm", admin ? "text-admin-muted" : "text-ink-soft")}>
          ← Wróć na start
        </Link>
      </main>
    </div>
  );
}
