import { describe, expect, it, vi } from "vitest";
import { createMailShell } from "./MailShell";
import type { WhitelistRule } from "./schema";
import { createMailStore } from "./store";

vi.mock("../i18n", () => ({
  t: (key: string) => (key === "mail.rules.some" ? "{count} rules" : key),
}));

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

describe("createMailShell", () => {
  it("renders three panes with empty states and blocked images hint", () => {
    const root = document.createElement("div");
    createMailShell(root, { store: createMailStore(memoryStorage()) });
    expect(root.querySelector("[data-mail-shell]")).toBeTruthy();
    expect(root.querySelector(".pm-pane-folders")).toBeTruthy();
    expect(root.querySelector(".pm-pane-list")).toBeTruthy();
    expect(root.querySelector(".pm-pane-reading")).toBeTruthy();
    expect(root.querySelector("[data-testid='mail-list-empty']")).toBeTruthy();
    expect(root.querySelector("[data-testid='mail-privacy-hint']")?.textContent).toContain(
      "mail.privacy.images_blocked",
    );
  });

  it("shows active rule count from the store", () => {
    const storage = memoryStorage();
    const store = createMailStore(storage);
    const rule: WhitelistRule = {
      id: "r1",
      version: 1,
      deviceId: "d",
      updatedAt: "2026-01-01T00:00:00.000Z",
      tombstone: false,
      type: "image_allow",
      subjectKind: "domain",
      subject: "example.com",
      enabled: true,
    };
    store.upsertRule(rule);
    const root = document.createElement("div");
    createMailShell(root, { store });
    expect(root.querySelector("[data-testid='mail-rules-count']")?.textContent).toBe("1 rules");
  });
});
