# Prism Mail — Product Brief

**Product name:** Prism Mail  
**Repo:** edwardlthompson/prism-mail  
**Parent template:** edwardlthompson/agent-project-bootstrap  
**License:** MIT  
**Status:** Locked-in product brief for Sprint 0 + architecture

## Product Overview

Prism Mail is a modern, privacy-first, multi-provider email client.

### Core philosophy
- The **web app is the main hub**. Non-Proton accounts (Gmail, Yahoo, generic IMAP/SMTP) are handled from the web.
- **Desktop apps (Windows, Linux, macOS)** are full clients that access remote hub/sync data **online-only** — they do not download mailboxes for offline use. Ephemeral session cache for UX is allowed.
- The desktop app includes an optional **Proton Mail Bridge connector** (localhost). It is not required for any other account.
- **Native Android + iOS apps** provide reliable push notifications and sync with the web hub.
- **All settings and whitelist rules are universal** and sync across every client.
- Privacy defaults match the spirit of FairEmail: block remote images by default, neutralize tracking pixels, confirm links, strip tracking parameters, no telemetry.

### Non-goals
- Not a full replacement for Proton official clients for advanced Proton-only features that require Bridge.
- Not an email hosting service. Prism Mail never holds mail on its own servers in plaintext.
- Not a Thunderbird clone. Prefer a clean, modern, minimal three-pane (or two-pane) UI.
- Desktop clients do **not** provide offline mailbox access.

## Architecture roles

| Client | Role |
|--------|------|
| Web app (main hub) | Primary client + source of truth for Gmail/IMAP, settings, rules, compose, search, PWA |
| Desktop (Win/Mac/Linux) | Full online client of the hub; optional Proton Bridge connector module |
| Native Android + iOS | Notification + mobile clients synced with the hub |

### Sync and privacy
- Shared encrypted sync layer; versioning + tombstones; logical clocks.
- Privacy engine on every client; honor shared whitelist; no telemetry by default.
- Fresh Proton mail only arrives while the desktop Bridge connector is running; other clients may display previously synced Proton mail.

## Tech stack (Sprint 0–2 focus)
- Web PWA: TypeScript + Vite Golden Path
- Later: Tauri 2 desktop (online-only); Kotlin/Compose Android; Swift/SwiftUI iOS

## Success criteria (early)
- Web PWA can connect Gmail, list messages, open a message with remote images blocked by default.
- Image-allow rules persist and are readable by other clients.
- Architecture and ADRs documented; CI and template gates pass; MIT; FOSS; no telemetry.
