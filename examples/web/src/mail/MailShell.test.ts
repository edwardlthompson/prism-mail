import { describe, expect, it, vi } from "vitest";
import { createMailShell } from "./MailShell";
import { createDemoProvider } from "./providers/demoProvider";
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
    expect(root.querySelector("[data-testid='mail-connect']")).toBeTruthy();
  });

  it("connects via demo provider and lists messages", async () => {
    const root = document.createElement("div");
    createMailShell(root, {
      store: createMailStore(memoryStorage()),
      provider: createDemoProvider(),
    });
    root.querySelector<HTMLButtonElement>("[data-mail-connect]")?.click();
    await vi.waitFor(() => {
      expect(root.querySelector("[data-testid='mail-list']")).toBeTruthy();
    });
    expect(root.querySelectorAll(".pm-msg").length).toBeGreaterThan(0);
    expect(root.querySelector("[data-testid='mail-account']")?.textContent).toContain("demo@");
  });

  it("opens a message with remote images blocked", async () => {
    const root = document.createElement("div");
    createMailShell(root, {
      store: createMailStore(memoryStorage()),
      provider: createDemoProvider(),
    });
    root.querySelector<HTMLButtonElement>("[data-mail-connect]")?.click();
    await vi.waitFor(() => {
      expect(root.querySelector(".pm-msg")).toBeTruthy();
    });
    root.querySelector<HTMLButtonElement>(".pm-msg")?.click();
    await vi.waitFor(() => {
      expect(root.querySelector("[data-testid='mail-reading-body']")).toBeTruthy();
    });
    expect(root.querySelector("[data-pm-blocked]")).toBeTruthy();
    expect(root.querySelector("[data-testid='mail-blocked-images']")?.textContent).toContain(
      "mail.privacy.blocked_count",
    );
  });

  it("opens compose stub and persists a draft", async () => {
    const root = document.createElement("div");
    createMailShell(root, {
      store: createMailStore(memoryStorage()),
      provider: createDemoProvider(),
    });
    root.querySelector<HTMLButtonElement>("[data-testid='mail-compose-open']")?.click();
    await vi.waitFor(() => {
      expect(root.querySelector("[data-testid='mail-compose']")).toBeTruthy();
    });
    const form = root.querySelector<HTMLFormElement>("[data-testid='mail-compose']");
    expect(form).toBeTruthy();
    form!.querySelector<HTMLInputElement>("[data-testid='mail-compose-to']")!.value = "a@b.c";
    form!.querySelector<HTMLInputElement>("[data-testid='mail-compose-subject']")!.value = "Hi";
    form!.querySelector<HTMLTextAreaElement>("[data-testid='mail-compose-body']")!.value = "Hello";
    form!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await vi.waitFor(() => {
      expect(root.querySelector("[data-testid='mail-draft-note']")).toBeTruthy();
    });
  });
});
