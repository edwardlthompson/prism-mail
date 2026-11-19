import { describe, expect, it, vi } from "vitest";
import { createRealtimeBus } from "./realtime";
import type { VaultBlob } from "./vault";

describe("realtime bus", () => {
  it("publishes vault blobs to subscribers", () => {
    const bus = createRealtimeBus();
    const spy = vi.fn();
    const unsub = bus.subscribe(spy);
    const blob: VaultBlob = {
      iv: "a",
      ciphertext: "b",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    bus.publish(blob);
    expect(spy).toHaveBeenCalledWith(blob);
    unsub();
  });
});
