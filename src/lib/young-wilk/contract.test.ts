import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ageBandFromAge, CHILD_DECISION_COPY } from "./contract.ts";

describe("Young Wolf contract", () => {
  it("maps age bands", () => {
    assert.equal(ageBandFromAge(8), "7-9");
    assert.equal(ageBandFromAge(11), "10-12");
    assert.equal(ageBandFromAge(14), "13-15");
    assert.equal(ageBandFromAge(16), "16+");
  });

  it("never exposes scores in child copy", () => {
    for (const text of Object.values(CHILD_DECISION_COPY)) {
      assert.equal(/%/.test(text), false);
      assert.equal(/nie zda/.test(text), false);
      assert.equal(/ocena/.test(text), false);
    }
  });
});
