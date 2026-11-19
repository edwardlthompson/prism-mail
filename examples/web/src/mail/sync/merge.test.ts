import { describe, expect, it } from "vitest";
import type { WhitelistRule } from "../schema";
import { activeOnly, mergeVersioned } from "./merge";

function rule(partial: Partial<WhitelistRule>): WhitelistRule {
  return {
    id: "r1",
    version: 1,
    deviceId: "a",
    updatedAt: "2026-01-01T00:00:00.000Z",
    tombstone: false,
    type: "image_allow",
    subjectKind: "sender",
    subject: "a@b.c",
    enabled: true,
    ...partial,
  };
}

describe("mergeVersioned", () => {
  it("prefers higher version and keeps tombstones", () => {
    const local = [rule({ version: 1 })];
    const remote = [rule({ version: 2, subject: "c@d.e" })];
    const merged = mergeVersioned(local, remote);
    expect(merged[0]?.subject).toBe("c@d.e");
    const deleted = mergeVersioned(merged, [rule({ version: 3, tombstone: true })]);
    expect(activeOnly(deleted)).toHaveLength(0);
  });
});
