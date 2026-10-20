from pathlib import Path
import json, sys, math, re

ROOT = Path(__file__).resolve().parents[1]
STORIES = ROOT / "stories"
MAP_PATH = ROOT / "universe" / "universe-map.json"
LANGUAGE_POLICY_PATH = ROOT / "config" / "language-policy.json"
CENTERS = {"HUMAN", "LIGHT", "DARK"}
VALID_STATUS = {"core", "canon", "experimental", "fork"}
VALID_TRANSLATION_STATUS = {"canonical", "reviewed", "community", "machine_draft"}
GITHUB_REPO_PATTERN = re.compile(r"^https://github\.com/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))/([A-Za-z0-9._-]+)/?$")
VALID_LINKS = {"quantum_echo", "echo", "contrast", "cause", "memory", "future", "character", "place", "artifact", "theme", "transformation", "parallel"}
ORIGIN = "BRG-0002"

errors = []
all_ids = {}
live_ids = set()

language_policy = json.loads(LANGUAGE_POLICY_PATH.read_text(encoding="utf-8")) if LANGUAGE_POLICY_PATH.exists() else {}
CANONICAL_LANGUAGE = language_policy.get("canonical_language", "en")

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

def valid_reality_weaving(value, where):
    if value is None:
        return
    if not isinstance(value, dict):
        errors.append(f"{where}: reality_weaving must be an object")
        return
    if value.get("mode") != "woven":
        errors.append(f"{where}: reality_weaving mode must be woven")
    roots = value.get("reality_roots")
    if not isinstance(roots, list) or not roots or not all(isinstance(x, str) and x.strip() for x in roots):
        errors.append(f"{where}: reality_weaving requires non-empty reality_roots")
    for key in {"imaginative_transformation", "emergent_question"}:
        if not isinstance(value.get(key), str) or not value[key].strip():
            errors.append(f"{where}: reality_weaving requires {key}")
    provenance = value.get("provenance", [])
    if not isinstance(provenance, list):
        errors.append(f"{where}: reality_weaving provenance must be a list")
    else:
        for i, source in enumerate(provenance):
            if not isinstance(source, dict) or not source.get("title") or not source.get("uri"):
                errors.append(f"{where}: reality_weaving provenance {i+1} requires title/uri")

def validate_story_projects(value, where):
    if value is None:
        return
    if not isinstance(value, list):
        errors.append(f"{where}: projects must be an array")
        return
    seen = set()
    for index, project in enumerate(value, start=1):
        label = f"{where}: project {index}"
        if not isinstance(project, dict):
            errors.append(f"{label} must be an object")
            continue
        name = project.get("name")
        url = project.get("github_url")
        if not isinstance(name, str) or not name.strip():
            errors.append(f"{label} requires a non-empty name")
        match = GITHUB_REPO_PATTERN.fullmatch(url) if isinstance(url, str) else None
        if not match or match.group(1).endswith("-") or match.group(2) in {".", ".."}:
            errors.append(f"{label} requires a GitHub HTTPS repository URL (owner/repo)")
        elif url.rstrip("/").lower() in seen:
            errors.append(f"{label} duplicates an existing GitHub repository")
        else:
            seen.add(url.rstrip("/").lower())
        description = project.get("description")
        if description is not None:
            if isinstance(description, str):
                if not description.strip():
                    errors.append(f"{label}: description must not be empty")
            elif isinstance(description, dict):
                if not description or any(not isinstance(k, str) or not k or not isinstance(v, str) or not v.strip() for k, v in description.items()):
                    errors.append(f"{label}: description translations must be non-empty strings")
            else:
                errors.append(f"{label}: description must be text or a language map")

for mp in STORIES.rglob("meta.json"):
    try:
        d = json.loads(mp.read_text(encoding="utf-8"))
    except Exception as e:
        errors.append(f"{mp}: invalid JSON: {e}")
        continue

    for key in {"id", "title", "status", "source_language", "culture", "belief_context", "summary", "translations", "links"}:
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

    valid_reality_weaving(d.get("reality_weaving"), str(mp))
    validate_story_projects(d.get("projects"), str(mp))

    content_dir = mp.parent / "content"
    source_only = d.get("translation_policy") == "source_only_until_reviewed"
    source_language = d.get("source_language")
    if source_only:
        if source_language != "tr" or d.get("core") != "WORK":
            errors.append(f"{mp}: source-only exception applies to Turkish WORK stories")
        if not (content_dir / "tr.md").exists():
            errors.append(f"{mp}: missing original content/tr.md")
    else:
        canonical_file = content_dir / f"{CANONICAL_LANGUAGE}.md"
        if not canonical_file.exists():
            errors.append(f"{mp}: missing canonical content/{CANONICAL_LANGUAGE}.md")
        if source_language != CANONICAL_LANGUAGE:
            errors.append(f"{mp}: source_language must be {CANONICAL_LANGUAGE}")

    translations = d.get("translations", {})
    canonical_entry = translations.get(CANONICAL_LANGUAGE, {})
    if not canonical_entry and not source_only:
        errors.append(f"{mp}: missing translation metadata for {CANONICAL_LANGUAGE}")
    elif canonical_entry and canonical_entry.get("status") not in VALID_TRANSLATION_STATUS:
        errors.append(f"{mp}: invalid translation status for {CANONICAL_LANGUAGE}")
    elif canonical_entry and canonical_entry.get("status") != "canonical" and not source_only:
        errors.append(f"{mp}: {CANONICAL_LANGUAGE} translation status must be canonical")

    for lang, entry in translations.items():
        if entry.get("status") not in VALID_TRANSLATION_STATUS:
            errors.append(f"{mp}: invalid translation status for {lang}")
        if not (content_dir / f"{lang}.md").exists():
            errors.append(f"{mp}: missing content/{lang}.md")

    if content_dir.exists():
        for cf in content_dir.glob("*.md"):
            if cf.stem not in translations:
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
                    if not isinstance(v, (int, float)) or v < 0 or v > 10:
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
if sorted(orders) != list(range(1, len(orders) + 1)):
    errors.append("observation_order must be a continuous 1..N sequence")

if errors:
    print("VALIDATION FAILED")
    for e in errors:
        print("-", e)
    sys.exit(1)

print(f"OK: {len(all_ids)} total story nodes; {len(live_ids)} live nodes validated.")
print(f"Canonical story language: {CANONICAL_LANGUAGE}")
print(f"Origin: {ORIGIN}; centers: HUMAN / LIGHT / DARK")
