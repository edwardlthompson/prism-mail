# Human backlog — Prism Mail Sprint 0

## Blocked on you now

1. **Approve / run `git push`** for `main` (2 local commits ahead of `origin/main`). Cursor blocked agent `git push` via the destructive-ops hook.
2. After push, run:
   ```bash
   python scripts/agent-run.py check-github-ci --wait 300
   ```
   Required green: CI, Security Scan, CodeQL (plus other protected checks from setup-github-repo).

## Confirm in GitHub Settings

1. Pages source = **GitHub Actions** (not `/docs`).
2. Environments: reviewers on `github-pages` are OK; do **not** gate CI / Security Scan / CodeQL behind environments.
3. Actions → General: do not require approval for same-repo `github-actions[bot]` / Release Please PRs.
4. Pick Cursor mode per `docs/CURSOR_MODES.md`.
5. Bookmark `docs/help/BATCH_COMMANDS.md` (`/coach` for next action).

## Already done by agent

- Repo created: https://github.com/edwardlthompson/prism-mail
- Cloned to `C:\Users\edwar\prism-mail`
- Init web + profile full, brand, ADRs, three-pane shell
- Dependabot alerts, private vulnerability reporting, branch protection
- Local `feature-gate --stack web` passed; license check passed
