#!/usr/bin/env python3
from pathlib import Path
import argparse, json

ROOT = Path(__file__).resolve().parents[1]
STORIES = ROOT / "stories"
CONFIG = ROOT / "config" / "supported-languages.json"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--strict", action="store_true", help="Exit non-zero when configured translations are missing")
    args = ap.parse_args()

    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    langs = [x["code"] for x in cfg["languages"]]
    metas = sorted(STORIES.rglob("meta.json"))
    counts = {lang: 0 for lang in langs}
    missing = {lang: [] for lang in langs}

    for mp in metas:
        meta = json.loads(mp.read_text(encoding="utf-8"))
        sid = meta.get("id", mp.parent.name)
        content_dir = mp.parent / "content"
        declared = meta.get("translations", {})
        for lang in langs:
            has_file = (content_dir / f"{lang}.md").exists()
            has_decl = lang in declared
            if has_file and has_decl:
                counts[lang] += 1
            else:
                missing[lang].append({"id": sid, "file": has_file, "declared": has_decl})

    total = len(metas)
    print(f"Stories: {total}")
    for lang in langs:
        print(f"{lang:6} {counts[lang]:>3}/{total:<3}  missing={len(missing[lang])}")

    report = {
        "story_count": total,
        "languages": langs,
        "coverage": {lang: {"complete": counts[lang], "missing": missing[lang]} for lang in langs}
    }
    out = ROOT / "translation-coverage.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Report: {out.relative_to(ROOT)}")

    configured_noncanonical = [x["code"] for x in cfg["languages"] if x["code"] not in {"en", "tr"}]
    if args.strict and any(missing[x] for x in configured_noncanonical):
        raise SystemExit(2)

if __name__ == "__main__":
    main()
