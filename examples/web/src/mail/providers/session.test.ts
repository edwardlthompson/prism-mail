import { describe, expect, it } from "vitest";
import { clearAccount, loadAccount, saveAccount } from "./session";
import type { MailAccount } from "./types";

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

describe("account session", () => {
  it("round-trips an account", () => {
    const storage = memoryStorage();
    const account: MailAccount = { provider: "demo", email: "a@b.c" };
    saveAccount(account, storage);
    expect(loadAccount(storage)).toEqual(account);
    clearAccount(storage);
    expect(loadAccount(storage)).toBeNull();
  });
});
