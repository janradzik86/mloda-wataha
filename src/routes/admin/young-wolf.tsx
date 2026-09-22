import { createFileRoute } from "@tanstack/react-router";
import { ENGINE_SOURCE } from "@/lib/young-wilk/contract";

export const Route = createFileRoute("/admin/young-wolf")({ component: AdminWolf });

function AdminWolf() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Młody Wilk</h1>
      <p className="mt-2 text-sm leading-relaxed text-admin-muted">
        Aplikacja nie zawiera drugiego silnika. Adapter czeka na merge brancha ChatGPT.
      </p>
      <dl className="mt-6 space-y-3 rounded-2xl bg-admin-surface p-5 text-sm ring-1 ring-admin-line">
        <div>
          <dt className="text-admin-muted">Status</dt>
          <dd className="font-medium">{ENGINE_SOURCE.status}</dd>
        </div>
        <div>
          <dt className="text-admin-muted">Branch</dt>
          <dd className="font-medium">{ENGINE_SOURCE.branch}</dd>
        </div>
        <div>
          <dt className="text-admin-muted">PR</dt>
          <dd>
            <a className="text-admin-accent underline-offset-4 hover:underline" href={ENGINE_SOURCE.pullRequest}>
              {ENGINE_SOURCE.pullRequest}
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
