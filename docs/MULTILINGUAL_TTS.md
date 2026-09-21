# HCU Multilingual GitHub TTS v6

## Enabled narration languages
The TTS configuration currently includes:
- Turkish (`tr`) — `tr_TR-dfki-medium`
- English (`en`) — `en_US-lessac-medium`
- German (`de`) — `de_DE-thorsten-medium`
- French (`fr`) — `fr_FR-siwis-medium`
- Spanish (`es`) — `es_ES-sharvard-medium`
- Italian (`it`) — `it_IT-paola-medium`

Narration for these languages is generated automatically only after a matching
story file exists, such as:

`stories/bridges/BRG-0002/content/de.md`

No empty or translated story file is created by this workflow. Narration is
generated only from an existing story-language Markdown file.

Portuguese, Russian, Simplified Chinese, Japanese, Arabic and Kurdish story
layers remain readable but do not yet have enabled Piper voices.

## Output
Audio is stored by language:

web/assets/audio/
├── tr/BRG-0002.mp3
├── en/BRG-0002.mp3
├── de/BRG-0002.mp3
└── ...

Each language receives its own `manifest.json`.

## Automatic regeneration
Any change to:

`stories/**/content/*.md`

triggers narration regeneration for the changed story/language pair when that
language has an enabled voice in `config/tts-voices.json`.

The workflow first plans the affected languages, then runs one language shard
at a time. Each shard has its own 360-minute budget, so a complete multilingual
backfill cannot be cancelled merely because the combined run exceeds the old
three-hour limit. Finished MP3 files are checkpointed to `main`; GitHub Pages is
requested once after all selected shards finish.

## Manual generation
Actions → Generate Multilingual Narration → Run workflow

Examples:
- language=`all`, story_id=`all`
- language=`en`, story_id=`all`
- language=`tr`, story_id=`BRG-0002`
- language=`de`, story_id=`BRG-0002`

## Resumable backfill
Increment `.github/narration-backfill-trigger` when all enabled languages must
resume from the audio already committed to the repository. This selects every
enabled language shard, skips valid existing MP3 files and generates only the
missing narration. Ordinary story edits do not use resume mode, so a changed
story still regenerates its corresponding audio.

## Licensing
Piper supports many languages, but each voice has its own MODEL_CARD and
possibly its own dataset license. Do not assume one voice's license applies to
another. Review each chosen model before commercial publication.

The Turkish `tr_TR-dfki-medium` model currently requires special attention
because its model card cites a CC BY-NC-SA 4.0 dataset.
