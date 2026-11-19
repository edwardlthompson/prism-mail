# Feature: desktop-online-client

> Sprint 3 — Tauri 2 online desktop client (Win/Mac/Linux) + optional Proton Bridge connector.

## Acceptance criteria

- 🔲 Desktop app loads the hub UI online (no offline mailbox download — ADR-0015)
- 🔲 Clear unavailable state when network is down
- 🔲 Optional Proton Bridge connector module talks to localhost IMAP/SMTP
- 🔲 Bridge deltas push into encrypted settings/mail sync layer (ADR-0013)
- 🔲 Packaging targets: Windows NSIS, macOS, Linux deb (later HUMAN signing)
- 🔲 Accessibility parity with web chrome (Settings-only)
- 🔲 i18n shared or mirrored from web locales

## Smoke scenario

1. Given desktop app starts with network
2. When user opens inbox via hub session
3. Then messages load on demand; quitting clears ephemeral cache

## Container map

| Layer | Path |
|-------|------|
| Logic | `apps/desktop/src-tauri/` + shared `packages/` (future) |
| View | Webview loads `examples/web` dist or shared UI |
| Tests | Rust unit + web reuse |
| Wiring | Thin Tauri commands ≤10 lines each |

## Tests

- Automated: yes for connector pure logic; UI via web Vitest until desktop e2e lands
- Coverage: Bridge delta parser + online-only policy guard

## Fallback validation

- Why full desktop e2e may wait: needs Rust + OS webview on CI runners
- Command: `python3 scripts/agent-run.py watch-agent-gates --once --autofix --scope docs/features`

## Non-goals

- Offline mailbox cache
- Separate Proton-only helper binary (connector is a module)
