# Settings and whitelist schema (Sprint 0 stub)

Canonical types are mirrored in `examples/web/src/mail/schema.ts`.

## Common versioning

| Field | Type | Notes |
|-------|------|-------|
| id | string | Stable UUID |
| version | number | Logical clock; increments on each change |
| deviceId | string | Last writer |
| updatedAt | string | ISO-8601 |
| tombstone | boolean | Soft delete |

## DisplaySettings

| Field | Type | Default |
|-------|------|---------|
| density | comfortable or compact | comfortable |
| theme | system, light, or dark | system |
| readingMode | three_pane or two_pane | three_pane |

## PrivacyDefaults

| Field | Type | Default |
|-------|------|---------|
| blockRemoteImages | boolean | true |
| confirmExternalLinks | boolean | true |
| stripTrackingParams | boolean | true |
| telemetry | boolean | false (always false on FOSS path) |

## WhitelistRule

| Field | Type | Notes |
|-------|------|-------|
| type | image_allow or link_trust | Extensible enum |
| subjectKind | sender or domain | |
| subject | string | Email or domain |
| enabled | boolean | |

## Persistence (Sprint 0)

Local IndexedDB (or localStorage stub) on web only. Encrypted multi-device sync is Sprint 2.
