import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listAdminSongRequests } from "@/lib/api/admin";

export const Route = createFileRoute("/admin/songs")({ component: AdminSongs });

function AdminSongs() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listAdminSongRequests>>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listAdminSongRequests()
      .then(setRows)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "FORBIDDEN"));
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Zgłoszenia piosenek</h1>
      <p className="mt-1 text-sm text-admin-muted">Studio dostaje tylko to, co zatwierdzi rodzic.</p>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <ul className="mt-6 space-y-2">
        {rows.length === 0 ? <li className="text-sm text-admin-muted">Brak zgłoszeń.</li> : null}
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl bg-admin-surface px-4 py-3 ring-1 ring-admin-line">
            <p className="font-medium">{r.title}</p>
            <p className="text-xs text-admin-muted">{r.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
