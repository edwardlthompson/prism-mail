"""Prism Mail HUMAN/ADB rule table (handlers live in prism_docs / prism_gh)."""
from __future__ import annotations

import re

from human_task_prism_docs import (
    automate_desktop_signing,
    automate_mobile_device_smoke,
    automate_store_privacy,
    automate_sync_hosting,
)
from human_task_prism_gh import automate_pages_source, automate_sprint0_push_ci

# Re-export for tests and callers.
__all__ = [
    "PRISM_ADB_RULES",
    "PRISM_HUMAN_RULES",
    "automate_desktop_signing",
    "automate_mobile_device_smoke",
    "automate_pages_source",
    "automate_sprint0_push_ci",
    "automate_store_privacy",
    "automate_sync_hosting",
]

PRISM_HUMAN_RULES: list[tuple[re.Pattern[str], str, object]] = [
    (re.compile(r"Pages source\s*=\s*GitHub Actions|Confirm Pages source", re.I), "human", automate_pages_source),
    (re.compile(r"sync service hosting|self-host vs local-only", re.I), "human", automate_sync_hosting),
    (re.compile(r"Code-sign|notarize", re.I), "human", automate_desktop_signing),
    (re.compile(r"App Store|Play listing|privacy disclosures", re.I), "human", automate_store_privacy),
    (
        re.compile(
            r"Sprint 0 sign-off|git push.*blocked|check-github-ci|push `main`|push main",
            re.I,
        ),
        "human",
        automate_sprint0_push_ci,
    ),
]

PRISM_ADB_RULES: list[tuple[re.Pattern[str], str, object]] = [
    (re.compile(r"Device smoke|push \+ rule sync", re.I), "adb", automate_mobile_device_smoke),
]
