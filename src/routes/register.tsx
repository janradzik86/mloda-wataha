import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { FieldLabel, TextField } from "@/components/ui/field";
import { ForestBackdrop, WolfMark } from "@/components/wolf-mark";
import { patchLearnerProfile } from "@/lib/api/learner";
import { writeLocalLearner } from "@/lib/storage/local-profile";
import { roleFromRegistration } from "@/lib/rbac/roles";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("10");
  const [klass, setKlass] = useState("4");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.body.dataset.shell = "child";
    return () => {
      delete document.body.dataset.shell;
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const ignored = roleFromRegistration({ role: "ADMIN" });
    if (ignored !== "USER") {
      setError("Rejestracja nie nadaje roli ADMIN.");
      setBusy(false);
      return;
    }
    const { error: err } = await authClient.signUp.email({
      email,
      password,
      name,
    });
    if (err) {
      setError(err.message ?? "Nie udało się założyć konta.");
      setBusy(false);
      return;
    }
    const ageN = Number(age);
    const classN = Number(klass);
    writeLocalLearner({
      displayName: name,
      age: Number.isFinite(ageN) ? ageN : null,
      schoolClass: Number.isFinite(classN) ? classN : null,
    });
    try {
      await patchLearnerProfile({
        data: {
          displayName: name,
          age: Number.isFinite(ageN) ? ageN : null,
          schoolClass: Number.isFinite(classN) ? classN : null,
        },
      });
    } catch {
      /* local copy already saved */
    }
    setBusy(false);
    navigate({ to: "/app" });
  }

  return (
    <div className="glade relative min-h-dvh bg-paper text-ink">
      <ForestBackdrop />
      <main className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-12">
        <WolfMark size={56} />
        <h1 className="font-display mt-4 text-3xl font-semibold text-forest">Nowa nora</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Konto dziecka. Roli ADMIN nie da się wybrać — serwer zawsze zapisuje USER.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div>
            <FieldLabel htmlFor="name">Imię</FieldLabel>
            <TextField id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="age">Wiek</FieldLabel>
              <TextField id="age" type="number" min={6} max={18} value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
              <FieldLabel htmlFor="klass">Klasa</FieldLabel>
              <TextField id="klass" type="number" min={1} max={8} value={klass} onChange={(e) => setKlass(e.target.value)} />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="email">E-mail opiekuna</FieldLabel>
            <TextField id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <FieldLabel htmlFor="password">Hasło</FieldLabel>
            <TextField
              id="password"
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-berry">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Tworzenie…" : "Wejdź do watahy"}
          </Button>
        </form>
        <Link to="/login" search={{ intent: "user" }} className="mt-6 text-sm text-ink-soft">
          Mam już konto
        </Link>
      </main>
    </div>
  );
}
