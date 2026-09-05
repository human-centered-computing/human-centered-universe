# GitHub-native Turkish TTS

This package adds a fully automated Turkish narration pipeline.

## Flow

1. Turkish story Markdown changes under `stories/**/content/tr.md`.
2. `Generate Turkish Narration` GitHub Action runs.
3. The runner installs Piper and downloads `tr_TR-dfki-medium`.
4. The changed story is converted to local MP3.
5. MP3 is committed to `web/assets/audio/tr/<STORY-ID>.mp3`.
6. `manifest.json` is updated.
7. Existing GitHub Pages deployment publishes the audio.
8. The reader loads only local GitHub Pages MP3 files.

## First run

After uploading the package, go to:

Actions → Generate Turkish Narration → Run workflow

Set:
`story_id = all`

This generates all current Turkish canon chapters.

## Later runs

After the first run, narration regeneration is automatic when a Turkish story
file changes. You can also manually regenerate one chapter with, for example:

`BRG-0002`

## Important license note

The current Turkish Piper voice (`tr_TR-dfki-medium`) cites a CC BY-NC-SA 4.0
dataset. That is suitable for non-commercial use, but not a safe final choice
for a future commercial audiobook. The automation architecture can later swap
to another model without changing the reader.
