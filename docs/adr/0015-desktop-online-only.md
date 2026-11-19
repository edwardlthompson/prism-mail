# ADR-0015: Desktop online-only mailbox policy

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** Prism Mail team
- **Plan alias:** ADR-0006 in product brief

## Context

Users asked for desktop apps on Windows, Linux, and macOS that access remote hub data and do not download mailboxes for offline use.

## Decision

- Desktop clients (Tauri 2) are full UI clients of the hub/sync layer.
- Message bodies and attachments are fetched on demand while online.
- No offline mailbox download or durable local mail store for general reading.
- Ephemeral session cache for UX (current thread, open message) is allowed and cleared on quit or short TTL.
- Toolkit: Tauri 2 for Win/Mac/Linux (Sprint 3).

## Consequences

- Offline desktop shows a clear unavailable state; no silent stale mailbox.
- Distinct from mobile, which may use platform-appropriate caches for push UX (documented when mobile ships).
