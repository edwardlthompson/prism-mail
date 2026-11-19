"""Prism Mail GitHub Pages + Sprint 0 push/CI verifier (never git push)."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

from human_task_core import AttemptResult, run_cmd


def automate_pages_source(root: Path, _cfg: dict) -> AttemptResult:
    """Ensure GitHub Pages build_type=workflow (Actions), not /docs folder."""
    get = subprocess.run(
        ["gh", "api", "repos/{owner}/{repo}/pages"],
        cwd=root,
        capture_output=True,
        text=True,
        check=False,
    )
    if get.returncode != 0:
        create = subprocess.run(
            [
                "gh", "api", "-X", "POST", "repos/{owner}/{repo}/pages",
                "-f", "build_type=workflow",
                "-f", "source[branch]=main",
                "-f", "source[path]=/",
            ],
            cwd=root,
            capture_output=True,
            text=True,
            check=False,
        )
        if create.returncode != 0:
            err = (create.stderr or create.stdout or get.stderr or "")[-400:]
            return AttemptResult(1, "pages-source", err, True)
        return AttemptResult(0, "pages-source", "Enabled Pages build_type=workflow", False)
    try:
        data = json.loads(get.stdout or "{}")
    except json.JSONDecodeError:
        return AttemptResult(1, "pages-source", "invalid pages JSON", True)
    if data.get("build_type") != "workflow":
        put = subprocess.run(
            ["gh", "api", "-X", "PUT", "repos/{owner}/{repo}/pages", "-f", "build_type=workflow"],
            cwd=root,
            capture_output=True,
            text=True,
            check=False,
        )
        if put.returncode != 0:
            return AttemptResult(1, "pages-source", (put.stderr or put.stdout or "")[-400:], True)
        return AttemptResult(0, "pages-source", "Updated Pages to build_type=workflow", False)
    html = data.get("html_url") or ""
    return AttemptResult(0, "pages-source", f"Pages already Actions ({html})", False)


def _git_counts(root: Path) -> tuple[int | None, int | None, str]:
    branch = subprocess.run(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"],
        cwd=root,
        capture_output=True,
        text=True,
        check=False,
    )
    if branch.returncode != 0:
        return None, None, "not a git repo"
    name = (branch.stdout or "main").strip() or "main"
    upstream = f"origin/{name}"
    ahead = subprocess.run(
        ["git", "rev-list", "--count", f"{upstream}..HEAD"],
        cwd=root,
        capture_output=True,
        text=True,
        check=False,
    )
    behind = subprocess.run(
        ["git", "rev-list", "--count", f"HEAD..{upstream}"],
        cwd=root,
        capture_output=True,
        text=True,
        check=False,
    )
    if ahead.returncode != 0 or behind.returncode != 0:
        return None, None, f"missing {upstream}; fetch or /push"
    try:
        return int(ahead.stdout.strip()), int(behind.stdout.strip()), name
    except ValueError:
        return None, None, "rev-list parse error"


def automate_sprint0_push_ci(root: Path, _cfg: dict) -> AttemptResult:
    """Verify-only: local main matches origin and CI green. Never git push."""
    ahead, behind, note = _git_counts(root)
    if ahead is None:
        return AttemptResult(1, "sprint0-push-ci", note, True)
    if ahead > 0 or behind > 0:
        return AttemptResult(
            1,
            "sprint0-push-ci",
            f"branch {note} ahead={ahead} behind={behind}; run /push then re-/build (no agent git push)",
            True,
        )
    script = root / "scripts" / "check-github-ci.sh"
    if not script.is_file():
        return AttemptResult(1, "sprint0-push-ci", "check-github-ci.sh missing", True)
    code, tail = run_cmd(root, ["bash", script.as_posix(), "HEAD", "--wait", "120"])
    if code != 0:
        return AttemptResult(1, "sprint0-push-ci", tail or f"CI check exit {code}", True)
    return AttemptResult(0, "sprint0-push-ci", "origin in sync and GitHub CI green", False)
