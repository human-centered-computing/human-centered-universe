from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
MAP = json.loads((ROOT / "universe" / "universe-map.json").read_text(encoding="utf-8"))
OUT = ROOT / "graph" / "universe.mmd"
OUT.parent.mkdir(parents=True, exist_ok=True)

lines = [
    "graph TD",
    '  HUMAN["Human Center"]',
    '  LIGHT["Light Center"]',
    '  DARK["Dark Center"]',
    "  HUMAN --- LIGHT",
    "  HUMAN --- DARK",
    "  LIGHT --- DARK",
    '  ORIGIN["BRG-0002 · First Vibration"]',
    "  ORIGIN ==> HUMAN",
    "  ORIGIN ==> LIGHT",
    "  ORIGIN ==> DARK"
]

for n in MAP.get("nodes", []):
    sid = n["id"]
    if sid == MAP.get("origin_node"):
        continue
    key = sid.replace("-", "_")
    title = n["title"].replace('"', "'")
    w = n["center_weights"]
    lines.append(f'  {key}["{sid} · {title}"]')
    lines.append(f'  {key} -- "{w["HUMAN"]}%" --> HUMAN')
    lines.append(f'  {key} -- "{w["LIGHT"]}%" --> LIGHT')
    lines.append(f'  {key} -- "{w["DARK"]}%" --> DARK')

OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("Wrote", OUT)
