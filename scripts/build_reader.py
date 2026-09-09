from pathlib import Path
import json, shutil, hashlib, os
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
SITE = ROOT / "site"
STORIES = ROOT / "stories"
MAP_PATH = ROOT / "universe" / "universe-map.json"
LANGUAGE_POLICY_PATH = ROOT / "config" / "language-policy.json"

if SITE.exists():
    shutil.rmtree(SITE)
shutil.copytree(WEB, SITE)
(SITE / "data").mkdir(parents=True, exist_ok=True)
(SITE / ".nojekyll").write_text("", encoding="utf-8")

universe_map = json.loads(MAP_PATH.read_text(encoding="utf-8")) if MAP_PATH.exists() else {}
map_nodes = {n["id"]: n for n in universe_map.get("nodes", [])}
language_policy = json.loads(LANGUAGE_POLICY_PATH.read_text(encoding="utf-8")) if LANGUAGE_POLICY_PATH.exists() else {}
canonical_language = language_policy.get("canonical_language", "en")
default_language = language_policy.get("default_language", canonical_language)
fallback_language = language_policy.get("fallback_language", canonical_language)
interface_fallback_language = language_policy.get("interface_fallback_language", "en")
supported_languages = language_policy.get("supported_languages", ["tr", "en"])
rtl_languages = language_policy.get("rtl_languages", ["ar"])

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
    """Normalize retired narrative terminology in the generated reader only."""
    if isinstance(value, dict):
        return {k: migrate_legacy_terms(v, k if k in {"en", "tr"} else lang) for k, v in value.items()}
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

def read_story_record(meta_path: Path):
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    analysis_path = meta_path.parent / "analysis.json"
    analysis = json.loads(analysis_path.read_text(encoding="utf-8")) if analysis_path.exists() else {}
    mapped = map_nodes.get(meta.get("id"), {})
    content_dir = meta_path.parent / "content"
    content_languages = sorted(p.stem for p in content_dir.glob("*.md")) if content_dir.exists() else []
    return {
        "meta_path": meta_path,
        "meta": meta,
        "analysis": analysis,
        "mapped": mapped,
        "content_languages": content_languages,
    }

records = [read_story_record(p) for p in STORIES.rglob("meta.json")]

registry_stories = []
for rec in records:
    meta, analysis, mapped = rec["meta"], rec["analysis"], rec["mapped"]
    registry_stories.append({
        "id": meta.get("id"),
        "title": meta.get("title", meta.get("id")),
        "status": meta.get("status"),
        "primary_center": analysis.get("primary_center", mapped.get("primary_center", meta.get("primary_center"))),
        "center_weights": analysis.get("center_weights", mapped.get("center_weights", meta.get("center_weights"))),
        "content_languages": rec["content_languages"],
        "path": rec["meta_path"].parent.relative_to(ROOT).as_posix(),
    })

registry_stories = sorted([x for x in registry_stories if x.get("id")], key=lambda x: x["id"])
registry_payload = {
    "project": "Human-Centered Universe",
    "canonical_language": canonical_language,
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "all_story_ids": [x["id"] for x in registry_stories],
    "stories": registry_stories,
}
(SITE / "data" / "story-registry.json").write_text(
    json.dumps(registry_payload, ensure_ascii=False, indent=2), encoding="utf-8"
)

stories = []
languages = set(locales) | set(supported_languages)

for rec in records:
    meta, analysis, mapped = rec["meta"], rec["analysis"], rec["mapped"]
    if meta.get("status") not in {"canon", "core"}:
        continue

    content_dir = rec["meta_path"].parent / "content"
    content = {}
    if content_dir.exists():
        for content_file in content_dir.glob("*.md"):
            content[content_file.stem] = migrate_legacy_terms(
                content_file.read_text(encoding="utf-8"), content_file.stem
            )
            languages.add(content_file.stem)

    entry = migrate_legacy_terms(dict(meta))
    entry["content"] = content

    entry["observation_order"] = mapped.get(
        "observation_order", meta.get("observation_order", meta.get("book_order", 9999))
    )
    entry["primary_center"] = analysis.get(
        "primary_center", mapped.get("primary_center", meta.get("primary_center"))
    )
    entry["center_weights"] = analysis.get(
        "center_weights", mapped.get("center_weights", meta.get("center_weights"))
    )
    entry["observer_choices"] = meta.get("observer_choices") or analysis.get("observer_choices") or []
    if analysis:
        entry["classification"] = analysis.get("classification", meta.get("classification"))
        entry["coverage_audit"] = analysis.get("coverage_audit", meta.get("coverage_audit"))
    stories.append(entry)

