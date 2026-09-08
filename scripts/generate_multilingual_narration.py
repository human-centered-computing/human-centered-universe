#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAP_PATH = ROOT / "universe" / "universe-map.json"
STORIES = ROOT / "stories"
VOICE_CONFIG = ROOT / "config" / "tts-voices.json"
CACHE = ROOT / ".cache" / "piper"
OUTPUT_ROOT = ROOT / "web" / "assets" / "audio"
MAX_CHARS = 560


def sh(cmd: list[str], *, capture=False) -> subprocess.CompletedProcess:
    print("+", " ".join(map(str, cmd)))
    return subprocess.run(
        cmd,
        check=True,
        text=True,
        capture_output=capture,
        cwd=ROOT,
    )


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def canon():
    """Return every live story from committed story metadata."""
    universe_map = load_json(MAP_PATH) if MAP_PATH.exists() else {}
    mapped = {n.get("id"): n for n in universe_map.get("nodes", [])}

    stories = []
    for meta_path in STORIES.rglob("meta.json"):
        story = load_json(meta_path)
        if story.get("status") not in {"canon", "core"}:
            continue
        map_node = mapped.get(story.get("id"), {})
        story["_observation_order"] = map_node.get(
            "observation_order",
            story.get("observation_order", story.get("book_order", 9999)),
        )
        stories.append(story)

    stories.sort(
        key=lambda x: (x.get("_observation_order", 9999), x.get("id", ""))
    )
    return stories


def voices():
    return load_json(VOICE_CONFIG)["languages"]


def story_content_map() -> dict[tuple[str, str], Path]:
    result = {}
    for p in STORIES.rglob("content/*.md"):
        if p.name.startswith("."):
            continue
        lang = p.stem
        try:
            sid = p.parts[-3]
        except IndexError:
            continue
        result[(sid, lang)] = p
    return result


def clean_markdown(md: str) -> str:
    md = re.sub(r"```.*?```", "", md, flags=re.S)
    md = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", md)
    md = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", md)
    md = re.sub(r"^\s{0,3}#{1,6}\s+", "", md, flags=re.M)
    md = re.sub(r"^\s*>\s?", "", md, flags=re.M)
    md = re.sub(r"^\s*[-*+]\s+", "", md, flags=re.M)
    md = re.sub(r"^\s*\d+\.\s+", "", md, flags=re.M)
    md = re.sub(r"^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$", "", md, flags=re.M)
    md = md.replace("**", "").replace("__", "").replace("`", "")
    md = re.sub(r"(?<!\*)\*(?!\*)", "", md)
    md = re.sub(r"[ \t]+", " ", md)
    md = re.sub(r"\n{3,}", "\n\n", md)
    return md.strip()


def split_long(text: str, max_chars: int = MAX_CHARS) -> list[str]:
    text = text.strip()
    if not text:
        return []
    if len(text) <= max_chars:
        return [text]

    sentences = re.split(r"(?<=[.!?…])\s+", text)
    chunks = []
    current = ""

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        candidate = f"{current} {sentence}".strip()
        if len(candidate) <= max_chars:
            current = candidate
            continue

        if current:
            chunks.append(current)
            current = ""

        if len(sentence) <= max_chars:
            current = sentence
            continue

        words = sentence.split()
        buf = ""
        for word in words:
            candidate = f"{buf} {word}".strip()
            if len(candidate) > max_chars and buf:
                chunks.append(buf)
                buf = word
            else:
                buf = candidate
        if buf:
            current = buf

    if current:
        chunks.append(current)
    return chunks


def chunks(md: str) -> list[str]:
    text = clean_markdown(md)
    blocks = [
        b.strip()
        for b in re.split(r"\n\s*\n", text)
        if b.strip() and re.search(r"\w", b, flags=re.UNICODE)
    ]
    out = []
    for block in blocks:
        out.extend(split_long(block))
    return out


def ensure_model(model: str) -> Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    model_path = CACHE / f"{model}.onnx"
    config_path = CACHE / f"{model}.onnx.json"

    if not model_path.exists() or not config_path.exists():
        sh(
            [
                sys.executable,
                "-m",
                "piper.download_voices",
                model,
                "--download-dir",
                str(CACHE),
            ]
        )

    if not model_path.exists():
        raise RuntimeError(f"Model was not downloaded: {model}")
    return model_path


