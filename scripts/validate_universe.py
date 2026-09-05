from pathlib import Path
import json, sys, math

ROOT = Path(__file__).resolve().parents[1]
STORIES = ROOT / "stories"
MAP_PATH = ROOT / "universe" / "universe-map.json"
CENTERS = {"HUMAN", "LIGHT", "DARK"}
VALID_STATUS = {"core", "canon", "experimental", "fork"}
VALID_TRANSLATION_STATUS = {"canonical", "reviewed", "community", "machine_draft"}
VALID_LINKS = {"quantum_echo", "echo", "contrast", "cause", "memory", "future", "character", "place", "artifact", "theme", "transformation", "parallel"}
ORIGIN = "BRG-0002"

errors = []
all_ids = {}
live_ids = set()

if not MAP_PATH.exists():
    errors.append("universe/universe-map.json is required")
    universe_map = {}
else:
    universe_map = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    if universe_map.get("origin_node") != ORIGIN:
        errors.append(f"origin_node must be {ORIGIN}")
    if set(universe_map.get("centers", [])) != CENTERS:
        errors.append("universe map centers must be HUMAN, LIGHT and DARK")

mapped = {n.get("id"): n for n in universe_map.get("nodes", [])}

def valid_weights(weights, where):
    if not isinstance(weights, dict) or set(weights) != CENTERS:
        errors.append(f"{where}: center_weights must contain exactly HUMAN/LIGHT/DARK")
        return
    vals = []
    for c in CENTERS:
        v = weights.get(c)
        if not isinstance(v, (int, float)) or not math.isfinite(v) or v < 0 or v > 100:
            errors.append(f"{where}: invalid {c} weight")
            return
        vals.append(v)
    if abs(sum(vals) - 100) > 1e-9:
        errors.append(f"{where}: center_weights must sum to 100")

for mp in STORIES.rglob("meta.json"):
    try:
        d = json.loads(mp.read_text(encoding="utf-8"))
    except Exception as e:
        errors.append(f"{mp}: invalid JSON: {e}")
        continue

    for key in {"id","title","status","source_language","culture","belief_context","summary","translations","links"}:
        if key not in d:
            errors.append(f"{mp}: missing {key}")
    if "id" not in d:
        continue

    sid = d["id"]
    if sid in all_ids:
        errors.append(f"{mp}: duplicate id {sid}")
    all_ids[sid] = (mp, d)

    if d.get("status") not in VALID_STATUS:
        errors.append(f"{mp}: invalid status")
    if d.get("source_language") != "en":
        errors.append(f"{mp}: source_language must be en for canonical metadata")

    content_dir = mp.parent / "content"
    if not (content_dir / "en.md").exists():
        errors.append(f"{mp}: missing content/en.md")
    if d.get("translations", {}).get("en", {}).get("status") != "canonical":
        errors.append(f"{mp}: en translation status must be canonical")

    for lang, entry in d.get("translations", {}).items():
        if entry.get("status") not in VALID_TRANSLATION_STATUS:
            errors.append(f"{mp}: invalid translation status for {lang}")
        if not (content_dir / f"{lang}.md").exists():
            errors.append(f"{mp}: missing content/{lang}.md")

    if content_dir.exists():
        for cf in content_dir.glob("*.md"):
            if cf.stem not in d.get("translations", {}):
                errors.append(f"{mp}: undeclared translation {cf.stem}")

    for link in d.get("links", []):
        if link.get("type") not in VALID_LINKS:
            errors.append(f"{mp}: invalid link type {link.get('type')}")

    if d.get("status") in {"canon", "core"}:
        live_ids.add(sid)
        analysis_path = mp.parent / "analysis.json"
        analysis = json.loads(analysis_path.read_text(encoding="utf-8")) if analysis_path.exists() else {}
        node = mapped.get(sid, {})
        primary = analysis.get("primary_center", node.get("primary_center", d.get("primary_center")))
        weights = analysis.get("center_weights", node.get("center_weights", d.get("center_weights")))
        if primary not in CENTERS:
            errors.append(f"{mp}: live story requires primary_center HUMAN/LIGHT/DARK")
        valid_weights(weights, str(mp))
        if isinstance(weights, dict) and primary in CENTERS:
            mx = max(weights.values())
            if weights.get(primary) != mx:
                errors.append(f"{mp}: primary_center must be one of the maximum center weights")

        choices = d.get("observer_choices") or analysis.get("observer_choices") or []
        for i, choice in enumerate(choices):
            if not choice.get("key") or not choice.get("label"):
                errors.append(f"{mp}: observer choice {i+1} missing key/label")
            effects = choice.get("effects", {})
            if set(effects) != CENTERS:
                errors.append(f"{mp}: observer choice {i+1} effects must contain HUMAN/LIGHT/DARK")
            else:
                for c, v in effects.items():
                    if not isinstance(v, (int,float)) or v < 0 or v > 10:
                        errors.append(f"{mp}: observer choice {i+1} invalid {c} effect")

for sid, (mp, d) in all_ids.items():
    for link in d.get("links", []):
        if link.get("target") not in all_ids:
            errors.append(f"{mp}: unknown target {link.get('target')}")

if ORIGIN not in live_ids:
    errors.append(f"{ORIGIN} must be a live origin node")

mapped_ids = set(mapped)
if not mapped_ids.issubset(live_ids):
    errors.append(f"universe map contains non-live nodes: {sorted(mapped_ids-live_ids)}")

orders = [n.get("observation_order") for n in mapped.values()]
if sorted(orders) != list(range(1, len(orders)+1)):
    errors.append("observation_order must be a continuous 1..N sequence")

if errors:
    print("VALIDATION FAILED")
    for e in errors:
        print("-", e)
    sys.exit(1)

print(f"OK: {len(all_ids)} total story nodes; {len(live_ids)} live nodes validated.")
print(f"Origin: {ORIGIN}; centers: HUMAN / LIGHT / DARK")
