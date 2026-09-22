import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { roleFromRegistration } from "../rbac/roles.ts";

describe("local storage is not RBAC", () => {
  it("spoofed role in a payload is ignored", () => {
    const spoof = { role: "ADMIN", localStorage: "ADMIN" };
    assert.equal(roleFromRegistration(spoof), "USER");
  });
});
