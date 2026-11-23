"""Fault-injection checks for the reader artifact verifier."""
import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("verify_reader_build", Path(__file__).with_name("verify_reader_build.py"))
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class ReaderBuildTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.scene = {
            "source_revision": 4,
            "opening": {"tr": "FIRST VIBRATION", "en": "FIRST VIBRATION"},
            "epistemic_layers": {key: "fiction-aware source note" for key in mod.LAYERS},
            "spatial_brief": {"pillars": 12}
        }
        self.choices = [{"key": name} for name in ("a", "b", "c")]
        base = {"status": "canon", "center_weights": {"HUMAN": 34, "LIGHT": 33, "DARK": 33},
                "content": {"tr": "Kurgusal metin", "en": "Fictional text"}}
        self.human = {**copy.deepcopy(base), "id": "HUM-0009", "revision": {"version": 4},
                      "observer_choices": self.choices}
        self.origin = {**copy.deepcopy(base), "id": "BRG-0002"}
        self.write("stories/human/HUM-0009/meta.json", self.human)
        self.write("stories/bridges/BRG-0002/meta.json", self.origin)
        self.write("experiments/hum0009-objection/scene.json", self.scene)
        self.write("experiments/hum0009-objection/flow.js", "shared flow")
        self.write("site/assets/hum0009-flow.v1.js", "shared flow")
        names = ["observer-engine.v2.js", "hum0009-flow.v1.js", "hum0009-objection-reader.v1.js",
                 "app.js", "first-vibration-3d.v1.js", "thirteenth-notch-3d.v1.js"]
        for name in names:
            if name != "hum0009-flow.v1.js":
                self.write("site/assets/" + name, "// fixture")
        self.write("site/index.html", "".join('<script src="./assets/' + name + '?v=1"></script>' for name in names))
        self.payload = {"centers": list(mod.CENTERS), "origin_node": "BRG-0002",
                        "stories": [self.origin, {**self.human, "objection_scene": self.scene}]}
        self.save()
    def write(self, path, value):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(value if isinstance(value, str) else json.dumps(value), encoding="utf-8")
    def save(self):
        self.write("site/data/universe.json", self.payload)
    def install_authority(self):
        meta = {"id": "HUM-0011", "status": "canon", "center_weights": {"HUMAN": 35, "LIGHT": 31, "DARK": 34},
                "observer_choices": self.choices}
        self.write("stories/human/HUM-0011/meta.json", meta)
        self.write("stories/human/HUM-0011/content/tr.md", "Kaynak hikâye")
        self.authority = {"story_id": "HUM-0011", "source": {
            "meta_blob_sha": mod.git_blob_sha(self.root / "stories/human/HUM-0011/meta.json"),
            "story_tr_blob_sha": mod.git_blob_sha(self.root / "stories/human/HUM-0011/content/tr.md")},
            "epistemic_layers": {key: "note" for key in mod.LAYERS}, "spatial_brief": {"pillars": 12},
            "plans": {key: {} for key in ("a", "b", "c")}}
        self.write("experiments/hum0011-authority/scene.json", self.authority)
        self.write("experiments/hum0011-authority/flow.js", "shared authority flow")
        self.write("site/assets/hum0011-flow.v1.js", "shared authority flow")
        self.write("site/assets/hum0011-authority-reader.v1.js", "// adapter")
        index = (self.root / "site/index.html").read_text()
        index = index.replace('<script src="./assets/app.js?v=1"></script>',
            '<script src="./assets/hum0011-flow.v1.js"></script><script src="./assets/hum0011-authority-reader.v1.js"></script><script src="./assets/app.js?v=1"></script>')
        self.write("site/index.html", index)
        self.payload["stories"].append({**meta, "content": {"tr": "Kaynak hikâye", "en": "Story"}, "authority_scene": copy.deepcopy(self.authority)})
        self.save()
    def test_valid_authority_report(self):
        self.install_authority()
        report = mod.verify(self.root)
        self.assertIn("authority_scene_source_pins", report["checks"])
    def test_authority_source_drift(self):
        self.install_authority()
        self.write("stories/human/HUM-0011/content/tr.md", "Değişmiş hikâye")
        with self.assertRaisesRegex(ValueError, "authority source pins mismatch"):
            mod.verify(self.root)
    def test_authority_missing_payload(self):
        self.install_authority()
        self.payload["stories"][-1].pop("authority_scene")
        self.save()
        with self.assertRaisesRegex(ValueError, "authority scene differs"):
            mod.verify(self.root)
    def test_authority_runtime_order(self):
        self.install_authority()
        index = (self.root / "site/index.html").read_text()
        index = index.replace("hum0011-flow.v1.js", "temp.js").replace("hum0011-authority-reader.v1.js", "hum0011-flow.v1.js").replace("temp.js", "hum0011-authority-reader.v1.js")
        self.write("site/index.html", index)
        with self.assertRaisesRegex(ValueError, "authority runtime order"):
            mod.verify(self.root)
    def test_authority_runtime_content_drift(self):
        self.install_authority()
        self.write("site/assets/hum0011-flow.v1.js", "stale flow")
        with self.assertRaisesRegex(ValueError, "authority shared flow copy differs"):
            mod.verify(self.root)
    def test_valid_report(self):
        report = mod.verify(self.root)
        self.assertEqual(report["story_count"], 2)
        self.assertIn("3d_rendering", report["not_verified"])
    def test_missing_asset(self):
        (self.root / "site/assets/app.js").unlink()
        with self.assertRaisesRegex(ValueError, "missing built asset"):
            mod.verify(self.root)
    def test_missing_story(self):
        self.payload["stories"].pop()
        self.save()
        with self.assertRaisesRegex(ValueError, "story set mismatch"):
            mod.verify(self.root)
    def test_invalid_total(self):
        self.payload["stories"][0]["center_weights"]["HUMAN"] = 50
        self.save()
        with self.assertRaisesRegex(ValueError, "not 100"):
            mod.verify(self.root)
    def test_stale_scene(self):
        self.payload["stories"][1]["objection_scene"] = {**self.scene, "source_revision": 3}
        self.save()
        with self.assertRaisesRegex(ValueError, "differs from source"):
            mod.verify(self.root)
    def test_missing_layer(self):
        self.scene["epistemic_layers"].pop("science_fiction")
        self.write("experiments/hum0009-objection/scene.json", self.scene)
        self.save()
        with self.assertRaisesRegex(ValueError, "epistemic layer"):
            mod.verify(self.root)
    def test_incorrect_script_order(self):
        index = (self.root / "site/index.html").read_text()
        index = index.replace("observer-engine.v2.js", "placeholder.js").replace("app.js", "observer-engine.v2.js").replace("placeholder.js", "app.js")
        self.write("site/index.html", index)
        with self.assertRaisesRegex(ValueError, "runtime order"):
            mod.verify(self.root)
    def test_3d_script_removed(self):
        index = (self.root / "site/index.html").read_text()
        index = index.replace('<script src="./assets/first-vibration-3d.v1.js?v=1"></script>', "")
        self.write("site/index.html", index)
        with self.assertRaisesRegex(ValueError, "3D runtime removed"):
            mod.verify(self.root)

if __name__ == "__main__":
    unittest.main()
