from pathlib import Path
import json, shutil, hashlib, os
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
SITE = ROOT / "site"
STORIES = ROOT / "stories"
MAP_PATH = ROOT / "universe" / "universe-map.json"

if SITE.exists():
    shutil.rmtree(SITE)
shutil.copytree(WEB, SITE)
(SITE / "data").mkdir(parents=True, exist_ok=True)
(SITE / ".nojekyll").write_text("", encoding="utf-8")

universe_map = json.loads(MAP_PATH.read_text(encoding="utf-8")) if MAP_PATH.exists() else {}
map_nodes = {n["id"]: n for n in universe_map.get("nodes", [])}

cores = {}
for p in (ROOT / "universe" / "cores").glob("*.json"):
    data = json.loads(p.read_text(encoding="utf-8"))
    if data.get("deprecated"):
        continue
    cores[data["id"]] = data

locales = {}
for p in (ROOT / "locales").glob("*.json"):
    locales[p.stem] = json.loads(p.read_text(encoding="utf-8"))

def migrate_legacy_terms(value, lang=None):
    """Normalize retired narrative terminology in the generated reader only.

    Stable source IDs and Git history remain intact; the live reader uses the
    current HUMAN / LIGHT / DARK vocabulary.
    """
    if isinstance(value, dict):
        return {k: migrate_legacy_terms(v, k if k in {"en","tr"} else lang) for k, v in value.items()}
    if isinstance(value, list):
        return [migrate_legacy_terms(v, lang) for v in value]
    if not isinstance(value, str):
        return value
    out = value
    replacements = [
        ("COMMON_CENTER", "HUMAN_CENTER"),
        ("Common Center", "Human Center"),
        ("Common center", "Human Center"),
        ("ORTAK_MERKEZ", "İNSAN_MERKEZİ"),
        ("Ortak Merkez", "İnsan Merkezi"),
        ("Ortak merkez", "İnsan Merkezi")
    ]
    for old, new in replacements:
        out = out.replace(old, new)
    if lang == "tr":
        out = out.replace("Ana canon", "Ana anlatı").replace("canon'u", "ana anlatıyı").replace("canon", "ana anlatı")
    return out

stories = []
languages = set(locales)
for meta_path in STORIES.rglob("meta.json"):
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    if meta.get("status") not in {"canon", "core"}:
        continue

    content_dir = meta_path.parent / "content"
    content = {}
    if content_dir.exists():
        for content_file in content_dir.glob("*.md"):
            content[content_file.stem] = migrate_legacy_terms(content_file.read_text(encoding="utf-8"), content_file.stem)
            languages.add(content_file.stem)

    analysis_path = meta_path.parent / "analysis.json"
    analysis = {}
    if analysis_path.exists():
        analysis = json.loads(analysis_path.read_text(encoding="utf-8"))

    mapped = map_nodes.get(meta["id"], {})
    entry = migrate_legacy_terms(dict(meta))
    entry["content"] = content
    entry["observation_order"] = mapped.get(
        "observation_order", meta.get("observation_order", meta.get("book_order", 9999))
    )
    entry["primary_center"] = analysis.get("primary_center", mapped.get("primary_center", meta.get("primary_center")))
    entry["center_weights"] = analysis.get("center_weights", mapped.get("center_weights", meta.get("center_weights")))
    entry["observer_choices"] = meta.get("observer_choices") or analysis.get("observer_choices") or []
    if analysis:
        entry["classification"] = analysis.get("classification", meta.get("classification"))
        entry["coverage_audit"] = analysis.get("coverage_audit", meta.get("coverage_audit"))
    stories.append(entry)

stories.sort(key=lambda x: (x.get("observation_order", 9999), x["id"]))

payload = {
    "project": "Human-Centered Universe",
    "repository": "https://github.com/human-centered-computing/human-centered-universe",
    "canonical_language": universe_map.get("canonical_language", "en"),
    "default_language": universe_map.get("default_language", "en"),
    "origin_node": universe_map.get("origin_node", "BRG-0002"),
    "centers": universe_map.get("centers", ["HUMAN", "LIGHT", "DARK"]),
    "temporal_model": universe_map.get("temporal_model", "observer_relational"),
    "routing_model": universe_map.get("routing_model", "dominant_center_unread"),
    "languages": sorted(languages, key=lambda x: (x != "en", x)),
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "build_version": os.environ.get("GITHUB_SHA", "local"),
    "cores": cores,
    "locales": locales,
    "stories": stories,
}

(SITE / "data" / "universe.json").write_text(
    json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
)

def short_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:12]

index_path = SITE / "index.html"
index_html = index_path.read_text(encoding="utf-8")
app_path = SITE / "assets" / "app.js"
css_path = SITE / "assets" / "styles.css"

app_hash = short_hash(app_path) if app_path.exists() else "missing"
css_hash = short_hash(css_path) if css_path.exists() else "missing"
index_html = index_html.replace('./assets/app.js"', f'./assets/app.js?v={app_hash}"')
index_html = index_html.replace('./assets/styles.css"', f'./assets/styles.css?v={css_hash}"')
index_path.write_text(index_html, encoding="utf-8")

print(f"Interactive reader built: {len(stories)} live story nodes.")
print(f"Origin node: {payload['origin_node']}")
print(f"Centers: {', '.join(payload['centers'])}")
print(f"Asset versions: app={app_hash}, css={css_hash}")
