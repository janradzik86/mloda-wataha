import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminOverview } from "@/lib/api/admin";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminOverview>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminOverview()
      .then(setData)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "FORBIDDEN");
      });
  }, []);

  if (error) {
    return <p className="text-sm text-red-300">Serwer odrzucił dostęp: {error}</p>;
  }
  if (!data) return <p className="text-sm text-admin-muted">Ładowanie pulpitów…</p>;

  const cards = [
    ["Użytkownicy", data.users],
    ["ADMIN", data.admins],
    ["Profile nauki", data.learners],
    ["Family Bridge", data.familyLinks],
    ["Piosenki", data.songRequests],
  ] as const;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold">System</h1>
      <p className="mt-1 text-sm text-admin-muted">
        Młody Wilk: {data.engine === "pending_integration" ? "oczekuje na integrację silnika" : "podłączony"}.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {cards.map(([label, n]) => (
          <div key={label} className="rounded-2xl bg-admin-surface p-4 ring-1 ring-admin-line">
            <p className="text-xs text-admin-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{n}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl bg-admin-surface p-5 ring-1 ring-admin-line">
        <h2 className="text-sm font-semibold">Przedmioty</h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-admin-muted md:grid-cols-5">
          {data.subjects.map((s) => (
            <li key={s.id}>{s.name_pl}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
