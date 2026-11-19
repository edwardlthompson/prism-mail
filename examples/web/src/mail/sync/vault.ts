import type { MailSettingsBundle } from "../schema";
import { decryptJson, deriveKey, encryptJson, randomSalt } from "./crypto";
import { mergeVersioned } from "./merge";

const VAULT_KEY = "prism.mail.vault.v1";
const SALT_KEY = "prism.mail.vault.salt";

export type VaultBlob = {
  iv: string;
  ciphertext: string;
  updatedAt: string;
};

export async function exportEncryptedBundle(
  passphrase: string,
  bundle: MailSettingsBundle,
  storage: Storage = localStorage,
): Promise<VaultBlob> {
  const salt = loadOrCreateSalt(storage);
  const key = await deriveKey(passphrase, salt);
  const enc = await encryptJson(key, bundle);
  const blob: VaultBlob = { ...enc, updatedAt: new Date().toISOString() };
  storage.setItem(VAULT_KEY, JSON.stringify(blob));
  return blob;
}

export async function importEncryptedBundle(
  passphrase: string,
  blob: VaultBlob,
  local: MailSettingsBundle,
  storage: Storage = localStorage,
): Promise<MailSettingsBundle> {
  const salt = loadOrCreateSalt(storage);
  const key = await deriveKey(passphrase, salt);
  const remote = await decryptJson<MailSettingsBundle>(key, blob.iv, blob.ciphertext);
  return {
    display: mergeOne(local.display, remote.display),
    privacy: mergeOne(local.privacy, remote.privacy),
    rules: mergeVersioned(local.rules, remote.rules),
  };
}

function mergeOne<T extends { version: number; tombstone: boolean }>(a: T, b: T): T {
  if (b.version > a.version) return b;
  if (b.version === a.version && b.tombstone && !a.tombstone) return b;
  return a;
}

function loadOrCreateSalt(storage: Storage): Uint8Array {
  const existing = storage.getItem(SALT_KEY);
  if (existing) {
    const bin = atob(existing);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
    return out;
  }
  const salt = randomSalt();
  let s = "";
  for (const b of salt) s += String.fromCharCode(b);
  storage.setItem(SALT_KEY, btoa(s));
  return salt;
}

export function readVaultBlob(storage: Storage = localStorage): VaultBlob | null {
  const raw = storage.getItem(VAULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VaultBlob;
  } catch {
    return null;
  }
}
