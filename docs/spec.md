# Product Specification — Prism Mail

> Spec-driven development. Feature slices use `docs/features/{name}.md`.
> Status markers: open / done / blocked (see BUILD_PLAN emoji).

## Overview

<!-- product-brief-sync:begin -->
> Read `AGENT.md` before any sprint row.

**One-liner:** Privacy-first multi-provider email: web hub, online desktop (Win/Mac/Linux), mobile, universal synced rules.
**Do not drift:** email, privacy, pwa, desktop, sync, whitelist, proton bridge, gmail, imap

**Rules:**
- Prefer Plan Mode for architecture; Agent Mode only after plan/ADR approval.
- Keep UI minimal and modern; do not copy proprietary code or FairEmail assets.
- Desktop helper/connector remains optional; desktop is online-only for mail bodies.
- MIT; no proprietary SDKs on the FOSS path; no telemetry by default.
- AGENTS.md is sacred; sync adapters after rule changes.
- File budgets: static <=300, logic <=150, composition roots <=10 lines/feature.

**First milestone:** Bootstrap web stack (--profile full), ADRs 0001 + 0011-0015, threat model, privacy stub, settings/whitelist schema, three-pane web shell; CI + template gates green.
<!-- product-brief-sync:end -->

**Product:** Prism Mail
**Purpose:** Privacy-first multi-provider email client with a web hub, online desktop clients, and native mobile.
**Users:** People who want multi-provider mail with strong privacy defaults and synced allow-rules across devices.
**Brief:** `docs/PRISM_MAIL_BRIEF.md`

## Architecture (summary)

See ADR-0001, ADR-0011 through ADR-0015.

| Surface | Responsibility |
|---------|----------------|
| Web PWA | Hub: Gmail, IMAP path, settings, rules, compose, search |
| Desktop Tauri | Online client of hub; optional Proton Bridge connector |
| Android / iOS | Hub sync + native push |

## Functional Requirements

| ID | Story | Acceptance |
|----|-------|------------|
| FR-1 | As a user I open the web PWA and see a three-pane mail shell | Folder, list, and reading panes render with empty states |
| FR-2 | As a user I connect Gmail (Sprint 1) | OAuth succeeds; inbox lists messages |
| FR-3 | As a user I open a message with remote images blocked | Images blocked unless whitelist rule allows |
| FR-4 | As a user I create an image-allow rule | Rule persists locally (Sprint 0/1) and syncs (Sprint 2) |
| FR-5 | As a desktop user I use Prism online only | No offline mailbox download (ADR-0015) |

## Non-Functional Constraints

- MIT; FOSS path; no proprietary SDKs
- No telemetry by default
- Never host user mail in plaintext on Prism servers
- File budgets enforced by CI
- Template gates: validate-bootstrap, Feature Gate, Security Scan, CodeQL

## Success Criteria (early)

- Web PWA Gmail connect + list + read with images blocked (Sprint 1)
- Allow-rule persisted and schema-ready for other clients
- ADRs + threat model + privacy stub documented
- CI and template gates green
