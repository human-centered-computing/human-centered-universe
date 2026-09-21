#!/usr/bin/env python3
"""Build the language matrix for a narration workflow run."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOICE_CONFIG = ROOT / "config" / "tts-voices.json"


def enabled_languages() -> list[str]:
    data = json.loads(VOICE_CONFIG.read_text(encoding="utf-8"))
    return [
        language
        for language, voice in data["languages"].items()
        if voice.get("enabled")
    ]


def languages_for_paths(paths: list[str], enabled: list[str]) -> list[str]:
    if (
        "config/tts-voices.json" in paths
        or ".github/narration-backfill-trigger" in paths
    ):
        return enabled

    changed = set()
    for path in paths:
        match = re.fullmatch(
            r"stories/[^/]+/[A-Z]{3}-\d{4}/content/([A-Za-z0-9_-]+)\.md",
            path,
        )
        if match and match.group(1) in enabled:
            changed.add(match.group(1))
    return [language for language in enabled if language in changed]


def changed_paths(base: str, head: str) -> list[str]:
    if not base or set(base) == {"0"}:
        return ["config/tts-voices.json"]
    result = subprocess.run(
        ["git", "diff", "--name-only", base, head],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return [line for line in result.stdout.splitlines() if line]


def plan(event: str, requested: str, base: str, head: str) -> list[str]:
    enabled = enabled_languages()
    if event == "workflow_dispatch":
        if requested == "all":
            return enabled
        if requested not in enabled:
            raise SystemExit(
                f"Unsupported narration language: {requested}. "
                f"Choose one of: {', '.join(enabled)}, all"
            )
        return [requested]
    return languages_for_paths(changed_paths(base, head), enabled)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--event", required=True)
    parser.add_argument("--requested", default="all")
    parser.add_argument("--base", default="")
    parser.add_argument("--head", default="HEAD")
    args = parser.parse_args()
    print(json.dumps(plan(args.event, args.requested, args.base, args.head)))


if __name__ == "__main__":
    main()
