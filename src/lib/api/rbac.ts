import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { AppRole } from "@/lib/rbac/roles";

export type AccessSnapshot = {
  userId: string;
  email: string | null;
  displayName: string | null;
  roles: AppRole[];
  isAdmin: boolean;
  isUser: boolean;
  canBootstrapFounder: boolean;
  engineStatus: "pending_integration" | "connected";
};

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { loadAccess } = await import("@/lib/data/queries");
    return loadAccess(context.userId);
  });

export const bootstrapFounderAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { bootstrapAdmin } = await import("@/lib/data/queries");
    return bootstrapAdmin(context.userId);
  });
