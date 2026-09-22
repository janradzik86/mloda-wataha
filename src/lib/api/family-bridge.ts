import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { ForbiddenError } from "@/lib/rbac/errors";

const PAIRING_TTL_MS = 1000 * 60 * 30;

export type FamilyLinkView = {
  id: string;
  status: string;
  pairingHint: string | null;
  expiresAt: string | null;
  parentUserId: string | null;
  childUserId: string | null;
};

export const getMyFamilyLink = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await import("@/lib/data/queries");
    const db = await sql();
    const rows = await db<{
      id: string;
      status: string;
      pairing_hint: string | null;
      expires_at: string | null;
      parent_user_id: string | null;
      child_user_id: string | null;
    }>`
      select id, status, pairing_hint, expires_at::text, parent_user_id, child_user_id
      from family_links
      where child_user_id = ${context.userId}
        and status in ('pending_consent', 'active', 'pending_code')
      order by created_at desc
      limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id,
      status: row.status,
      pairingHint: row.pairing_hint,
      expiresAt: row.expires_at,
      parentUserId: row.parent_user_id,
      childUserId: row.child_user_id,
    } satisfies FamilyLinkView;
  });

export const createPairingCode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql, assertAdmin, mintPairingCode, hashPairingCode, newId } = await import("@/lib/data/queries");
    await assertAdmin(context.userId);
    const db = await sql();
    const code = mintPairingCode();
    const id = newId("link");
    const expires = new Date(Date.now() + PAIRING_TTL_MS).toISOString();
    const hash = await hashPairingCode(code);
    await db`
      insert into family_links (
        id, parent_user_id, status, pairing_hash, pairing_hint, expires_at
      ) values (
        ${id}, ${context.userId}, 'pending_code', ${hash},
        ${code.slice(0, 3) + "-***"}, ${expires}
      )
    `;
    return { id, code, expiresAt: expires };
  });

export const claimPairingCode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({ code: z.string().trim().min(5).max(16) }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { sql, hashPairingCode } = await import("@/lib/data/queries");
    const db = await sql();
    const hash = await hashPairingCode(data.code);
    const rows = await db<{
      id: string;
      status: string;
      expires_at: string | null;
      child_user_id: string | null;
    }>`
      select id, status, expires_at::text, child_user_id
      from family_links
      where pairing_hash = ${hash}
      limit 1
    `;
    const row = rows[0];
    if (!row || row.status !== "pending_code") {
      throw new ForbiddenError("Ten kod nie działa.");
    }
    if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
      throw new ForbiddenError("Kod wygasł. Poproś opiekuna o nowy.");
    }
    await db`
      update family_links
      set child_user_id = ${context.userId},
          status = 'pending_consent',
          pairing_hash = null
      where id = ${row.id} and status = 'pending_code'
    `;
    return { id: row.id, status: "pending_consent" as const };
  });

export const approvePairing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ linkId: z.string() }).parse(input))
  .handler(async ({ context, data }) => {
    const { sql } = await import("@/lib/data/queries");
    const db = await sql();
    const rows = await db<{ id: string; parent_user_id: string | null; status: string }>`
      select id, parent_user_id, status from family_links where id = ${data.linkId}
    `;
    const row = rows[0];
    if (!row) throw new ForbiddenError("Nie ma takiego połączenia.");
    const roles = await db<{ role: string }>`
      select role from user_roles where user_id = ${context.userId}
    `;
    const isAdmin = roles.some((r) => r.role === "ADMIN");
    const isParent = row.parent_user_id === context.userId;
    if (!isAdmin && !isParent) throw new ForbiddenError("FORBIDDEN");
    await db`
      update family_links
      set status = 'active', activated_at = now()
      where id = ${row.id}
    `;
    return { id: row.id, status: "active" as const };
  });

export const createSongRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z
      .object({
        title: z.string().trim().min(1).max(80),
        message: z.string().trim().max(400).optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { sql, newId } = await import("@/lib/data/queries");
    const db = await sql();
    const id = newId("song");
    await db`
      insert into song_requests (id, child_user_id, title, message, status)
      values (${id}, ${context.userId}, ${data.title}, ${data.message ?? ""}, 'WAITING_FOR_PARENT')
    `;
    await db`
      insert into bridge_requests (id, child_user_id, kind, payload_json, status)
      values (
        ${newId("req")},
        ${context.userId},
        'song',
        ${JSON.stringify({ title: data.title, message: data.message ?? "" })},
        'pending_parent'
      )
    `;
    return { id, status: "WAITING_FOR_PARENT" as const };
  });

export const listMySongRequests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await import("@/lib/data/queries");
    const db = await sql();
    return db<{
      id: string;
      title: string;
      status: string;
      created_at: string;
    }>`
      select id, title, status, created_at::text
      from song_requests
      where child_user_id = ${context.userId}
      order by created_at desc
      limit 20
    `;
  });
