import { createFileRoute } from "@tanstack/react-router";
import { SUBJECTS } from "@/lib/subjects";

export const Route = createFileRoute("/admin/content")({ component: AdminContent });

function AdminContent() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold">Treści edukacyjne</h1>
      <p className="mt-1 text-sm text-admin-muted">
        Architektura przedmiotów jest w bazie. Lekcje i quizy dołożymy po ETAPIE 1.
      </p>
      <ul className="mt-6 grid gap-2 md:grid-cols-2">
        {SUBJECTS.map((s) => (
          <li key={s.id} className="rounded-xl bg-admin-surface px-4 py-3 ring-1 ring-admin-line">
            <p className="font-medium">{s.namePl}</p>
            <p className="text-xs text-admin-muted">{s.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
