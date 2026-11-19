import type { MailAccount } from "./types";

const KEY = "prism.mail.account.v1";

export function loadAccount(storage: Storage = localStorage): MailAccount | null {
  const raw = storage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MailAccount;
  } catch {
    return null;
  }
}

export function saveAccount(account: MailAccount, storage: Storage = localStorage): void {
  storage.setItem(KEY, JSON.stringify(account));
}

export function clearAccount(storage: Storage = localStorage): void {
  storage.removeItem(KEY);
}
