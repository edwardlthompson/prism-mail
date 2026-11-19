# Implementation Plan — Prism Mail

> Active work lives in `BUILD_PLAN.md`. This file is the milestone map.

## Milestone map

| Milestone | Sprint | Outcome |
|-----------|--------|---------|
| M0 Foundation | Sprint 0 | Init, brand, ADRs, schema, three-pane shell, gates |
| M1 Web hub core | Sprint 1 | Gmail, list/read, compose stub, privacy engine, local settings |
| M2 Universal sync | Sprint 2 | Encrypted settings/rules sync + near-real-time updates |
| M3 Desktop | Sprint 3 | Tauri Win/Mac/Linux online client + Proton Bridge module |
| M4 Mobile | Sprint 4 | Android + iOS + push |

## Sprint 0 tasks

| Task | Owner | Notes |
|------|-------|-------|
| Repo from template + init web full | AGENT | Done in Sprint 0 execution |
| Brand + setup-github-repo | AGENT / HUMAN | HUMAN: Pages reviewers, Actions approvals |
| ADRs 0001, 0011-0015 | AGENT | Accepted drafts |
| Threat model + privacy | AGENT | Prism-specific drafts |
| Settings/whitelist schema | AGENT | docs + TS types |
| Three-pane web shell | AGENT | examples/web/src/mail |
| Local + GitHub gates | AUTO / HUMAN | CI wait after push |

## Next feature protocol

1. Copy `docs/features/_template.md` to `docs/features/{name}.md`
2. Lock public API (Sequential)
3. Unit tests before or with implementation
4. `python3 scripts/agent-run.py watch-agent-gates --once --autofix --scope auto`
