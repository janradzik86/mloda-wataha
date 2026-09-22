import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ChildShell } from "@/components/child/child-shell";
import { SessionGate } from "@/components/auth/gate";

export const Route = createFileRoute("/app")({
  component: () => (
    <SessionGate need="USER">
      {() => (
        <ChildShell>
          <Outlet />
        </ChildShell>
      )}
    </SessionGate>
  ),
});
