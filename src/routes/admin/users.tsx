import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listAdminUsers } from "@/lib/api/admin";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

function AdminUsers() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listAdminUsers>>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listAdminUsers()
      .then(setRows)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "FORBIDDEN"));
  }, []);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold">Użytkownicy</h1>
      <p className="mt-1 text-sm text-admin-muted">Role z bazy. Bez szczegółów nauki dziecka.</p>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-admin-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-admin-surface text-admin-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Imię</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t border-admin-line">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-admin-muted">{u.email}</td>
                <td className="px-4 py-3">{u.roles.join(", ") || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
