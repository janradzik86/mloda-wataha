import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { SessionGate } from "@/components/auth/gate";

export const Route = createFileRoute("/admin")({
  component: () => (
    <SessionGate need="ADMIN">
      {() => (
        <AdminShell>
          <Outlet />
        </AdminShell>
      )}
    </SessionGate>
  ),
});