def silence(path: Path, seconds=0.34):
    sh(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-f",
            "lavfi",
            "-i",
            "anullsrc=r=22050:cl=mono",
            "-t",
            str(seconds),
            "-c:a",
            "pcm_s16le",
            str(path),
        ]
    )


def synthesize(model_path: Path, length_scale: float, text: str, output_wav: Path):
    sh(
        [
            sys.executable,
            "-m",
            "piper",
            "-m",
            str(model_path),
            "-f",
            str(output_wav),
            "--length-scale",
            str(length_scale),
            "--sentence-silence",
            "0.16",
            "--",
            text,
        ]
    )


def duration(path: Path) -> float:
    cp = sh(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        capture=True,
    )
    return round(float(cp.stdout.strip()), 3)


def audio_path(sid: str, lang: str) -> Path:
    return OUTPUT_ROOT / lang / f"{sid}.mp3"


def resumable_audio_exists(sid: str, lang: str) -> bool:
    """Treat an already committed non-empty MP3 as a completed checkpoint."""
    path = audio_path(sid, lang)
    return path.exists() and path.stat().st_size > 1024


def generate(sid: str, lang: str, path: Path, story: dict, voice: dict):
    model = voice["model"]
    model_path = ensure_model(model)
    out_dir = OUTPUT_ROOT / lang
    out_dir.mkdir(parents=True, exist_ok=True)
    out_mp3 = out_dir / f"{sid}.mp3"

    text_chunks = chunks(path.read_text(encoding="utf-8"))
    if not text_chunks:
        raise RuntimeError(f"No narration text: {sid}/{lang}")

    with tempfile.TemporaryDirectory(prefix=f"hcu-{lang}-{sid}-") as td:
        td = Path(td)
        gap = td / "gap.wav"
        silence(gap)
        lines = []

        for i, text in enumerate(text_chunks, start=1):
            wav = td / f"{i:04d}.wav"
            synthesize(
                model_path,
                float(voice.get("length_scale", 1.0)),
                text,
                wav,
            )
            lines.append(f"file '{wav.as_posix()}'")
            if i != len(text_chunks):
                lines.append(f"file '{gap.as_posix()}'")

        concat = td / "concat.txt"
        concat.write_text("\n".join(lines) + "\n", encoding="utf-8")

        sh(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(concat),
                "-ac",
                "1",
                "-ar",
                "22050",
                "-codec:a",
                "libmp3lame",
                "-b:a",
                "96k",
                str(out_mp3),
            ]
        )

    return {
        "id": sid,
        "title": story.get("original_title") if lang == "tr" else story.get("title", sid),
        "file": f"./{sid}.mp3",
        "duration_seconds": duration(out_mp3),
        "bytes": out_mp3.stat().st_size,
        "engine": "Piper",
        "voice": model,
    }


def changed_pairs(base_sha: str, available: set[tuple[str, str]]):
    if not base_sha or set(base_sha) == {"0"}:
        return sorted(available)

    cp = sh(
        [
            "git",
            "diff",
            "--name-only",
            base_sha,
            "HEAD",
            "--",
            "stories",
            "config/tts-voices.json",
        ],
        capture=True,
    )

    if "config/tts-voices.json" in cp.stdout:
        return sorted(available)

    pairs = set()
    for line in cp.stdout.splitlines():
        m = re.search(
            r"/([A-Z]{3}-\d{4})/content/([A-Za-z0-9_-]+)\.md$",
            line,
        )
        if m:
            pair = (m.group(1), m.group(2))
            if pair in available:
                pairs.add(pair)
    return sorted(pairs)


