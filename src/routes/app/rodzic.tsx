import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldLabel, TextField } from "@/components/ui/field";
import { claimPairingCode, getMyFamilyLink } from "@/lib/api/family-bridge";

export const Route = createFileRoute("/app/rodzic")({ component: ParentPage });

const STATUS_PL: Record<string, string> = {
  pending_code: "Kod czeka",
  pending_consent: "Opiekun musi potwierdzić",
  active: "Połączeni",
  revoked: "Rozłączono",
};

function ParentPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyFamilyLink()
      .then((link) => setStatus(link?.status ?? null))
      .catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="font-display text-3xl font-semibold text-forest">Połącz z opiekunem</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Rodzic w Polskiej Watasze wybiera „Dodaj Młodego Wilka” i dostaje kod, na przykład 742-WILK. Wpisz go tutaj.
      </p>
      {status ? (
        <p className="mt-4 rounded-2xl bg-mist px-4 py-3 font-bold text-forest">
          Status: {STATUS_PL[status] ?? status}
        </p>
      ) : null}
      <form
        className="mt-5 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          try {
            const res = await claimPairingCode({ data: { code } });
            setStatus(res.status);
            setCode("");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Ten kod nie działa.");
          }
        }}
      >
        <FieldLabel htmlFor="code">Kod watahy</FieldLabel>
        <TextField
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="742-WILK"
          className="font-display tracking-[0.2em]"
        />
        {error ? <p className="text-sm text-berry">{error}</p> : null}
        <Button type="submit">Połącz</Button>
      </form>
    </div>
  );
}
