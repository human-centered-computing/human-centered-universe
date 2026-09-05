# HCU Multilingual GitHub TTS v5

## Current repository languages
The repository currently contains complete story content in:
- Turkish (`tr`)
- English (`en`)

These two languages begin working immediately after the first workflow run.

## Future-ready languages
The TTS configuration also includes:
- German (`de`) — `de_DE-thorsten-medium`
- French (`fr`) — `fr_FR-siwis-medium`
- Spanish (`es`) — `es_ES-sharvard-medium`
- Italian (`it`) — `it_IT-paola-medium`

Narration for these languages is generated automatically only after a matching
story file exists, such as:

`stories/bridges/BRG-0002/content/de.md`

No empty or machine-translated story file is created by this workflow.

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

## Manual generation
Actions → Generate Multilingual Narration → Run workflow

Examples:
- language=`all`, story_id=`all`
- language=`en`, story_id=`all`
- language=`tr`, story_id=`BRG-0002`
- language=`de`, story_id=`BRG-0002`

## Licensing
Piper supports many languages, but each voice has its own MODEL_CARD and
possibly its own dataset license. Do not assume one voice's license applies to
another. Review each chosen model before commercial publication.

The Turkish `tr_TR-dfki-medium` model currently requires special attention
because its model card cites a CC BY-NC-SA 4.0 dataset.
