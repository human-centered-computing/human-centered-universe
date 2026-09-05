#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "universe" / "canon-map.v0.2.json"
STORIES = ROOT / "stories"
OUTPUT = ROOT / "web" / "assets" / "audio" / "tr"
MODEL = Path(os.environ.get("HCU_TTS_MODEL", ".cache/piper/tr_TR-dfki-medium.onnx"))
LENGTH_SCALE = os.environ.get("HCU_TTS_LENGTH_SCALE", "1.08")
MAX_CHARS = 560


def run(cmd: list[str], **kwargs) -> subprocess.CompletedProcess:
    print("+", " ".join(map(str, cmd)))
    return subprocess.run(cmd, check=True, text=True, **kwargs)


def load_canon() -> list[dict]:
    return json.loads(CANON.read_text(encoding="utf-8"))["chapters"]


def story_paths() -> dict[str, Path]:
    found: dict[str, Path] = {}
    for p in STORIES.rglob("content/tr.md"):
        parts = p.parts
        try:
            sid = parts[-3]
        except IndexError:
            continue
        found[sid] = p
    return found


def clean_markdown(md: str) -> str:
    # Remove fenced code blocks entirely.
    md = re.sub(r"```.*?```", "", md, flags=re.S)
    # Remove images but keep normal link text.
    md = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", md)
    md = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", md)
    # Remove heading / quote / list syntax while preserving content.
    md = re.sub(r"^\s{0,3}#{1,6}\s+", "", md, flags=re.M)
    md = re.sub(r"^\s*>\s?", "", md, flags=re.M)
    md = re.sub(r"^\s*[-*+]\s+", "", md, flags=re.M)
    md = re.sub(r"^\s*\d+\.\s+", "", md, flags=re.M)
    # Inline Markdown.
    md = md.replace("**", "").replace("__", "").replace("`", "")
    md = re.sub(r"(?<!\*)\*(?!\*)", "", md)
    # Normalize whitespace.
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
    chunks: list[str] = []
    current = ""

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        if len(sentence) > max_chars:
            # Last-resort split on commas/semicolons, then words.
            pieces = re.split(r"(?<=[,;:])\s+", sentence)
        else:
            pieces = [sentence]

        for piece in pieces:
            if len(piece) > max_chars:
                words = piece.split()
                buf = ""
                for word in words:
                    candidate = f"{buf} {word}".strip()
                    if len(candidate) > max_chars and buf:
                        chunks.append(buf)
                        buf = word
                    else:
                        buf = candidate
                if buf:
                    if current:
                        chunks.append(current)
                        current = ""
                    chunks.append(buf)
                continue

            candidate = f"{current} {piece}".strip()
            if len(candidate) > max_chars and current:
                chunks.append(current)
                current = piece
            else:
                current = candidate

    if current:
        chunks.append(current)
    return chunks


def narration_chunks(md: str) -> list[str]:
    cleaned = clean_markdown(md)
    blocks = [x.strip() for x in re.split(r"\n\s*\n", cleaned) if x.strip()]
    chunks: list[str] = []
    for block in blocks:
        chunks.extend(split_long(block))
    return chunks


def make_silence(path: Path, seconds: float = 0.34) -> None:
    run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-f", "lavfi",
        "-i", "anullsrc=r=22050:cl=mono",
        "-t", str(seconds),
        "-c:a", "pcm_s16le",
        str(path),
    ])


def synthesize(text: str, wav_path: Path) -> None:
    cmd = [
        sys.executable, "-m", "piper",
        "-m", str(MODEL),
        "-f", str(wav_path),
        "--length-scale", LENGTH_SCALE,
        "--sentence-silence", "0.16",
        "--",
        text,
    ]
    run(cmd)


