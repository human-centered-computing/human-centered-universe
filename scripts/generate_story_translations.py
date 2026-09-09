#!/usr/bin/env python3
"""Generate missing Human-Centered Universe story translations.

Provider: any OpenAI-compatible Chat Completions endpoint.
Required environment variables:
  TRANSLATION_API_KEY
  TRANSLATION_API_BASE   e.g. https://provider.example/v1
  TRANSLATION_MODEL

Generated non-English files are declared as machine_draft in meta.json.
English remains canonical and is never overwritten.
"""
from pathlib import Path
import argparse, json, os, time, urllib.request, urllib.error

ROOT = Path(__file__).resolve().parents[1]
STORIES = ROOT / "stories"
CONFIG = ROOT / "config" / "supported-languages.json"


def env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise SystemExit(f"Missing environment variable: {name}")
    return value


def call_chat(api_base: str, api_key: str, model: str, target_name: str, target_code: str, source: str) -> str:
    url = api_base.rstrip("/") + "/chat/completions"
    system = (
        "You are a literary translator for Human-Centered Universe. Translate faithfully, not creatively. "
        "Preserve Markdown structure, headings, blockquotes, horizontal rules, emphasis, proper names, story IDs, "
        "HUMAN/LIGHT/DARK architecture terms when they are technical labels, and all factual meaning. "
        "Do not summarize, omit, add commentary, or wrap the answer in code fences. "
        "Return only the translated Markdown."
    )
    user = (
        f"Target language: {target_name} ({target_code}).\n"
        "Translate the following canonical English story into the target language.\n\n"
        "--- SOURCE START ---\n" + source + "\n--- SOURCE END ---"
    )
    payload = json.dumps({
        "model": model,
        "temperature": 0.2,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user}
        ]
    }).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")
        raise RuntimeError(f"Translation API HTTP {e.code}: {detail[:1000]}") from e
    text = body["choices"][0]["message"]["content"].strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if lines and lines[0].startswith("```"): lines = lines[1:]
        if lines and lines[-1].strip() == "```": lines = lines[:-1]
        text = "\n".join(lines).strip()
    if not text:
        raise RuntimeError("Translation API returned empty content")
    return text + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--langs", default="", help="Comma-separated codes; default: all configured languages except en,tr")
    ap.add_argument("--force", action="store_true", help="Overwrite existing target files")
    ap.add_argument("--limit", type=int, default=0, help="Process at most N story-language pairs")
    ap.add_argument("--sleep", type=float, default=0.4, help="Delay between API calls")
    args = ap.parse_args()

    api_key = env("TRANSLATION_API_KEY")
    api_base = env("TRANSLATION_API_BASE")
    model = env("TRANSLATION_MODEL")

    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    info = {x["code"]: x for x in cfg["languages"]}
    default_targets = [x["code"] for x in cfg["languages"] if x["code"] not in {"en", "tr"}]
    targets = [x.strip() for x in args.langs.split(",") if x.strip()] or default_targets
    unknown = [x for x in targets if x not in info]
    if unknown:
        raise SystemExit(f"Unsupported language code(s): {', '.join(unknown)}")
    if "en" in targets:
        raise SystemExit("English is canonical and cannot be generated as a translation")

    processed = 0
    for mp in sorted(STORIES.rglob("meta.json")):
        meta = json.loads(mp.read_text(encoding="utf-8"))
        sid = meta.get("id", mp.parent.name)
        source_path = mp.parent / "content" / "en.md"
        if not source_path.exists():
            print(f"SKIP {sid}: missing content/en.md")
            continue
        source = source_path.read_text(encoding="utf-8")
        translations = meta.setdefault("translations", {})
        translations.setdefault("en", {"status": "canonical"})

        for lang in targets:
            target_path = mp.parent / "content" / f"{lang}.md"
            if target_path.exists() and not args.force:
                print(f"SKIP {sid}/{lang}: exists")
                continue
            if args.limit and processed >= args.limit:
                print("Limit reached")
                return

            label = info[lang]["name"]
            print(f"TRANSLATE {sid}: en -> {lang} ({label})")
            translated = call_chat(api_base, api_key, model, label, lang, source)
            target_path.write_text(translated, encoding="utf-8")
            translations[lang] = {"status": "machine_draft"}
            mp.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            processed += 1
            if args.sleep:
                time.sleep(args.sleep)

    print(f"Generated/updated {processed} story-language pair(s).")

if __name__ == "__main__":
    main()
