import { beforeEach, describe, expect, it } from "vitest";
import type { WhitelistRule } from "./schema";
import { createMailStore } from "./store";

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

describe("createMailStore", () => {
  let storage: Storage;

  beforeEach(() => {
    storage = memoryStorage();
  });

  it("loads empty bundle with privacy defaults", () => {
    const store = createMailStore(storage);
    const bundle = store.load();
    expect(bundle.privacy.blockRemoteImages).toBe(true);
    expect(bundle.privacy.telemetry).toBe(false);
    expect(bundle.rules).toEqual([]);
  });

  it("persists an image-allow rule", () => {
    const store = createMailStore(storage);
    const rule: WhitelistRule = {
      id: "rule-1",
      version: 1,
      deviceId: "dev",
      updatedAt: "2026-01-01T00:00:00.000Z",
      tombstone: false,
      type: "image_allow",
      subjectKind: "sender",
      subject: "news@example.com",
      enabled: true,
    };
    store.upsertRule(rule);
    expect(store.listActiveRules()).toHaveLength(1);
    expect(store.listActiveRules()[0]?.subject).toBe("news@example.com");
    const reloaded = createMailStore(storage).load();
    expect(reloaded.rules[0]?.type).toBe("image_allow");
  });
});
