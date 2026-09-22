import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { approvePairing, createPairingCode } from "@/lib/api/family-bridge";
import { listAdminFamilyLinks } from "@/lib/api/admin";

export const Route = createFileRoute("/admin/bridge")({ component: AdminBridge });

function AdminBridge() {
  const [code, setCode] = useState<string | null>(null);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listAdminFamilyLinks>>>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setRows(await listAdminFamilyLinks());
  }

  useEffect(() => {
    refresh().catch((err: unknown) => setError(err instanceof Error ? err.message : "FORBIDDEN"));
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Family Bridge</h1>
      <p className="mt-2 text-sm leading-relaxed text-admin-muted">
        Kontrakt API, nie osobna aplikacja. Kod parowania powinien powstawać w Polskiej Watasze. Tutaj jest
        generator testowy, żeby ETAP 1 dało się sprawdzić bez dorosłej aplikacji.
      </p>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <Button
        variant="admin"
        className="mt-5"
        onClick={async () => {
          const minted = await createPairingCode();
          setCode(minted.code);
          await refresh();
        }}
      >
        Wystaw kod testowy
      </Button>
      {code ? (
        <p className="mt-4 rounded-xl bg-admin-raised px-4 py-3 font-mono text-2xl tracking-[0.2em]">{code}</p>
      ) : null}
      <ul className="mt-6 space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-xl bg-admin-surface px-4 py-3 ring-1 ring-admin-line">
            <div>
              <p className="text-sm">{r.status}</p>
              <p className="text-xs text-admin-muted">{r.pairing_hint ?? r.id}</p>
            </div>
            {r.status === "pending_consent" ? (
              <Button
                size="sm"
                variant="adminLine"
                onClick={async () => {
                  await approvePairing({ data: { linkId: r.id } });
                  await refresh();
                }}
              >
                Zatwierdź
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
