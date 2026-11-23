"""Verify a complete built reader against its source records; no network or browser."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import argparse
import hashlib
import json
import math

CENTERS = {"HUMAN", "LIGHT", "DARK"}
LAYERS = {"established_science", "real_engineering", "interpretation", "philosophy",
          "belief_cultural_meaning", "science_fiction"}

def require(condition, message):
    if not condition:
        raise ValueError(message)

class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.scripts = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "script" and attrs.get("src"):
            self.refs.append(attrs["src"])
            self.scripts.append(attrs["src"])
        if tag == "link" and attrs.get("rel") == "stylesheet" and attrs.get("href"):
            self.refs.append(attrs["href"])

def local_asset(site, ref):
    parts = urlsplit(ref)
    require(not parts.scheme and not parts.netloc, "runtime asset must be local: " + ref)
    candidate = (site / unquote(parts.path).lstrip("/")).resolve()
    require(candidate.is_relative_to(site.resolve()), "asset escapes site root: " + ref)
    require(candidate.is_file(), "missing built asset: " + ref)
    return candidate

def git_blob_sha(path):
    data = path.read_bytes()
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()

def verify(root):
    root = Path(root).resolve()
    site = root / "site"
    payload = json.loads((site / "data/universe.json").read_text(encoding="utf-8"))
    expected = {}
    for path in (root / "stories").rglob("meta.json"):
        meta = json.loads(path.read_text(encoding="utf-8"))
        if meta.get("status") in {"canon", "core"}:
            require(meta.get("id") not in expected, "duplicate source story")
            expected[meta["id"]] = meta
    require(expected, "no source stories")
    stories = payload.get("stories", [])
    actual = {story["id"]: story for story in stories}
    require(len(actual) == len(stories), "duplicate built story")
    require(set(actual) == set(expected), "built/source story set mismatch")
    require(set(payload.get("centers", [])) == CENTERS, "center set mismatch")
    require(payload.get("origin_node") == "BRG-0002" and "BRG-0002" in actual, "missing FIRST VIBRATION origin")
    for story in stories:
        weights = story.get("center_weights", {})
        require(set(weights) == CENTERS, "invalid centers: " + story["id"])
        require(all(type(v) in (int, float) and math.isfinite(v) and 0 <= v <= 100 for v in weights.values()),
                "invalid weight: " + story["id"])
        require(sum(weights.values()) == 100, "center total is not 100: " + story["id"])

    parser = Assets()
    parser.feed((site / "index.html").read_text(encoding="utf-8"))
    require(parser.scripts, "no runtime scripts")
    hashes = {}
    for ref in parser.refs:
        asset = local_asset(site, ref)
        hashes[asset.relative_to(site).as_posix()] = hashlib.sha256(asset.read_bytes()).hexdigest()
    scripts = [urlsplit(ref).path for ref in parser.scripts]
    ordered = ["./assets/observer-engine.v2.js", "./assets/hum0009-flow.v1.js",
               "./assets/hum0009-objection-reader.v1.js", "./assets/app.js"]
    require(all(item in scripts for item in ordered), "missing objection runtime")
    require([scripts.index(item) for item in ordered] == sorted(scripts.index(item) for item in ordered),
            "incorrect objection runtime order")
    require(len(scripts) == len(set(scripts)), "duplicate runtime script")

    source_scene = json.loads((root / "experiments/hum0009-objection/scene.json").read_text(encoding="utf-8"))
    story = actual.get("HUM-0009")
    require(story is not None, "missing HUM-0009")
    require(story.get("objection_scene") == source_scene, "built scene differs from source")
    require(source_scene.get("source_revision") == expected["HUM-0009"].get("revision", {}).get("version"),
            "scene/story revision mismatch")
    require(set(source_scene.get("epistemic_layers", {})) == LAYERS, "missing epistemic layer")
    require(source_scene.get("spatial_brief", {}).get("pillars") == 12, "twelve-pillar context missing")
    for lang in ("tr", "en"):
        require(bool(story.get("content", {}).get(lang)), "missing story text: " + lang)
        require("FIRST VIBRATION" in source_scene.get("opening", {}).get(lang, ""), "missing fictional origin cue")
    require(story.get("observer_choices") == expected["HUM-0009"].get("observer_choices"),
            "canonical choices changed in build")
    require(len(story.get("observer_choices", [])) == 3, "expected three observer choices")
    source_flow = (root / "experiments/hum0009-objection/flow.js").read_bytes()
    require((site / "assets/hum0009-flow.v1.js").read_bytes() == source_flow, "shared flow copy differs")
    if "HUM-0011" in expected:
        authority_dir = root / "experiments/hum0011-authority"
        authority = json.loads((authority_dir / "scene.json").read_text(encoding="utf-8"))
        target = actual["HUM-0011"]
        require(target.get("authority_scene") == authority, "built authority scene differs from source")
        pins = authority.get("source", {})
        require(authority.get("story_id") == "HUM-0011", "authority scene/story mismatch")
        require(git_blob_sha(root / "stories/human/HUM-0011/meta.json") == pins.get("meta_blob_sha") and
                git_blob_sha(root / "stories/human/HUM-0011/content/tr.md") == pins.get("story_tr_blob_sha"),
                "authority source pins mismatch")
        require(set(authority.get("epistemic_layers", {})) == LAYERS, "missing authority epistemic layer")
        require(authority.get("spatial_brief", {}).get("pillars") == 12, "authority twelve-pillar context missing")
        require(target.get("observer_choices") == expected["HUM-0011"].get("observer_choices"),
                "authority canonical choices changed")
        require(set(authority.get("plans", {})) == {c["key"] for c in target.get("observer_choices", [])},
                "authority plan/choice mismatch")
        for lang in ("tr", "en"):
            require(bool(target.get("content", {}).get(lang)), "missing authority story text: " + lang)
        authority_order = ["./assets/observer-engine.v2.js", "./assets/hum0011-flow.v1.js",
                           "./assets/hum0011-authority-reader.v1.js", "./assets/app.js"]
        require(all(item in scripts for item in authority_order), "missing authority runtime")
        require([scripts.index(item) for item in authority_order] == sorted(scripts.index(item) for item in authority_order),
                "incorrect authority runtime order")
        require((site / "assets/hum0011-flow.v1.js").read_bytes() == (authority_dir / "flow.js").read_bytes(),
                "authority shared flow copy differs")

    for name in ("first-vibration-3d.v1.js", "thirteenth-notch-3d.v1.js"):
        require("./assets/" + name in scripts, "existing 3D runtime removed: " + name)
    return {
        "schema": "hcu-reader-build-report.v1",
        "build_version": payload.get("build_version"),
        "story_count": len(stories),
        "runtime_asset_count": len(hashes),
        "source_revision": source_scene["source_revision"],
        "checks": ["source_story_set", "center_totals_100", "FIRST_VIBRATION_origin",
                   "local_runtime_assets", "runtime_order", "scene_provenance",
                   "shared_flow_identity", "existing_3d_scripts"] + (["authority_scene_source_pins", "authority_shared_flow"] if "HUM-0011" in expected else []),
        "runtime_sha256": hashes,
        "not_verified": ["visual_rendering", "keyboard_focus", "screen_reader",
                         "mobile_layout", "3d_rendering", "human_editorial_review"]
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    try:
        report = verify(args.root)
    except (ValueError, OSError, KeyError, TypeError) as error:
        parser.exit(1, "Reader build verification failed: " + str(error) + "\n")
    if args.report:
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False))

if __name__ == "__main__":
    main()
