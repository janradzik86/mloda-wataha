import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { describe, it } from "node:test";
import { roleFromRegistration, isAppRole } from "./roles.ts";
import { mintPairingCode, normalizePairingCode } from "../family/pairing.ts";

function hashPairingCode(code: string) {
  return createHash("sha256").update(normalizePairingCode(code)).digest("hex");
}

describe("RBAC", () => {
  it("registration never returns ADMIN", () => {
    assert.equal(roleFromRegistration({ role: "ADMIN" }), "USER");
    assert.equal(roleFromRegistration({ role: "admin" }), "USER");
    assert.equal(roleFromRegistration(undefined), "USER");
  });

  it("knows stage-one roles", () => {
    assert.equal(isAppRole("USER"), true);
    assert.equal(isAppRole("ADMIN"), true);
    assert.equal(isAppRole("superuser"), false);
  });
});

describe("Family Bridge pairing codes", () => {
  it("mints NNN-WILK codes", () => {
    const code = mintPairingCode();
    assert.match(code, /^\d{3}-WILK$/);
  });

  it("normalizes codes case-insensitively", () => {
    assert.equal(hashPairingCode("742-wilk"), hashPairingCode("742-WILK"));
  });
});
