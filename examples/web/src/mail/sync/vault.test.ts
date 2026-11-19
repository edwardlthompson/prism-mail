import { describe, expect, it } from "vitest";
import { emptyBundle } from "../schema";
import { exportEncryptedBundle, importEncryptedBundle } from "./vault";

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => {
      map.delete(k);
    },
    setItem: (k, v) => {
      map.set(k, v);
    },
  };
}

describe("encrypted vault", () => {
  it("round-trips a settings bundle", async () => {
    const storage = memoryStorage();
    const local = emptyBundle("dev", "2026-01-01T00:00:00.000Z");
    local.rules.push({
      id: "r1",
      version: 1,
      deviceId: "dev",
      updatedAt: "2026-01-01T00:00:00.000Z",
      tombstone: false,
      type: "image_allow",
      subjectKind: "domain",
      subject: "example.com",
      enabled: true,
    });
    const blob = await exportEncryptedBundle("test-pass", local, storage);
    const other = emptyBundle("other", "2026-01-02T00:00:00.000Z");
    const merged = await importEncryptedBundle("test-pass", blob, other, storage);
    expect(merged.rules.some((r) => r.subject === "example.com")).toBe(true);
  });
});
