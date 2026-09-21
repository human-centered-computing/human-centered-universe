#!/usr/bin/env python3
import importlib.util
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("plan_narration_languages.py")
SPEC = importlib.util.spec_from_file_location("narration_planner", MODULE_PATH)
PLANNER = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(PLANNER)


class NarrationPlannerTest(unittest.TestCase):
    def setUp(self):
        self.enabled = ["tr", "en", "de", "fr", "es", "it"]

    def test_selects_only_changed_supported_languages(self):
        paths = [
            "stories/human/HUM-0003/content/it.md",
            "stories/human/HUM-0003/content/pt.md",
            "README.md",
        ]
        self.assertEqual(
            PLANNER.languages_for_paths(paths, self.enabled),
            ["it"],
        )

    def test_voice_configuration_change_selects_all_languages(self):
        self.assertEqual(
            PLANNER.languages_for_paths(
                ["config/tts-voices.json"], self.enabled
            ),
            self.enabled,
        )

    def test_unrelated_change_selects_no_language(self):
        self.assertEqual(
            PLANNER.languages_for_paths(["docs/ROADMAP.md"], self.enabled),
            [],
        )


if __name__ == "__main__":
    unittest.main()
