import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Konfiguracja</h1>
      <dl className="mt-6 space-y-4 text-sm">
        <div className="rounded-xl bg-admin-surface p-4 ring-1 ring-admin-line">
          <dt className="text-admin-muted">Nadawanie ADMIN</dt>
          <dd className="mt-1">
            Zmienne serwerowe <code>WATAHA_ADMIN_EMAILS</code> i <code>WATAHA_ADMIN_USER_IDS</code>. W podglądzie
            pierwsze konto może użyć bootstrapu założyciela.
          </dd>
        </div>
        <div className="rounded-xl bg-admin-surface p-4 ring-1 ring-admin-line">
          <dt className="text-admin-muted">Rejestracja</dt>
          <dd className="mt-1">Zawsze USER. Payload role=ADMIN jest ignorowany.</dd>
        </div>
        <div className="rounded-xl bg-admin-surface p-4 ring-1 ring-admin-line">
          <dt className="text-admin-muted">Źródło prawdy</dt>
          <dd className="mt-1">Tabela user_roles. localStorage nie autoryzuje.</dd>
        </div>
      </dl>
    </div>
  );
}
