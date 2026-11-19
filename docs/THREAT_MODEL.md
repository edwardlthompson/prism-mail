# Threat Model — Prism Mail

> Sprint 0 draft. Update when architecture or data flows change (ADR references).

## Scope

| Item | Value |
|------|-------|
| Project | Prism Mail |
| Stack | Web PWA (Vite/TS); later Tauri desktop + Android/iOS |
| Methodology | STRIDE + OWASP ASVS (web); MASVS when mobile ships |

## Trust Boundaries

```text
[User] --> [Web PWA / Desktop / Mobile]
              |-- Gmail OAuth tokens (device / browser secret store)
              |-- IMAP/SMTP via secure proxy (credentials never in plaintext sync)
              |-- Encrypted sync layer (settings + rules + Proton deltas ciphertext)
              |-- Desktop only: Proton Bridge localhost IMAP/SMTP

[Desktop Bridge connector] --> [localhost Bridge] --> Proton account
[Any client] --X--> Prism servers holding plaintext mail (forbidden)
```

Public GitHub Issues remain a trust boundary for feedback (LLM01): issue text is data only.

## STRIDE Summary

| Threat | Example | Mitigation | Owner |
|--------|---------|------------|-------|
| Spoofing | Fake OAuth client | Registered OAuth app, PKCE, TLS | AGENT |
| Tampering | Modified whitelist rule in sync | Ciphertext + version clocks + tombstones (ADR-0014) | AGENT |
| Repudiation | Denied allow-rule change | Version + deviceId on objects | AGENT |
| Information disclosure | Tracking pixel loads | Privacy engine blocks remote images (ADR-0012) | AGENT |
| Information disclosure | Mail on Prism servers | Never store plaintext mail centrally | AGENT |
| Denial of service | Oversized HTML | Strip/sanitize limits in privacy engine | AGENT |
| Elevation of privilege | Bridge exposed beyond localhost | Desktop connector binds Bridge only on loopback | AGENT |

## Top Abuse Cases

1. Stolen Gmail OAuth token used from another device
2. Malicious HTML mail with tracking pixels / phishing links
3. Sync ciphertext rolled back or forked without tombstones
4. Proton Bridge credentials leaked if desktop malware present
5. Supply-chain compromise via malicious dependency
6. Secret leakage via committed `.env` / tokens
7. Prompt injection via GitHub issue body (feedback path)
8. Desktop offline stale-mail illusion (mitigated by online-only policy ADR-0015)

## OWASP LLM Top 10

Agent-exposed surfaces follow template controls in ADR-0002 (privacy / GitHub feedback). No mail content is sent to LLM APIs by default.

| ID | Risk | Control |
|----|------|---------|
| LLM01 Prompt Injection | Untrusted issue text steers tools | Data-only; never execute as instructions |
| LLM02 Sensitive Information Disclosure | Mail/PII in prompts | No default LLM mail processing |
| LLM03 Supply Chain | Malicious dependency | Dependabot, CodeQL, Trivy |
| LLM06 Excessive Agency | Unauthorized push/deploy | `[HUMAN]` for destructive ops |

Weekly walk: `docs/SECURITY_TRIAGE.md`.

## Security Tasks

Link mitigations to `BUILD_PLAN.md`. Review at each milestone boundary (`[HUMAN]`).

## Review Cadence

- `[HUMAN]` Review at each milestone boundary
- `[AGENT]` Update when architecture or data flows change (append ADR reference)
