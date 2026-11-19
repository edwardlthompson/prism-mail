# Desktop code-sign / notarize strategy

> FOSS default for Prism Mail desktop (Tauri / online clients).

## Current (pre-release)

- CI publishes **unsigned** artifacts for Win/Mac/Linux.
- Users who build from source verify checksums / commit SHAs.
- No paid Apple Developer or Authenticode cert required for local FOSS builds.

## Before first public installer

| Platform | Path |
|----------|------|
| Windows | Authenticode (EV preferred for SmartScreen); CI signs release binaries only |
| macOS | Developer ID + notarization; staple tickets on release artifacts |
| Linux | No code-sign by default; ship `.AppImage`/deb with checksums + optional cosign |

## Policy

- Signing keys never enter the FOSS agent path or git.
- Notarize/sign only on tagged releases after `[HUMAN]` `/ship`.
- Proton Bridge connector remains optional and does not change this policy.
