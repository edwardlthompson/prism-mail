# Feature: mobile-hub-clients

> Sprint 4 — Native Android + iOS clients synced with the web hub.

## Acceptance criteria

- 🔲 Android (Kotlin / Jetpack Compose) syncs settings/rules with the hub
- 🔲 iOS (Swift / SwiftUI) syncs settings/rules with the hub
- 🔲 Platform push: F-Droid-friendly path on Android (UnifiedPush); APNs on iOS
- 🔲 Same privacy engine defaults as web (ADR-0012)
- 🔲 Empty / offline / offline states with named next actions
- 🔲 Accessibility: TalkBack / VoiceOver for primary mail chrome
- 🔲 i18n for en + at least one second locale

## Smoke scenario

1. Given hub account linked on mobile
2. When a whitelist rule is created on web
3. Then mobile receives the rule after sync / push wake

## Container map

| Layer | Path |
|-------|------|
| Android | `apps/android/` |
| iOS | `apps/ios/` |
| Shared contracts | docs + future `packages/shared` |
| Tests | unit + instrumented / XCTest |

## Tests

- Automated: yes for domain/privacy logic; device smoke via `[ADB]`
- Fallback: `/emulator` when SDK present

## Fallback validation

- Why full device tests may wait: `apps/android` / `apps/ios` are README scaffolds until Compose/SwiftUI land
- Command: `python3 scripts/agent-run.py attempt-build-plan-row --owner ADB --task "Device smoke for push + rule sync"` (writes `docs/MOBILE_DEVICE_SMOKE.md`)

## Non-goals

- Proprietary FCM-only push on FOSS path
- Offline durable mailbox mirroring desktop policy exceptions (document when shipping)
