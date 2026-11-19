# Human Backlog

> Items automation attempted during autonomous `/build` but could not complete. BUILD_PLAN rows stay open until a human finishes them.

| Deferred | Sprint | Owner | Task | Reason |
|----------|--------|-------|------|--------|
| 2026-11-19 | Sprint 0 — Foundation | HUMAN | Sprint 0 sign-off via check-github-ci | branch main ahead of origin; run /push then re-/build (no agent git push) |
## Blocked on you now (push / CI)

1. **Commit** dirty Sprint 1–4 work, then **`/push`** for `main` (agent cannot `git push`).
2. After push, re-run `/build` (or `attempt-build-plan-row` for Sprint 0 sign-off) so `automate_sprint0_push_ci` can flip the ❌ AUTO to ✅ when CI is green.
3. Pages is already **GitHub Actions** (`build_type=workflow`).

## Automated this session (docs/decision)

- Sync hosting → ADR-0016 local-only
- Desktop signing → `docs/DESKTOP_SIGNING.md`
- Store disclosures → nutrition label + `docs/STORE_PRIVACY_DISCLOSURES.md`
- Mobile device smoke → `docs/MOBILE_DEVICE_SMOKE.md` (scaffold defer)
- Android SDK/AVD → soft-pass (no `examples/android`)
