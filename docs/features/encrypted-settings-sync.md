# Feature: encrypted-settings-sync

> Sprint 2 — Encrypted sync layer for settings + whitelist rules.

## Acceptance criteria

- 🔲 Settings and whitelist rules encrypt at rest before leaving the device
- 🔲 Multi-device merge uses logical clocks + tombstones (ADR-0014 / ADR-0011)
- 🔲 Near-real-time update path (WebSocket or equivalent) refreshes rules without full reload
- 🔲 Empty / first-device state creates a local vault key (user-held)
- 🔲 Error state when sync is unreachable (local rules still work)
- 🔲 Offline: queue outbound rule changes; flush when online
- 🔲 Accessibility: sync status announced politely (`aria-live`)
- 🔲 i18n keys under `mail.sync.*`

## Smoke scenario

1. Given two browser profiles with the same vault key fixture
2. When user adds an image-allow rule on device A
3. Then device B receives the rule via sync without console errors

## Container map

| Layer | Path |
|-------|------|
| Logic | `examples/web/src/mail/sync/` |
| View | Settings bar sync status in `mailWorkspace` |
| Tests | `sync/*.test.ts` |
| Wiring | ≤10 lines in mail store |

## Tests

- Automated: yes — encrypt/decrypt round-trip, merge clocks, tombstone wins
- Coverage: pure logic plus one smoke path

## Fallback validation

- Why tests are not feasible: N/A
- Command: `python3 scripts/agent-run.py watch-agent-gates --once --autofix --scope examples/web`

## Out of scope (this feature)

- Hosting a production sync server — **Decision (ADR-0016):** local-only default; supersede ADR to add self-host
- Mail body sync (desktop remains online-only per ADR-0015)
