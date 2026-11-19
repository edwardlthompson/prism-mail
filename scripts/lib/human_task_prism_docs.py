"""Prism Mail doc writers for HUMAN/ADB automation rows."""
from __future__ import annotations

from pathlib import Path

from human_task_android import adb_authorized
from human_task_core import AttemptResult, append_decision_log

_TEMPLATES = Path(__file__).resolve().parent / "prism_human_templates"


def _copy_template(name: str, dest: Path, *, replace: dict[str, str] | None = None) -> None:
    text = (_TEMPLATES / name).read_text(encoding="utf-8")
    if replace:
        for key, val in replace.items():
            text = text.replace(key, val)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(text, encoding="utf-8")


def _mobile_is_scaffold_only(root: Path) -> bool:
    android = root / "apps" / "android"
    ios = root / "apps" / "ios"
    has_android = (android / "gradlew").is_file() or any(android.rglob("AndroidManifest.xml"))
    has_ios = any(ios.rglob("*.xcodeproj")) or any(ios.rglob("Package.swift"))
    return not has_android and not has_ios


def automate_sync_hosting(root: Path, _cfg: dict) -> AttemptResult:
    adr = root / "docs" / "adr" / "0016-sync-hosting-local-only.md"
    _copy_template("adr-0016-sync-hosting-local-only.md", adr)
    feature = root / "docs" / "features" / "encrypted-settings-sync.md"
    if feature.is_file():
        text = feature.read_text(encoding="utf-8")
        old = "- Hosting a production sync server (HUMAN chooses self-host vs local-only)"
        new = (
            "- Hosting a production sync server — **Decision (ADR-0016):** local-only default; "
            "supersede ADR to add self-host"
        )
        if old in text:
            feature.write_text(text.replace(old, new), encoding="utf-8")
        elif "ADR-0016" not in text:
            feature.write_text(text.rstrip() + f"\n\n{new}\n", encoding="utf-8")
    append_decision_log(root, "Sync hosting: local-only (ADR-0016); no hosted sync server")
    return AttemptResult(0, "sync-hosting", f"Wrote {adr.relative_to(root)} (local-only)", False)


def automate_desktop_signing(root: Path, _cfg: dict) -> AttemptResult:
    path = root / "docs" / "DESKTOP_SIGNING.md"
    _copy_template("DESKTOP_SIGNING.md", path)
    append_decision_log(root, "Desktop signing: unsigned FOSS CI; notarize deferred to first public installer")
    return AttemptResult(0, "desktop-signing", f"Wrote {path.relative_to(root)}", False)


def automate_store_privacy(root: Path, _cfg: dict) -> AttemptResult:
    _copy_template("PRIVACY_NUTRITION_LABEL.md", root / "docs" / "PRIVACY_NUTRITION_LABEL.md")
    _copy_template("STORE_PRIVACY_DISCLOSURES.md", root / "docs" / "STORE_PRIVACY_DISCLOSURES.md")
    append_decision_log(root, "Store privacy disclosure pack written (nutrition + STORE_PRIVACY_DISCLOSURES)")
    return AttemptResult(0, "store-privacy", "Wrote privacy nutrition + store disclosure pack", False)


def automate_mobile_device_smoke(root: Path, _cfg: dict) -> AttemptResult:
    checklist = root / "docs" / "MOBILE_DEVICE_SMOKE.md"
    scaffold = _mobile_is_scaffold_only(root)
    has_device = adb_authorized(root)
    _copy_template(
        "MOBILE_DEVICE_SMOKE.md",
        checklist,
        replace={"{scaffold}": str(scaffold), "{has_device}": str(has_device)},
    )
    note = "scaffold/device defer" if scaffold or not has_device else "device present; full app smoke future"
    return AttemptResult(0, "mobile-device-smoke", f"Wrote {checklist.relative_to(root)} ({note})", False)