stories.sort(key=lambda x: (x.get("observation_order", 9999), x["id"]))

language_order = {code: i for i, code in enumerate(supported_languages)}
payload = {
    "project": "Human-Centered Universe",
    "repository": "https://github.com/human-centered-computing/human-centered-universe",
    "canonical_language": canonical_language,
    "default_language": default_language,
    "fallback_language": fallback_language,
    "interface_fallback_language": interface_fallback_language,
    "rtl_languages": rtl_languages,
    "origin_node": universe_map.get("origin_node", "BRG-0002"),
    "centers": universe_map.get("centers", ["HUMAN", "LIGHT", "DARK"]),
    "temporal_model": universe_map.get("temporal_model", "observer_relational"),
    "routing_model": universe_map.get("routing_model", "dominant_center_unread"),
    "languages": sorted(languages, key=lambda x: (language_order.get(x, 999), x)),
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "build_version": os.environ.get("GITHUB_SHA", "local"),
    "cores": cores,
    "locales": locales,
    "stories": stories,
}

(SITE / "data" / "universe.json").write_text(
    json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
)

def patch_reader_runtime():
    """Apply multilingual reader behavior while keeping English canonical."""
    app_path = SITE / "assets" / "app.js"
    if not app_path.exists():
        return
    s = app_path.read_text(encoding="utf-8")
    replacements = [
        (
            'function t(key,fallback=key){ return state.data?.locales?.[state.locale]?.[key] || state.data?.locales?.en?.[key] || fallback; }',
            'function t(key,fallback=key){ const uiFallback=state.data?.interface_fallback_language||"en"; return state.data?.locales?.[state.locale]?.[key] || state.data?.locales?.[uiFallback]?.[key] || state.data?.locales?.en?.[key] || fallback; }'
        ),
        (
            'const requested=story.content?.[state.locale]; const content=requested||story.content?.en||""; const fallback=!requested&&state.locale!=="en";',
            'const requested=story.content?.[state.locale]; const fallbackLang=state.data?.fallback_language||"en"; const content=requested||story.content?.[fallbackLang]||story.content?.en||""; const fallback=!requested&&state.locale!==fallbackLang;'
        ),
        (
            'if(s==="community") return t("community_translation","Community Translation");',
            'if(s==="community") return t("community_translation","Community Translation"); if(s==="machine_draft") return t("machine_draft_translation","Machine Draft");'
        ),
        (
            'translationStatus(story,requested?state.locale:"en")',
            'translationStatus(story,requested?state.locale:(state.data?.fallback_language||"en"))'
        ),
        (
            'English is the canonical source; any language can be a source or translation layer under the same story ID.',
            'English is the canonical universal source; Turkish is the editorial working source used to refresh English and other translations when it is newer.'
        )
    ]
    for old, new in replacements:
        s = s.replace(old, new)
    s = s.replace(
        'document.documentElement.lang=state.locale;',
        'document.documentElement.lang=state.locale; document.documentElement.dir=(state.data?.rtl_languages||["ar"]).includes(state.locale)?"rtl":"ltr";'
    )
    app_path.write_text(s, encoding="utf-8")

patch_reader_runtime()

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
print(f"Story registry built: {len(registry_stories)} total committed story IDs.")
print(f"Canonical language: {canonical_language}; fallback: {fallback_language}")
print(f"Origin node: {payload['origin_node']}")
print(f"Centers: {', '.join(payload['centers'])}")
print(f"Asset versions: app={app_hash}, css={css_hash}")
