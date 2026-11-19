import { emptyBundle, type MailSettingsBundle, type WhitelistRule } from "./schema";

const STORAGE_KEY = "prism.mail.settings.v1";

export type MailStore = {
  load: () => MailSettingsBundle;
  save: (bundle: MailSettingsBundle) => void;
  upsertRule: (rule: WhitelistRule) => MailSettingsBundle;
  listActiveRules: () => WhitelistRule[];
};

function deviceId(): string {
  const key = "prism.mail.deviceId";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function createMailStore(storage: Storage = localStorage): MailStore {
  function load(): MailSettingsBundle {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return emptyBundle(deviceId(), nowIso());
    try {
      return JSON.parse(raw) as MailSettingsBundle;
    } catch {
      return emptyBundle(deviceId(), nowIso());
    }
  }

  function save(bundle: MailSettingsBundle): void {
    storage.setItem(STORAGE_KEY, JSON.stringify(bundle));
    // Encrypted vault export is opt-in via sync/vault (Sprint 2); plaintext local cache remains for UX.
  }

  function upsertRule(rule: WhitelistRule): MailSettingsBundle {
    const bundle = load();
    const idx = bundle.rules.findIndex((r) => r.id === rule.id);
    const next = { ...rule, version: rule.version + (idx >= 0 ? 1 : 0), updatedAt: nowIso() };
    const rules =
      idx >= 0 ? bundle.rules.map((r, i) => (i === idx ? next : r)) : [...bundle.rules, next];
    const out = { ...bundle, rules };
    save(out);
    return out;
  }

  function listActiveRules(): WhitelistRule[] {
    return load().rules.filter((r) => r.enabled && !r.tombstone);
  }

  return { load, save, upsertRule, listActiveRules };
}