def write_manifest(lang: str, story_list: list[dict], voice: dict):
    out_dir = OUTPUT_ROOT / lang
    out_dir.mkdir(parents=True, exist_ok=True)
    entries = []

    for story in story_list:
        sid = story["id"]
        mp3 = out_dir / f"{sid}.mp3"
        if not mp3.exists():
            continue
        entries.append(
            {
                "id": sid,
                "title": story.get("original_title")
                if lang == "tr"
                else story.get("title", sid),
                "file": f"./{sid}.mp3",
                "duration_seconds": duration(mp3),
                "bytes": mp3.stat().st_size,
                "engine": "Piper",
                "voice": voice["model"],
            }
        )

    manifest = {
        "version": 6,
        "language": lang,
        "locale": voice["locale"],
        "label": voice.get("label", lang),
        "storage": "github-pages-local",
        "voice": voice["model"],
        "chapters": entries,
    }
    (out_dir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def checkpoint_commit(
    sid: str,
    lang: str,
    story_list: list[dict],
    voice_map: dict,
):
    """Persist each finished narration so a later run can resume after timeout."""
    write_manifest(lang, story_list, voice_map[lang])

    mp3 = audio_path(sid, lang)
    manifest = OUTPUT_ROOT / lang / "manifest.json"

    sh(
        [
            "git",
            "add",
            str(mp3.relative_to(ROOT)),
            str(manifest.relative_to(ROOT)),
        ]
    )

    diff = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        cwd=ROOT,
    )
    if diff.returncode == 0:
        print(f"Checkpoint already committed: {lang}/{sid}")
        return

    sh(["git", "commit", "-m", f"Checkpoint narration {lang}/{sid}"])

    for attempt in range(1, 4):
        try:
            sh(["git", "push", "origin", "HEAD:main"])
            print(f"Checkpoint saved: {lang}/{sid}")
            trigger_pages_deploy()
            return
        except subprocess.CalledProcessError:
            if attempt == 3:
                raise
            print(f"Push conflict; rebasing checkpoint (attempt {attempt}/3)...")
            sh(["git", "pull", "--rebase", "origin", "main"])



def trigger_pages_deploy():
    """Ask GitHub to publish the latest main branch after each checkpoint.

    workflow_dispatch is intentionally used because GitHub permits a
    GITHUB_TOKEN-triggered workflow_dispatch to start another workflow.
    A deployment failure must not destroy the successfully checkpointed MP3.
    """
    if not os.environ.get("GH_TOKEN"):
        print("Pages deploy trigger skipped: GH_TOKEN is not available.")
        return

    cp = subprocess.run(
        [
            "gh",
            "workflow",
            "run",
            "deploy-pages.yml",
            "--repo",
            "human-centered-computing/human-centered-universe",
            "--ref",
            "main",
        ],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )

    if cp.returncode == 0:
        print("Pages deploy requested for latest main.")
        return

    print("WARNING: checkpoint was saved, but Pages deploy could not be requested.")
    if cp.stdout.strip():
        print(cp.stdout.strip())
    if cp.stderr.strip():
        print(cp.stderr.strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--language", default="all")
    ap.add_argument("--story", default="all")
    ap.add_argument("--changed-from", default=None)
    ap.add_argument(
        "--resume",
        action="store_true",
        help="Skip narration MP3 files that already exist in the repository.",
    )
    ap.add_argument(
        "--checkpoint",
        action="store_true",
        help="Commit and push each completed MP3 immediately.",
    )
    args = ap.parse_args()

    story_list = canon()
    story_by_id = {s["id"]: s for s in story_list}
    voice_map = {k: v for k, v in voices().items() if v.get("enabled")}
    content = story_content_map()

    available = {
        (sid, lang)
        for (sid, lang), path in content.items()
        if sid in story_by_id and lang in voice_map
    }

    if args.changed_from:
        selected = changed_pairs(args.changed_from, available)
    else:
        selected = sorted(available)
        if args.language != "all":
            selected = [x for x in selected if x[1] == args.language]
        if args.story != "all":
            selected = [x for x in selected if x[0] == args.story]

    if not selected:
        print("No matching story/language narration targets.")
        return

    generated = []
    skipped = []
    touched_langs = set()

    for sid, lang in selected:
        if args.resume and resumable_audio_exists(sid, lang):
            print(f"\n=== {sid}/{lang} ===")
            print(f"RESUME: existing MP3 found; skipping {lang}/{sid}.mp3")
            skipped.append((sid, lang))
            continue

        print(f"\n=== {sid}/{lang} ===")
        generate(
            sid,
            lang,
            content[(sid, lang)],
            story_by_id[sid],
            voice_map[lang],
        )
        generated.append((sid, lang))
        touched_langs.add(lang)

        if args.checkpoint:
            checkpoint_commit(sid, lang, story_list, voice_map)

    if not args.checkpoint:
        for lang in sorted(touched_langs):
            write_manifest(lang, story_list, voice_map[lang])

    print("\nGenerated:")
    for sid, lang in generated:
        print(f"- {lang}/{sid}.mp3")

    if skipped:
        print("\nResumed / already present:")
        for sid, lang in skipped:
            print(f"- {lang}/{sid}.mp3")


if __name__ == "__main__":
    main()
