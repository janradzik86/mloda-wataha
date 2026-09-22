import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql, assertAdmin } = await import("@/lib/data/queries");
    await assertAdmin(context.userId);
    const db = await sql();
    const users = await db<{ n: number }>`select count(*)::int as n from "user"`;
    const admins = await db<{ n: number }>`select count(*)::int as n from user_roles where role = 'ADMIN'`;
    const learners = await db<{ n: number }>`select count(*)::int as n from learner_profiles`;
    const links = await db<{ n: number }>`select count(*)::int as n from family_links`;
    const songs = await db<{ n: number }>`select count(*)::int as n from song_requests`;
    const subjects = await db<{ id: string; name_pl: string }>`
      select id, name_pl from subjects order by sort_order
    `;
    return {
      users: users[0]?.n ?? 0,
      admins: admins[0]?.n ?? 0,
      learners: learners[0]?.n ?? 0,
      familyLinks: links[0]?.n ?? 0,
      songRequests: songs[0]?.n ?? 0,
      subjects,
      engine: "pending_integration" as const,
    };
  });

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql, assertAdmin } = await import("@/lib/data/queries");
    await assertAdmin(context.userId);
    const db = await sql();
    const rows = await db<{
      id: string;
      name: string;
      email: string;
      createdAt: string;
    }>`
      select id, name, email, "createdAt"::text as "createdAt"
      from "user"
      order by "createdAt" desc
      limit 100
    `;
    const roles = await db<{ user_id: string; role: string }>`
      select user_id, role from user_roles
    `;
    const byUser = new Map<string, string[]>();
    for (const r of roles) {
      const list = byUser.get(r.user_id) ?? [];
      list.push(r.role);
      byUser.set(r.user_id, list);
    }
    return rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
      roles: byUser.get(u.id) ?? [],
    }));
  });

export const listAdminSongRequests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql, assertAdmin } = await import("@/lib/data/queries");
    await assertAdmin(context.userId);
    const db = await sql();
    return db<{
      id: string;
      title: string;
      status: string;
      created_at: string;
    }>`
      select id, title, status, created_at::text
      from song_requests
      order by created_at desc
      limit 50
    `;
  });

export const listAdminFamilyLinks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql, assertAdmin } = await import("@/lib/data/queries");
    await assertAdmin(context.userId);
    const db = await sql();
    return db<{
      id: string;
      status: string;
      pairing_hint: string | null;
      created_at: string;
    }>`
      select id, status, pairing_hint, created_at::text
      from family_links
      order by created_at desc
      limit 50
    `;
  });

export const listSubjects = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const { sql } = await import("@/lib/data/queries");
    const db = await sql();
    return db<{ id: string; name_pl: string; sort_order: number }>`
      select id, name_pl, sort_order from subjects order by sort_order
    `;
  });
