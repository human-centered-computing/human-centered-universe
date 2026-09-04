from pathlib import Path
import json, shutil, hashlib, os
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
SITE = ROOT / "site"
STORIES = ROOT / "stories"

if SITE.exists():
    shutil.rmtree(SITE)
shutil.copytree(WEB, SITE)

(SITE / "data").mkdir(parents=True, exist_ok=True)
(SITE / ".nojekyll").write_text("", encoding="utf-8")

canon_order = {}
canon_path = ROOT / "universe" / "canon-map.v0.2.json"
if not canon_path.exists():
    canon_path = ROOT / "universe" / "canon-map.v0.1.json"
if canon_path.exists():
    canon = json.loads(canon_path.read_text(encoding="utf-8"))
    for chapter in canon.get("chapters", []):
        canon_order[chapter["id"]] = chapter.get("order", 9999)

cores = {}
for p in (ROOT / "universe" / "cores").glob("*.json"):
    data = json.loads(p.read_text(encoding="utf-8"))
    cores[data["id"]] = data

locales = {}
for p in (ROOT / "locales").glob("*.json"):
    locales[p.stem] = json.loads(p.read_text(encoding="utf-8"))

stories = []
for meta_path in STORIES.rglob("meta.json"):
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    if meta.get("status") not in {"canon", "core"}:
        continue

    content_dir = meta_path.parent / "content"
    content = {}
    if content_dir.exists():
        for content_file in content_dir.glob("*.md"):
            content[content_file.stem] = content_file.read_text(encoding="utf-8")

    entry = dict(meta)
    entry["content"] = content
    entry["book_order"] = meta.get("book_order", canon_order.get(meta["id"], 9999))
    stories.append(entry)

stories.sort(key=lambda x: (x.get("book_order", 9999), x["id"]))

payload = {
    "project": "Human-Centered Universe",
    "repository": "https://github.com/human-centered-computing/human-centered-universe",
    "canonical_language": "en",
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "build_version": os.environ.get("GITHUB_SHA", "local"),
    "cores": cores,
    "locales": locales,
    "stories": stories,
}

(SITE / "data" / "universe.json").write_text(
    json.dumps(payload, ensure_ascii=False, indent=2),
    encoding="utf-8"
)

# Cache-bust static assets on every deployment.
# GitHub Pages/CDNs and browsers may otherwise keep an older app.js/styles.css
# under the same URL after a successful deployment.
def short_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:12]

index_path = SITE / "index.html"
index_html = index_path.read_text(encoding="utf-8")

app_path = SITE / "assets" / "app.js"
css_path = SITE / "assets" / "styles.css"

if app_path.exists():
    app_hash = short_hash(app_path)
    index_html = index_html.replace(
        './assets/app.js"',
        f'./assets/app.js?v={app_hash}"'
    )
else:
    app_hash = "missing"

if css_path.exists():
    css_hash = short_hash(css_path)
    index_html = index_html.replace(
        './assets/styles.css"',
        f'./assets/styles.css?v={css_hash}"'
    )
else:
    css_hash = "missing"

index_path.write_text(index_html, encoding="utf-8")

print(f"Interactive reader built: {len(stories)} live canon nodes.")
print(f"Asset versions: app={app_hash}, css={css_hash}")
print(f"Build version: {payload['build_version']}")
