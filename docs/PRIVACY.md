# Privacy Policy (Draft) — Prism Mail

> Customize before public launch. Required when processing user mail or account tokens.

## Product stance

- Prism Mail does **not** host user mail in plaintext on its own servers.
- **No product telemetry** by default on the FOSS path.
- Privacy defaults (ADR-0012): block remote images, neutralize tracking pixels, confirm external links, strip tracking parameters, honor shared whitelist rules.

## Data We Process

| Data | Where | Purpose | Retention |
|------|-------|---------|-----------|
| Mail account tokens (Gmail OAuth, IMAP secrets) | Device / browser secret store; never in plaintext sync blob | Access provider APIs | Until user disconnects account |
| Message content | Provider servers; ephemeral client memory; Proton deltas only as ciphertext in sync | Read/compose | Not retained by Prism as a service |
| Settings + whitelist rules | Local storage; encrypted sync layer | Cross-device prefs | Until user clears or tombstones |
| App settings (theme, save-crashes) | Local only | UX | Until cleared |
| Crash / bug report (opt-in) | User-reviewed GitHub issue | Debugging | GitHub retention; one pending crash locally |

## Desktop online-only

Desktop clients (Win/Mac/Linux) fetch mail on demand from the hub/providers. They do **not** download mailboxes for offline use. Ephemeral session cache may hold the open thread briefly and is discarded on quit or short TTL (ADR-0015).

## App update checks

- Release endpoint: GitHub Releases API (`/repos/edwardlthompson/prism-mail/releases/latest`), at most once per 24 hours
- Not telemetry: User-Agent is product name and version only
- Stored locally: `last_check_at`, `last_seen_version`, `dismissed_version`

## Crash and feedback reports

- Filing requires a GitHub account; capture off by default
- Payload must not include: email contents, tokens, cookies, advertising ids, GPS, screenshots, home-directory paths
- User reviews sanitized markdown before Open GitHub or Copy

## Data We Do Not Collect

- No GitHub Pages analytics and no default product telemetry
- No sale of personal data
- No install UUID “just for dedup”
- No plaintext mail hosting

## User Rights (GDPR / CCPA)

- **Access / Deletion / Portability:** Export and clear settings/rules where technically feasible; revoke provider OAuth at the provider
- **Opt-out:** Telemetry remains off by default

## DPIA Checklist (`[HUMAN]`)

- Document processing purpose and legal basis before EU production use
- Assess necessity of any future sync service hosting ciphertext
- Record decisions in `.agent/DECISION_LOG.md` or ADRs

## Contact

Privacy inquiries: maintainers in `.github/CODEOWNERS` or `SECURITY.md`.
