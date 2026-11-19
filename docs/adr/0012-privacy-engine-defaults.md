# ADR-0012: Privacy engine defaults (FairEmail-inspired)

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** Prism Mail team
- **Plan alias:** ADR-0003 in product brief

## Context

Remote images, tracking pixels, and unsafe links are the default attack surface in HTML mail. Users expect FairEmail-like defaults without copying FairEmail code or assets.

## Decision

Every client runs the same privacy engine:

- Block remote images by default
- Detect and neutralize tracking pixels
- Confirm links unless a shared trust rule applies
- Strip unsafe HTML and tracking query parameters
- Honor the shared whitelist
- No telemetry by default

## Consequences

- Engine is per-client (not a cloud filter).
- Conceptual reference only to FairEmail behaviors; no code or asset reuse.
