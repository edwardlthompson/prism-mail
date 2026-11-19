# Build Plan

<!-- remaining-tally -->
**Remaining:** AGENT 12 · LOCAL 12 · CLOUD 0 · AUTO 1 · HUMAN 7 · ADB 2 · **22 open**
<!-- /remaining-tally -->

Live board for a product repo. Finished work: [`COMPLETED_TASKS.md`](COMPLETED_TASKS.md).

**Who:** `AGENT` code · `HUMAN` person · `ADB` device · `AUTO` CI/scripts
**Venue (AGENT only):** `[LOCAL]` This Computer · `[CLOUD]` Cursor Cloud — [`docs/adr/0008-agent-venue.md`](docs/adr/0008-agent-venue.md)
**State:** 🔲 open · ✅ done · ❌ blocked — reason

Format: `🔲 [AGENT][LOCAL] Short task — scope: path/prefix` (or `[CLOUD]`). Sequential `[AGENT]` first. Parallel scopes: [`docs/PARALLEL_AGENT_SCOPES.md`](docs/PARALLEL_AGENT_SCOPES.md). `/build` on This Computer picks LOCAL only; Cloud picks CLOUD only. HUMAN/ADB after automation → `HUMAN_BACKLOG.md`.

This file is the **child model**. After `init-project`, it becomes your `BUILD_PLAN.md`. On the bootstrap template, the live maintainer board is [`BUILD_PLAN.md`](BUILD_PLAN.md).

## Smoke gate (hard stop)

After every `[AGENT]` row: `python3 scripts/agent-run.py watch-agent-gates --once --autofix --scope auto`

After the **last** `[AGENT]`/`[AUTO]` row in a sprint is ✅, do **not** start the next sprint until this exits 0:

```bash
python3 scripts/agent-run.py smoke-sprint --require

```

That command re-smokes **every** ✅ row: no errors or crashes, plus startup time and load order. Details: [`docs/SPRINT_SMOKE.md`](docs/SPRINT_SMOKE.md). Fail → leave the last row open or ❌; fix; re-run. `/gates` wrap-up includes the same check.

---

## Product

Copy this shape when you add sprints: `### Sprint N — title`, then numbered rows. Keep it this short.

### Product (do not drift)

> Auto-managed from `AGENT.md` after init. Do not hand-edit inside markers. Read `AGENT.md` before any sprint row.

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
- File budgets: static ≤300, logic ≤150, composition roots ≤10 lines/feature.

**First milestone:** Bootstrap web stack (--profile full), ADRs 0001–0006, threat model, privacy stub, settings/whitelist schema, three-pane web shell; CI + template gates green.
<!-- product-brief-sync:end -->

### Sprint 0 — Foundation

<!-- parallel_exception: bootstrap sequence is ordered until init completes -->

1. ✅ [AGENT][LOCAL] Copy `AGENT.md.example` → `AGENT.md` with product brief — scope: AGENT.md
2. ✅ [AGENT][LOCAL] Run `scripts/init-project.ps1` web + profile full + MIT — scope: scripts/
3. ✅ [AGENT][LOCAL] Brand `product.json` mode product; sync tokens + README — scope: branding/
4. ✅ [AGENT][LOCAL] Run `scripts/setup-github-repo.ps1` — scope: scripts/
5. ✅ [AGENT][LOCAL] Write ADRs 0001 + 0011–0015, threat model, privacy, schema — scope: docs/
6. ✅ [AGENT][LOCAL] Write `docs/spec.md`, `docs/plan.md`, expand this board — scope: docs/
7. ✅ [AGENT][LOCAL] Scaffold three-pane mail shell + local settings/whitelist stub — scope: examples/web/src/mail/
8. 🔲 [AUTO] Sprint 0 sign-off on `main`: `validate-bootstrap --quick` · `feature-gate --stack web` · `check-github-ci --wait 300` · `check-license-compliance`
9. ✅ [HUMAN] Create GitHub repo from template (agent used `gh repo create --template`)
10. ✅ [HUMAN] FOSS distribution tier
11. 🔲 [HUMAN] Confirm Pages source = GitHub Actions; review environment reviewers
12. 🔲 [HUMAN] Pick Cursor mode (`docs/CURSOR_MODES.md`)
13. ✅ [AGENT][LOCAL] Replace inherited brand icon with Prism mark (`docs/BRAND_ICON.md`)
14. 🔲 [HUMAN] Bookmark `docs/help/BATCH_COMMANDS.md` (`/coach`)

### Sprint 1 — Web hub core

<!-- parallel: privacy engine vs Gmail adapter after shell API locked -->

