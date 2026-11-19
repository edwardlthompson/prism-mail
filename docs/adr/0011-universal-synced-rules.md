# ADR-0011: Universal synced settings and whitelist rules

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** Prism Mail team
- **Plan alias:** ADR-0002 in product brief

## Context

Allow-image / trust-link decisions must propagate to every client. Ad-hoc per-device prefs would diverge.

## Decision

Settings and whitelist/allow rules are first-class versioned objects in the shared encrypted sync layer.

Rule fields: identifier, type (`image_allow` | `link_trust` | other), subject (sender or domain), version, last-changed device, tombstone flag.

Synced objects also include display prefs, notification prefs, and default privacy behavior.

## Consequences

- Schema lives in `docs/specs/settings-whitelist-schema.md` and TypeScript types under `examples/web/src/mail/`.
- Sprint 2 implements encrypted multi-device propagation; Sprint 0 ships local persistence stub only.
