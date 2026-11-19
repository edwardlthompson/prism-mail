import { describe, expect, it } from "vitest";
import { clearDrafts, loadDrafts, newDraft, saveDraft } from "./drafts";

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

describe("compose drafts", () => {
  it("persists a local draft stub", () => {
    const storage = memoryStorage();
    const draft = newDraft({ to: "a@b.c", subject: "Hi", body: "Hello" });
    saveDraft(draft, storage);
    expect(loadDrafts(storage)).toHaveLength(1);
    expect(loadDrafts(storage)[0]?.subject).toBe("Hi");
    clearDrafts(storage);
    expect(loadDrafts(storage)).toEqual([]);
  });
});
