# ADR-0017: Prism Mail multi-client topology (Hexagonal)

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** Prism Mail team
- **Supersedes pick in:** ADR-0001 (open template kept for bootstrap gates)

## Context

Prism Mail must support multiple providers and surfaces without becoming a Thunderbird clone or a Proton-only product. Users live primarily in the browser; desktop and mobile must share settings and rules.

## Decision

**Selected pattern:** Hexagonal (ports and adapters) across clients, with these roles:

| Client | Role |
|--------|------|
| Web PWA | Primary hub and easiest read/write point for Gmail, IMAP/SMTP path, settings, whitelist rules, compose, search |
| Desktop (Win/Mac/Linux, Tauri 2) | Full online client of the hub; optional Proton Bridge connector module in the same binary |
| Android + iOS | Native clients synced with the hub; platform push |

Application layering per client: domain core (privacy engine, rule schema, sync clocks) has no UI framework imports; adapters talk to Gmail API, IMAP proxy, Bridge localhost, and the encrypted sync layer.

## Consequences

- Sprint 0–2 focus on `examples/web/`; desktop and mobile are later sprints.
- Proton Bridge is never required for non-Proton accounts.
- Changing roles requires a new ADR and BUILD_PLAN `[HUMAN]` approval.

## Alternatives Considered

| Option | Rejected because |
|--------|------------------|
| Desktop-only primary client | Most users live in the browser; contradicts product brief |
| Separate Proton-only helper app forever | Extra install surface; fold Bridge into desktop as optional module |
| Monolith MVC | Poor fit for multi-surface FOSS clients |
| MVVM-only / Clean-only without ports | Weaker adapter boundaries for multi-provider FOSS clients |
