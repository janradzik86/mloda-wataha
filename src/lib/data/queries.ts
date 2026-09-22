import { getSql, dbSource } from "@/lib/db";
import { ForbiddenError } from "@/lib/rbac/errors";
import { roleFromRegistration, type AppRole } from "@/lib/rbac/roles";
import type { ExplainStyle } from "@/lib/young-wilk/contract";
import { createYoungWolfEngine } from "@/lib/young-wilk/adapter";
import { ENGINE_SOURCE, type SchoolSubject } from "@/lib/young-wilk/contract";
import { mintPairingCode, normalizePairingCode } from "@/lib/family/pairing";
import type { LearnerProfileRow } from "@/lib/api/learner";
import type { AccessSnapshot } from "@/lib/api/rbac";

export { dbSource };

export async function sql() {
  return getSql();
}

export function newId(prefix: string) {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return `${prefix}_${hex}`;
}

export async function hashPairingCode(code: string) {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(normalizePairingCode(code)).digest("hex");
}

export { mintPairingCode };

function adminEmails(): string[] {
  const raw = typeof process !== "undefined" ? process.env.WATAHA_ADMIN_EMAILS : undefined;
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function adminUserIds(): string[] {
  const raw = typeof process !== "undefined" ? process.env.WATAHA_ADMIN_USER_IDS : undefined;
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function listRoles(userId: string): Promise<AppRole[]> {
  const db = await getSql();
  const rows = await db<{ role: string }>`select role from user_roles where user_id = ${userId}`;
  return rows.map((r) => r.role as AppRole);
}

export async function assertAdmin(userId: string) {
  const roles = await listRoles(userId);
  if (!roles.includes("ADMIN")) throw new ForbiddenError("FORBIDDEN");
}

async function grantRole(userId: string, role: AppRole, grantedBy: string) {
  const db = await getSql();
  await db`
    insert into user_roles (user_id, role, granted_by)
    values (${userId}, ${role}, ${grantedBy})
    on conflict (user_id, role) do nothing
  `;
}

async function readAuthUser(userId: string): Promise<{ name: string | null; email: string | null }> {
  const db = await getSql();
  const users = await db<{ name: string; email: string }>`
    select name, email from "user" where id = ${userId}
  `;
  return { name: users[0]?.name ?? null, email: users[0]?.email ?? null };
}

export async function ensureMembership(userId: string, email: string | null) {
  const existing = await listRoles(userId);
  if (!existing.includes("USER")) {
    await grantRole(userId, roleFromRegistration({ role: "ADMIN", email }), "system");
  }
  const allowEmail = email ? adminEmails().includes(email.toLowerCase()) : false;
  const allowId = adminUserIds().includes(userId);
  if (allowEmail || allowId) {
    await grantRole(userId, "ADMIN", "allowlist");
  }
  const db = await getSql();
  const profile = await db<{ user_id: string }>`select user_id from learner_profiles where user_id = ${userId}`;
  if (profile.length === 0) {
    const authUser = await readAuthUser(userId);
    await db`
      insert into learner_profiles (user_id, display_name)
      values (${userId}, ${authUser.name ?? ""})
      on conflict (user_id) do nothing
    `;
    await db`
      insert into lollipops (user_id, balance)
      values (${userId}, 0)
      on conflict (user_id) do nothing
    `;
  }
}

export async function loadAccess(userId: string): Promise<AccessSnapshot> {
  const authUser = await readAuthUser(userId);
  await ensureMembership(userId, authUser.email);
  const roles = await listRoles(userId);
  const db = await getSql();
  const adminCount = await db<{ n: number }>`select count(*)::int as n from user_roles where role = 'ADMIN'`;
  return {
    userId,
    email: authUser.email,
    displayName: authUser.name,
    roles,
    isAdmin: roles.includes("ADMIN"),
    isUser: roles.includes("USER"),
    canBootstrapFounder: dbSource === "pglite" && (adminCount[0]?.n ?? 0) === 0,
    engineStatus: "pending_integration",
  };
}

export async function bootstrapAdmin(userId: string): Promise<AccessSnapshot> {
  if (dbSource !== "pglite") throw new ForbiddenError("Założyciel tylko w podglądzie.");
  const db = await getSql();
  const adminCount = await db<{ n: number }>`select count(*)::int as n from user_roles where role = 'ADMIN'`;
  if ((adminCount[0]?.n ?? 0) > 0) throw new ForbiddenError("Rola ADMIN jest już nadana.");
  await ensureMembership(userId, (await readAuthUser(userId)).email);
  await grantRole(userId, "ADMIN", "founder-bootstrap");
  return loadAccess(userId);
}

function asList(v: string[] | string | null | undefined): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function loadLearnerProfile(userId: string): Promise<LearnerProfileRow> {
  const db = await getSql();
  const rows = await db<{
    user_id: string;
    display_name: string;
    age: number | null;
    school_class: number | null;
    preferred_style: ExplainStyle;
    learning_pace: string;
    strong_topics: string[] | string | null;
    review_topics: string[] | string | null;
    last_school_topics: string[] | string | null;
    last_subject: string | null;
  }>`
    select user_id, display_name, age, school_class, preferred_style, learning_pace,
           strong_topics, review_topics, last_school_topics, last_subject
    from learner_profiles
    where user_id = ${userId}
  `;
  const candy = await db<{ balance: number }>`select balance from lollipops where user_id = ${userId}`;
  const row = rows[0];
  if (!row) {
    return {
      userId,
      displayName: "",
      age: null,
      schoolClass: null,
      preferredStyle: "simple",
      learningPace: "steady",
      strongTopics: [],
      reviewTopics: [],
      lastSchoolTopics: [],
      lastSubject: null,
      lollipopBalance: candy[0]?.balance ?? 0,
    };
  }
  return {
    userId: row.user_id,
    displayName: row.display_name,
    age: row.age,
    schoolClass: row.school_class,
    preferredStyle: row.preferred_style,
    learningPace: row.learning_pace,
    strongTopics: asList(row.strong_topics),
    reviewTopics: asList(row.review_topics),
    lastSchoolTopics: asList(row.last_school_topics),
    lastSubject: row.last_subject,
    lollipopBalance: candy[0]?.balance ?? 0,
  };
}

export async function askWolf(userId: string, text: string, mode: "chat" | "school-help", subject?: SchoolSubject) {
  const profile = await loadLearnerProfile(userId);
  const engine = createYoungWolfEngine({
    learnerId: profile.userId,
    age: profile.age ?? 10,
    schoolClass: profile.schoolClass ?? undefined,
    preferredStyle: profile.preferredStyle,
    difficultTopics: profile.reviewTopics,
    strongTopics: profile.strongTopics,
  });
  if (mode === "school-help") {
    const reply = engine.schoolHelp(text, { subject, saidDidNotUnderstand: true });
    if (text.trim()) {
      const next = [text.trim().slice(0, 120), ...profile.lastSchoolTopics.filter((t) => t !== text.trim())].slice(0, 8);
      const db = await getSql();
      await db.query(
        `update learner_profiles set last_school_topics = $1::text[], last_subject = coalesce($2, last_subject), updated_at = now() where user_id = $3`,
        [next, subject ?? null, userId],
      );
    }
    return { source: ENGINE_SOURCE, kind: "school-help" as const, reply };
  }
  const style = engine.adaptFromPhrase(text);
  const tutor = engine.explain("pending", style);
  tutor.text = text.trim().length === 0 ? "Cześć. Jestem Młody Wilk. Co dziś było w szkole?" : tutor.text;
  return {
    source: ENGINE_SOURCE,
    kind: "chat" as const,
    reply: { understoodRequest: Boolean(text.trim()), needsClarification: true, reply: tutor },
  };
}
