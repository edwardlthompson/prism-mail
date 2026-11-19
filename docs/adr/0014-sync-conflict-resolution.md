# ADR-0014: Sync conflict resolution (logical clocks + tombstones)

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** Prism Mail team
- **Plan alias:** ADR-0005 in product brief

## Context

Mail flags and settings/rules change from multiple devices. Last-write-wins without tombstones loses deletes.

## Decision

Use logical clocks (per-object version / Lamport-style counters) plus tombstones for deletes on mail flags and settings/rules. Sync layer stores ciphertext; clients merge by version, preferring higher clock and respecting tombstones.

## Consequences

- Schema includes version, deviceId, tombstone, updatedAt.
- Near-real-time updates via WebSockets (web) and push + background sync (mobile) in Sprint 2+.
