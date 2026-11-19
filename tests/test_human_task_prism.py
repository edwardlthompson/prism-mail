"""Prism Mail HUMAN/ADB automation handlers."""
from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

LIB = Path(__file__).resolve().parent.parent / "scripts" / "lib"
if str(LIB) not in sys.path:
    sys.path.insert(0, str(LIB))

from human_task_android import automate_android_sdk_smoke  # noqa: E402
from human_task_automation import ADB_RULES, HUMAN_RULES, attempt_row  # noqa: E402
from human_task_prism import (  # noqa: E402
    automate_desktop_signing,
    automate_mobile_device_smoke,
    automate_sprint0_push_ci,
    automate_store_privacy,
    automate_sync_hosting,
)

PRISM_ROWS = (
    ("HUMAN", "Approve sync service hosting model (self-host vs local-only)"),
    ("HUMAN", "Code-sign / notarize strategy for desktop installers"),
    ("HUMAN", "App Store / Play listing privacy disclosures"),
    ("HUMAN", "Confirm Pages source = GitHub Actions; review environment reviewers"),
    (
        "HUMAN",
        "Sprint 0 sign-off on main: git push blocked — [HUMAN] push main then check-github-ci",
    ),
    ("ADB", "Device smoke for push + rule sync"),
    ("ADB", "Optional: Android SDK licenses + first AVD (`/emulator`)"),
)


class PrismHumanAutomationTests(unittest.TestCase):
    def test_rules_match_prism_rows(self) -> None:
        for owner, task in PRISM_ROWS:
            rules = HUMAN_RULES if owner == "HUMAN" else ADB_RULES
            matched = any(pattern.search(task) for pattern, _kind, _handler in rules)
            self.assertTrue(matched, f"no rule for {owner}: {task}")

    def test_sync_hosting_writes_adr_local_only(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "docs" / "features").mkdir(parents=True)
            (root / "docs" / "features" / "encrypted-settings-sync.md").write_text(
                "## Out of scope\n\n"
                "- Hosting a production sync server (HUMAN chooses self-host vs local-only)\n",
                encoding="utf-8",
            )
            result = automate_sync_hosting(root, {})
            self.assertEqual(result.exit_code, 0, result.reason)
            adr = (root / "docs" / "adr" / "0016-sync-hosting-local-only.md").read_text(
                encoding="utf-8"
            )
            self.assertIn("local-only", adr.lower())
            feat = (root / "docs" / "features" / "encrypted-settings-sync.md").read_text(
                encoding="utf-8"
            )
            self.assertIn("ADR-0016", feat)

    def test_desktop_signing_and_store_docs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.assertEqual(automate_desktop_signing(root, {}).exit_code, 0)
            self.assertTrue((root / "docs" / "DESKTOP_SIGNING.md").is_file())
            self.assertEqual(automate_store_privacy(root, {}).exit_code, 0)
            self.assertIn("Prism Mail", (root / "docs" / "PRIVACY_NUTRITION_LABEL.md").read_text(encoding="utf-8"))
            self.assertTrue((root / "docs" / "STORE_PRIVACY_DISCLOSURES.md").is_file())

    def test_mobile_smoke_scaffold_soft_pass(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "apps" / "android").mkdir(parents=True)
            (root / "apps" / "android" / "README.md").write_text("scaffold\n", encoding="utf-8")
            with mock.patch("human_task_prism_docs.adb_authorized", return_value=False):
                result = automate_mobile_device_smoke(root, {})
            self.assertEqual(result.exit_code, 0, result.reason)
            self.assertTrue((root / "docs" / "MOBILE_DEVICE_SMOKE.md").is_file())

    def test_android_sdk_soft_pass_without_tree(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            result = automate_android_sdk_smoke(Path(tmp), {})
            self.assertEqual(result.exit_code, 0, result.reason)
            self.assertFalse(result.backlog)

    def test_push_ci_fails_when_ahead(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            with mock.patch("human_task_prism_gh._git_counts", return_value=(3, 0, "main")):
                result = automate_sprint0_push_ci(root, {})
            self.assertEqual(result.exit_code, 1)
            self.assertTrue(result.backlog)
            self.assertIn("/push", result.reason)

    def test_attempt_row_sync(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "docs" / "features").mkdir(parents=True)
            result = attempt_row(
                root,
                "HUMAN",
                "Approve sync service hosting model (self-host vs local-only)",
                "Sprint 2",
            )
            self.assertEqual(result.exit_code, 0, result.reason)


if __name__ == "__main__":
    unittest.main()
