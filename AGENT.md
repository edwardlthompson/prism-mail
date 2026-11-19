# AGENT.md — original product brief (Sacred)

Copy this file to AGENT.md after clone and **before** init-project. Paste the
human’s original prompt **verbatim**. Bootstrap stamps AGENTS.md only and will
not overwrite this file. Later sessions: read this before any BUILD_PLAN sprint row.

<!-- agent-brief:one-liner -->
Privacy-first multi-provider email: web hub, online desktop (Win/Mac/Linux), mobile, universal synced rules.
<!-- /agent-brief:one-liner -->

<!-- agent-brief:keywords -->
email, privacy, PWA, desktop, sync, whitelist, Proton Bridge, Gmail, IMAP
<!-- /agent-brief:keywords -->

## Product

**Prism Mail** — privacy-first, multi-provider email client (MIT, FOSS).

- **Web PWA** is the main hub (Gmail API, Yahoo/generic IMAP via secure path, settings, whitelist rules, unified inbox, compose, search).
- **Desktop (Windows, Linux, macOS)** are full clients that access remote hub/sync data **online-only** (no offline mailbox download; ephemeral session cache OK). Same binary hosts an optional **Proton Bridge connector**.
- **Android + iOS** sync with the hub and deliver native push.
- **Universal settings and whitelist rules** (versioned + tombstones) propagate to every client.
- Privacy defaults (FairEmail-inspired): block remote images, neutralize tracking pixels, confirm links, strip tracking params, no telemetry.

Full brief: docs/PRISM_MAIL_BRIEF.md.

## Rules

- Prefer Plan Mode for architecture; Agent Mode only after plan/ADR approval.
- Keep UI minimal and modern; do not copy proprietary code or FairEmail assets.
- Desktop helper/connector remains optional; desktop is online-only for mail bodies.
- MIT; no proprietary SDKs on the FOSS path; no telemetry by default.
- AGENTS.md is sacred; sync adapters after rule changes.
- File budgets: static ≤300, logic ≤150, composition roots ≤10 lines/feature.

## First milestone (Sprint 0)

Bootstrap web stack (--profile full), ADRs 0001–0006, threat model, privacy stub, settings/whitelist schema, three-pane web shell; CI + template gates green.

## Sprint outline

1. Sprint 0 — Foundation (this milestone)
2. Sprint 1 — Web hub core (Gmail, list/read, privacy engine)
3. Sprint 2 — Universal rules and encrypted sync
4. Sprint 3 — Tauri desktop online client + Proton Bridge module
5. Sprint 4 — Android + iOS + push
