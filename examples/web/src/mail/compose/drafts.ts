export type ComposeDraft = {
  id: string;
  to: string;
  subject: string;
  body: string;
  createdAt: string;
};

const KEY = "prism.mail.drafts.v1";

export function loadDrafts(storage: Storage = localStorage): ComposeDraft[] {
  const raw = storage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ComposeDraft[];
  } catch {
    return [];
  }
}

export function saveDraft(draft: ComposeDraft, storage: Storage = localStorage): ComposeDraft[] {
  const next = [draft, ...loadDrafts(storage).filter((d) => d.id !== draft.id)];
  storage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearDrafts(storage: Storage = localStorage): void {
  storage.removeItem(KEY);
}

export function newDraft(partial: Partial<ComposeDraft> = {}): ComposeDraft {
  return {
    id: crypto.randomUUID(),
    to: "",
    subject: "",
    body: "",
    createdAt: new Date().toISOString(),
    ...partial,
  };
}
