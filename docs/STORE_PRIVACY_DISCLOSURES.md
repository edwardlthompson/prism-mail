# Store privacy disclosures — Prism Mail

Copy-paste answers for Play Data safety and Apple App Privacy.

## Shared answers

- **Data collected for tracking / ads:** None
- **Analytics / crash:** Off by default; no third-party ads SDK
- **Account / mail:** User connects Gmail/IMAP/Proton Bridge; Prism does not sell mail data
- **Encryption:** Settings/whitelist vault AES-GCM on-device; sync local-only (ADR-0016)
- **Children:** Not directed at children under 13

## Google Play Data safety

| Data type | Collected? | Shared? | Purpose |
|-----------|------------|---------|---------|
| Email content | Processed on device / via provider APIs | No (not sold) | App functionality |
| App settings | Yes (on device) | No | App functionality |
| Diagnostics | Optional, off by default | Only if user enables feedback | Diagnostics |

## Apple App Privacy

- Data Not Collected for tracking
- Optional feedback may include user content the reviewer sees before send
- No advertising identifier

## Submit checklist

1. Paste tables above into store consoles when listing goes live
2. Keep this file in sync with `docs/PRIVACY.md` and ADR-0012/0016
3. Do not mark data “shared with third parties” for ads
