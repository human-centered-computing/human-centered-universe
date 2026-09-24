#!/usr/bin/env python3
"""Generate missing Human-Centered Universe story translations.

Provider: any OpenAI-compatible Chat Completions endpoint.
Required environment variables:
  TRANSLATION_API_KEY
  TRANSLATION_API_BASE   e.g. https://provider.example/v1
  TRANSLATION_MODEL

Generated files are declared as machine_draft in meta.json. For the Turkish
WORK memoirs, English is translated from the original Turkish text and is
never represented as human-reviewed or canonical before review.
"""
from pathlib import Path
import argparse, json, os, re, time, urllib.request, urllib.error, urllib.parse

ROOT = Path(__file__).resolve().parents[1]
STORIES = ROOT / "stories"
CONFIG = ROOT / "config" / "language-policy.json"
LANGUAGE_NAMES = {
    "en": "English", "tr": "Turkish", "de": "German", "es": "Spanish",
    "fr": "French", "it": "Italian", "ru": "Russian", "zh-CN": "Simplified Chinese",
    "ja": "Japanese", "ar": "Arabic", "ku": "Kurdish", "pt": "Portuguese",
}


def env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise SystemExit(f"Missing environment variable: {name}")
    return value


def call_chat(api_base: str, api_key: str, model: str, target_name: str, target_code: str,
              source_name: str, source_code: str, source: str) -> str:
    url = api_base.rstrip("/") + "/chat/completions"
    system = (
        "You are a literary translator for Human-Centered Universe. Translate faithfully, not creatively. "
        "Preserve Markdown structure, headings, blockquotes, horizontal rules, emphasis, dialogue, proper names, story IDs, "
        "HUMAN/LIGHT/DARK architecture terms when they are technical labels, and all factual meaning. "
        "Do not summarize, omit, add commentary, or wrap the answer in code fences. "
        "Return only the translated Markdown."
    )
    user = (
        f"Target language: {target_name} ({target_code}).\n"
        f"Translate this complete {source_name} ({source_code}) story into {target_name}. "
        "Keep every scene, paragraph and the literary rhythm.\n\n"
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


def install_argos_turkish_english():
    """Load the public, offline Turkish→English package once per run."""
    import argostranslate.package
    import argostranslate.translate

    argostranslate.package.update_package_index()
    candidates = [p for p in argostranslate.package.get_available_packages()
                  if p.from_code == "tr" and p.to_code == "en"]
    if not candidates:
        raise RuntimeError("Argos package index has no Turkish→English model")
    package = candidates[0]
    print(f"Installing Argos tr→en model {package.package_version}", flush=True)
    argostranslate.package.install_from_path(package.download())
    return argostranslate.translate


def translate_argos(source: str, english_title: str, engine) -> str:
    """Keep paragraph and Markdown boundaries while translating each prose block."""
    parts = re.split(r"(\n\s*\n)", source)
    translated = []
    for block in parts:
        if not block.strip() or block.strip() in {"***", "---"}:
            translated.append(block)
        elif block.startswith("# "):
            translated.append("# " + english_title)
        elif block.startswith("> "):
            translated.append("> " + engine.translate(block[2:], "tr", "en").strip())
        else:
            translated.append(engine.translate(block.strip(), "tr", "en").strip())
    result = "".join(translated).rstrip() + "\n"
    if len(result.split()) < len(source.split()) * .45:
        raise RuntimeError("English output is unexpectedly short; refusing partial translation")
    if not result.startswith("# " + english_title):
        raise RuntimeError("English story heading was lost")
    return result


def translate_google(source: str, english_title: str) -> str:
    """Translate public Turkish prose in small requests; retain Markdown blocks."""
    cache = {}

    def request(chunk: str) -> str:
        if chunk in cache:
            return cache[chunk]
        params = urllib.parse.urlencode({"client": "gtx", "sl": "tr", "tl": "en",
                                         "dt": "t", "q": chunk})
        req = urllib.request.Request(
            "https://translate.googleapis.com/translate_a/single?" + params,
            headers={"User-Agent": "Mozilla/5.0 Human-Centered-Universe-Translation/1.0"})
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=40) as response:
                    data = json.load(response)
                result = "".join(part[0] or "" for part in data[0]).strip()
                if not result:
                    raise RuntimeError("Translation service returned empty text")
                cache[chunk] = result
                time.sleep(.18)
                return result
            except (urllib.error.URLError, TimeoutError) as error:
                if attempt == 3:
                    raise RuntimeError(f"Translation service unavailable: {error}") from error
                time.sleep(2 ** attempt)
        raise AssertionError("unreachable")

    body = re.sub(r"^#\s+[^\n]+\n*", "", source).strip()
    blocks = [block.strip() for block in re.split(r"\n\s*\n", body) if block.strip()]
    translated = []
    index = 0
    while index < len(blocks):
        if blocks[index] in {"***", "---"}:
            translated.append(blocks[index]); index += 1; continue
        group = []
        while index < len(blocks) and blocks[index] not in {"***", "---"}:
            candidate = blocks[index]
            if group and len("\n\n".join(group)) + len(candidate) > 900:
                break
            group.append(candidate); index += 1
        joined = "\n\n".join(group)
        output = request(joined)
        split = re.split(r"\n\s*\n", output)
        if len(split) != len(group):
            split = [request(part) for part in group]
        translated.extend(part.strip() for part in split)
    result = "# " + english_title + "\n\n" + "\n\n".join(translated).strip() + "\n"
    if len(result.split()) < len(source.split()) * .45:
        raise RuntimeError("English output is unexpectedly short; refusing partial translation")
    return result


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--langs", default="", help="Comma-separated codes; default: all configured languages except en,tr")
    ap.add_argument("--force", action="store_true", help="Overwrite existing target files")
    ap.add_argument("--limit", type=int, default=0, help="Process at most N story-language pairs")
    ap.add_argument("--sleep", type=float, default=0.4, help="Delay between API calls")
    ap.add_argument("--provider", choices=("auto", "api", "argos", "google"), default="auto")
    args = ap.parse_args()

    has_api = all(os.environ.get(name, "").strip() for name in
                  ("TRANSLATION_API_KEY", "TRANSLATION_API_BASE", "TRANSLATION_MODEL"))
    provider = "api" if args.provider == "auto" and has_api else (
        "argos" if args.provider == "auto" else args.provider)
    if provider == "api":
        api_key = env("TRANSLATION_API_KEY")
        api_base = env("TRANSLATION_API_BASE")
        model = env("TRANSLATION_MODEL")

    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    info = {code: LANGUAGE_NAMES.get(code, code) for code in cfg["supported_languages"]}
    default_targets = [code for code in cfg["supported_languages"] if code not in {"en", "tr"}]
    targets = [x.strip() for x in args.langs.split(",") if x.strip()] or default_targets
    unknown = [x for x in targets if x not in info]
    if unknown:
        raise SystemExit(f"Unsupported language code(s): {', '.join(unknown)}")
    if provider in {"argos", "google"} and targets != ["en"]:
        raise SystemExit("This provider currently supports only tr→en WORK translations")
    engine = install_argos_turkish_english() if provider == "argos" else None
    processed = 0
    for mp in sorted(STORIES.rglob("meta.json")):
        meta = json.loads(mp.read_text(encoding="utf-8"))
        sid = meta.get("id", mp.parent.name)
        translations = meta.setdefault("translations", {})

        for lang in targets:
            if lang == "en":
                if not (meta.get("core") == "WORK" and meta.get("source_language") == "tr"
                        and meta.get("translation_policy") == "source_only_until_reviewed"):
                    continue
                source_code, source_name = "tr", "Turkish"
            else:
                source_code, source_name = "en", "English"
            source_path = mp.parent / "content" / f"{source_code}.md"
            if not source_path.exists():
                print(f"SKIP {sid}/{lang}: missing {source_path.name}")
                continue
            target_path = mp.parent / "content" / f"{lang}.md"
            if target_path.exists() and not args.force:
                print(f"SKIP {sid}/{lang}: exists")
                continue
            if args.limit and processed >= args.limit:
                print("Limit reached")
                return

            label = info[lang]
            print(f"TRANSLATE {sid}: {source_code} -> {lang} ({label})")
            source = source_path.read_text(encoding="utf-8")
            if provider == "argos":
                english_title = meta.get("localized", {}).get("en", {}).get("title", meta["title"])
                translated = translate_argos(source, english_title, engine)
            elif provider == "google":
                english_title = meta.get("localized", {}).get("en", {}).get("title", meta["title"])
                translated = translate_google(source, english_title)
            else:
                translated = call_chat(api_base, api_key, model, label, lang,
                                       source_name, source_code, source)
            target_path.write_text(translated, encoding="utf-8")
            translations[lang] = {"status": "machine_draft", "human_reviewed": False,
                                  "source_language": source_code}
            mp.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            processed += 1
            if args.sleep and provider == "api":
                time.sleep(args.sleep)

    print(f"Generated/updated {processed} story-language pair(s).")

if __name__ == "__main__":
    main()
