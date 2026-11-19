import type { VaultBlob } from "./vault";

export type SyncListener = (blob: VaultBlob) => void;

const CHANNEL = "prism-mail-settings-sync";

/** Near-real-time fan-out. BroadcastChannel when available; local listeners always. */
export function createRealtimeBus(): {
  publish: (blob: VaultBlob) => void;
  subscribe: (listener: SyncListener) => () => void;
} {
  const locals = new Set<SyncListener>();
  const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL) : null;
  if (channel) {
    channel.addEventListener("message", (ev: MessageEvent) => {
      for (const listener of locals) listener(ev.data as VaultBlob);
    });
  }
  return {
    publish(blob) {
      for (const listener of locals) listener(blob);
      channel?.postMessage(blob);
    },
    subscribe(listener) {
      locals.add(listener);
      return () => {
        locals.delete(listener);
      };
    },
  };
}
