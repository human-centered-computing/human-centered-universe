from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
STORIES = ROOT / "stories"
MAP_PATH = ROOT / "universe" / "universe-map.json"
OUT = ROOT / "graph" / "universe.mmd"
OUT.parent.mkdir(parents=True, exist_ok=True)

universe_map = json.loads(MAP_PATH.read_text(encoding="utf-8")) if MAP_PATH.exists() else {}
mapped = {n.get("id"): n for n in universe_map.get("nodes", [])}
origin = universe_map.get("origin_node", "BRG-0002")

def key_for(sid: str) -> str:
    return re.sub(r"[^A-Za-z0-9_]", "_", sid)

def esc(value) -> str:
    return str(value or "").replace('"', "'").replace("\n", " ")

live = []
for meta_path in STORIES.rglob("meta.json"):
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    if meta.get("status") not in {"canon", "core"}:
        continue

    analysis_path = meta_path.parent / "analysis.json"
    analysis = json.loads(analysis_path.read_text(encoding="utf-8")) if analysis_path.exists() else {}
    map_node = mapped.get(meta["id"], {})

    primary = analysis.get("primary_center", map_node.get("primary_center", meta.get("primary_center")))
    weights = analysis.get("center_weights", map_node.get("center_weights", meta.get("center_weights")))
    order = map_node.get(
        "observation_order",
        meta.get("observation_order", meta.get("book_order", 9999))
    )

    live.append({
        "id": meta["id"],
        "title": meta.get("title", meta["id"]),
        "primary_center": primary,
        "center_weights": weights or {},
        "observation_order": order,
        "links": meta.get("links", []),
    })

live.sort(key=lambda x: (x["observation_order"], x["id"]))
live_ids = {x["id"] for x in live}

lines = [
    "graph TD",
    '  HUMAN["Human Center"]',
    '  LIGHT["Light Center"]',
    '  DARK["Dark Center"]',
    "  HUMAN --- LIGHT",
    "  HUMAN --- DARK",
    "  LIGHT --- DARK",
]

for story in live:
    sid = story["id"]
    key = key_for(sid)
    title = esc(story["title"])
    shape_open, shape_close = ('(["', '"])') if sid == origin else ('["', '"]')
    lines.append(f'  {key}{shape_open}{sid} · {title}{shape_close}')

    w = story.get("center_weights") or {}
    for center in ("HUMAN", "LIGHT", "DARK"):
        if center in w:
            lines.append(f'  {key} -- "{w[center]}%" --> {center}')

for story in live:
    src = key_for(story["id"])
    for link in story.get("links", []):
        target = link.get("target")
        if target not in live_ids:
            continue
        dst = key_for(target)
        link_type = esc(link.get("type", "echo"))
        lines.append(f'  {src} -. "{link_type}" .-> {dst}')

OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Wrote {OUT} with {len(live)} live story nodes.")
