# ADR-0013: Proton Bridge integration model

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** Prism Mail team
- **Plan alias:** ADR-0004 in product brief

## Context

Proton Mail requires local Bridge for IMAP/SMTP access to decrypted mail. The web hub cannot talk to Bridge on the user machine.

## Decision

- Desktop app hosts an optional Bridge connector (localhost IMAP/SMTP).
- Connector produces versioned deltas (new messages, flags, moves, deletes + tombstones) into the shared sync layer.
- Fresh Proton mail arrives only while the connector is running.
- Web and mobile may display previously synced Proton mail and queue outbound changes when the connector is offline.

## Consequences

- Not a full replacement for Proton official clients for advanced Bridge-dependent features.
- Connector remains optional and small in surface area.
