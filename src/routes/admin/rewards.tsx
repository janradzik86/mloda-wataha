import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/rewards")({ component: AdminRewards });

function AdminRewards() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Lizaki i Nora</h1>
      <p className="mt-2 text-sm text-admin-muted">
        Saldo lizaków i katalog Nory są w schemacie. Sklep i odblokowania — ETAP 3.
      </p>
      <ul className="mt-5 space-y-2 text-sm text-admin-muted">
        <li>Lizak tylko po opanowaniu tematu albo misji.</li>
        <li>Brak lootboxów, losowań i pay-to-win.</li>
        <li>Nora nie kupuje przewagi w nauce.</li>
      </ul>
    </div>
  );
}
