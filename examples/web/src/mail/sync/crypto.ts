/** AES-GCM helpers for settings/rules ciphertext (Sprint 2 stub). */

export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 100_000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptJson(
  key: CryptoKey,
  value: unknown,
): Promise<{ iv: string; ciphertext: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = new TextEncoder().encode(JSON.stringify(value));
  const buf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plain);
  return { iv: b64(iv), ciphertext: b64(new Uint8Array(buf)) };
}

export async function decryptJson<T>(
  key: CryptoKey,
  ivB64: string,
  ciphertextB64: string,
): Promise<T> {
  const iv = fromB64(ivB64);
  const data = fromB64(ciphertextB64);
  const buf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    data as BufferSource,
  );
  return JSON.parse(new TextDecoder().decode(buf)) as T;
}

function b64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function fromB64(value: string): Uint8Array {
  const bin = atob(value);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

export function randomSalt(bytes = 16): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(bytes));
}
