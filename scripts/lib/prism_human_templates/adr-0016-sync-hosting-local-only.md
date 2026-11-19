# ADR-0016: Sync hosting is local-only by default

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** Prism Mail autonomous /build (privacy-first default)

## Context

Sprint 2 asked whether encrypted settings/whitelist sync should use a self-hosted server or stay local-only.

## Decision

- **Local-only** sync: AES-GCM vault on-device + same-origin / BroadcastChannel (and future local peers).
- No production sync server in the FOSS default path.
- A future hosted ciphertext relay requires a superseding ADR and explicit `[HUMAN]` approval.

## Consequences

- Multi-device sync without a server is best-effort (same browser profile / explicit key export).
- Privacy surface stays smaller; ops burden is zero for hosting.
