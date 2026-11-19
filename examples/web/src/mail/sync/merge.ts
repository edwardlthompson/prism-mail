import type { Versioned } from "../schema";

/** Merge versioned objects; higher version wins; tombstones stick. */
export function mergeVersioned<T extends Versioned>(local: T[], remote: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of [...local, ...remote]) {
    const prev = map.get(item.id);
    if (!prev || item.version > prev.version) {
      map.set(item.id, item);
      continue;
    }
    if (item.version === prev.version && item.tombstone && !prev.tombstone) {
      map.set(item.id, item);
    }
  }
  return [...map.values()].filter((item) => !item.tombstone || item.version > 0);
}

export function activeOnly<T extends Versioned>(items: T[]): T[] {
  return items.filter((item) => !item.tombstone);
}