1. 🔲 [AGENT][LOCAL] Lock Settings chrome + About + nav for Prism Mail — scope: examples/web/
2. 🔲 [AGENT][LOCAL] Gmail OAuth account connect + message list — scope: examples/web/src/mail/
3. 🔲 [AGENT][LOCAL] Reading pane + privacy engine (image block, link confirm) — scope: examples/web/src/mail/
4. 🔲 [AGENT][LOCAL] Basic compose stub + local settings persistence — scope: examples/web/src/mail/
5. 🔲 [HUMAN] Approve Sprint 1 + fill `app-update.json` / `donations.json` if needed

**Parallel (after row 1 API lock):**

| Lane | Owner | Scope |
|------|-------|-------|
| A | `[AGENT][LOCAL]` | `examples/web/src/mail/providers/` |
| B | `[AGENT][LOCAL]` | `examples/web/src/mail/privacy/` |

### Sprint 2 — Universal rules and sync

1. 🔲 [AGENT][LOCAL] Feature spec `docs/features/encrypted-settings-sync.md` — scope: docs/features/
2. 🔲 [AGENT][LOCAL] Encrypted sync layer for settings + whitelist rules — scope: examples/web/src/mail/
3. 🔲 [AGENT][LOCAL] WebSocket (or equivalent) near-real-time rule updates — scope: examples/web/src/mail/
4. 🔲 [HUMAN] Approve sync service hosting model (self-host vs local-only)

### Sprint 3 — Desktop online client + Proton connector

1. 🔲 [AGENT][LOCAL] Feature spec for Tauri desktop online client — scope: docs/features/
2. 🔲 [AGENT][LOCAL] Scaffold Tauri 2 app (Win/Mac/Linux) online hub client — scope: apps/desktop/
3. 🔲 [AGENT][LOCAL] Optional Proton Bridge connector module + delta push — scope: apps/desktop/
4. 🔲 [HUMAN] Code-sign / notarize strategy for desktop installers

### Sprint 4 — Mobile clients

1. 🔲 [AGENT][LOCAL] Android Kotlin/Compose hub client + F-Droid-friendly push path — scope: apps/android/
2. 🔲 [AGENT][LOCAL] iOS Swift/SwiftUI hub client + APNs — scope: apps/ios/
3. 🔲 [ADB] Device smoke for push + rule sync
4. 🔲 [HUMAN] App Store / Play listing privacy disclosures

### Waiting on a person

1. 🔲 [ADB] Optional: Android SDK licenses + first AVD (`/emulator`)

### Open PRs (synced)

> Auto-managed on product repos too. Do not hand-edit rows inside the markers.

<!-- open-prs-sync:begin -->
_No open Dependabot or Release Please PRs._
<!-- open-prs-sync:end -->

### Template gaps (synced)

> Auto-managed Monday cron + `sync-template-gaps-build-plan`. Do not hand-edit inside markers. Plan-only — run `/upgrade` then name item numbers.

<!-- template-gaps-sync:begin -->
_No template gaps; .template-version matches upstream (or template maintainer N/A)._
<!-- template-gaps-sync:end -->

### UX & UI inventory

Complete list from construction gaps and `/ux-review`. Status is only planned / in_progress / done. `/build` does not execute these until `/ux-apply UX-NNN` (or a Sequential row). Follow [`docs/ux-ui-guidelines.md`](docs/ux-ui-guidelines.md) when shipping UI.

<!-- ux-inventory:begin -->
_No UX inventory items._
<!-- ux-inventory:end -->

### Local agent (This Computer)

Standing queue for This Computer. Rows: `🔲 [AGENT][LOCAL] … — scope: path`. `/build` claims these only. See [`docs/adr/0008-agent-venue.md`](docs/adr/0008-agent-venue.md).

<!-- local-agent-lane:begin -->
_No local agent items._
<!-- local-agent-lane:end -->

### Cloud agent (Cursor Cloud)

Standing queue for Cursor Cloud. Rows: `🔲 [AGENT][CLOUD] … — scope: path`. Cloud claims these only (`cursor/*`). Never edit Local lane or `[LOCAL]` rows.

<!-- cloud-agent-lane:begin -->
_No cloud agent items._
<!-- cloud-agent-lane:end -->

---

## Ongoing Maintenance

Not a checklist. GitHub Monday cron (`.github/workflows/weekly-health-check.yml`) already runs CI wait, security triage, parent template-gap BUILD_PLAN sync (this child board), radar, `update-deps` dry-run, Dependabot leftover list, open-PR BUILD_PLAN sync, and latest-release SBOM. Upgrade-sim stays on the template maintainer repo. `/ship` owns pre-release and the release tag.

If Monday cron is red: Cursor Automation `weekly-maintain`, then Grok Bot 4–5. Do not put those chores back on this board. [`docs/GROK_BOTS.md`](docs/GROK_BOTS.md) · [`docs/CURSOR_AUTOMATIONS.commercial.md`](docs/CURSOR_AUTOMATIONS.commercial.md)

---

## Archive

Older sprints: [`COMPLETED_TASKS.md`](COMPLETED_TASKS.md).
