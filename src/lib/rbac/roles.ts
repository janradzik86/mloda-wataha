export const APP_ROLES = ["ADMIN", "USER", "PARENT", "CHILD", "TEACHER", "MODERATOR"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const STAGE_ONE_ROLES = ["ADMIN", "USER"] as const;
export type StageOneRole = (typeof STAGE_ONE_ROLES)[number];

export function isAppRole(value: string): value is AppRole {
  return (APP_ROLES as readonly string[]).includes(value);
}

/** Registration / client payloads may never promote to ADMIN. */
export function roleFromRegistration(_payload: unknown): "USER" {
  return "USER";
}

export const PERMISSIONS = {
  USER: [
    "user.self.read",
    "user.self.write",
    "user.lessons.read",
    "user.wilk.ask",
    "user.requests.create",
    "family.link.use",
  ],
  ADMIN: [
    "admin.content.write",
    "admin.knowledge.write",
    "admin.rewards.configure",
    "admin.users.read",
    "admin.bridge.review",
    "admin.system.configure",
  ],
} as const;