def ffprobe_duration(path: Path) -> float:
    cp = subprocess.run(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return round(float(cp.stdout.strip()), 3)


def generate_story(story: dict, md_path: Path) -> dict:
    sid = story["id"]
    title = story.get("original_title") or story.get("title") or sid
    print(f"\n=== {sid}: {title} ===")

    chunks = narration_chunks(md_path.read_text(encoding="utf-8"))
    if not chunks:
        raise RuntimeError(f"No narratable text found for {sid}")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    out_mp3 = OUTPUT / f"{sid}.mp3"

    with tempfile.TemporaryDirectory(prefix=f"hcu-{sid}-") as td:
        tmp = Path(td)
        silence = tmp / "silence.wav"
        make_silence(silence)

        concat_lines: list[str] = []

        for i, chunk in enumerate(chunks, start=1):
            wav = tmp / f"{i:04d}.wav"
            synthesize(chunk, wav)
            concat_lines.append(f"file '{wav.as_posix()}'")
            if i != len(chunks):
                concat_lines.append(f"file '{silence.as_posix()}'")

        concat_file = tmp / "concat.txt"
        concat_file.write_text("\n".join(concat_lines) + "\n", encoding="utf-8")

        run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-f", "concat", "-safe", "0",
            "-i", str(concat_file),
            "-ac", "1", "-ar", "22050",
            "-codec:a", "libmp3lame",
            "-b:a", "96k",
            str(out_mp3),
        ])

    return {
        "id": sid,
        "title": title,
        "file": f"./{sid}.mp3",
        "duration_seconds": ffprobe_duration(out_mp3),
        "bytes": out_mp3.stat().st_size,
        "voice": "tr_TR-dfki-medium",
        "engine": "Piper",
    }


def changed_story_ids(base_sha: str, valid: set[str]) -> list[str]:
    if not base_sha or set(base_sha) == {"0"}:
        return sorted(valid)

    cp = subprocess.run(
        ["git", "diff", "--name-only", base_sha, "HEAD", "--", "stories"],
        check=True,
        capture_output=True,
        text=True,
    )

    ids: list[str] = []
    for line in cp.stdout.splitlines():
        m = re.search(r"/([A-Z]{3}-\d{4})/content/tr\.md$", line)
        if m and m.group(1) in valid:
            ids.append(m.group(1))
    return sorted(set(ids))


def write_manifest(canon: list[dict]) -> None:
    entries = []
    for story in canon:
        sid = story["id"]
        mp3 = OUTPUT / f"{sid}.mp3"
        if not mp3.exists():
            continue
        entries.append({
            "id": sid,
            "title": story.get("original_title") or story.get("title") or sid,
            "file": f"./{sid}.mp3",
            "duration_seconds": ffprobe_duration(mp3),
            "bytes": mp3.stat().st_size,
            "voice": "tr_TR-dfki-medium",
            "engine": "Piper",
        })

    manifest = {
        "version": 4,
        "language": "tr",
        "storage": "github-pages-local",
        "voice": "tr_TR-dfki-medium",
        "chapters": entries,
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--story", default=None, help="Story ID or all")
    parser.add_argument("--changed-from", default=None, help="Base git SHA")
    args = parser.parse_args()

    if not MODEL.exists():
        raise SystemExit(f"Piper model not found: {MODEL}")

    canon = load_canon()
    paths = story_paths()
    valid = {s["id"] for s in canon if s["id"] in paths}

    if args.story:
        if args.story == "all":
            selected = [s["id"] for s in canon if s["id"] in valid]
        else:
            if args.story not in valid:
                raise SystemExit(f"Unknown or missing Turkish story: {args.story}")
            selected = [args.story]
    elif args.changed_from:
        selected = changed_story_ids(args.changed_from, valid)
    else:
        selected = [s["id"] for s in canon if s["id"] in valid]

    if not selected:
        print("No Turkish story changes detected.")
        write_manifest(canon)
        return

    by_id = {s["id"]: s for s in canon}
    for sid in selected:
        generate_story(by_id[sid], paths[sid])

    write_manifest(canon)
    print("\nGenerated:", ", ".join(selected))


if __name__ == "__main__":
    main()
