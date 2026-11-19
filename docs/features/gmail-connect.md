# Feature: gmail-connect

> Sprint 1 — Gmail OAuth account connect + message list.

## Acceptance criteria

- ✅ User can start Gmail connect from the mail list pane (primary CTA)
- ✅ With `VITE_GOOGLE_CLIENT_ID`, OAuth PKCE runs and lists inbox via Gmail API
- ✅ Without client ID, demo mode lists sample messages (labeled) so UI is testable
- ✅ Empty state when disconnected explains next action
- ✅ Loading and error states in the list pane
- ✅ Offline: connect disabled / error copy when `navigator.onLine` is false
- ✅ Keyboard: Connect and message rows are buttons with visible focus
- ✅ i18n keys under `mail.connect.*` / `mail.list.*`

## Smoke scenario

1. Given home mail shell
2. When user taps Connect Gmail (demo)
3. Then message list shows demo rows without console errors

## Container map

| Layer | Path |
|-------|------|
| Logic | `examples/web/src/mail/providers/` |
| View | `examples/web/src/mail/MailShell.ts` |
| Tests | `providers/*.test.ts`, `MailShell.test.ts` |
| Wiring | `createMailShell` options (≤10 lines) |

## Tests

- Automated: yes — unit tests for session, PKCE helpers, demo list, MailShell connect
- Coverage: pure logic plus smoke path

## Fallback validation

- Why tests are not feasible: N/A
- Command: `python3 scripts/agent-run.py watch-agent-gates --once --autofix --scope auto`
