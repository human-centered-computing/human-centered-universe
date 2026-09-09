# Multilingual Stories v1

## Goal

Human-Centered Universe exposes a stable multilingual reader while preserving one canonical English source per story ID.

## Supported reader languages

`en`, `tr`, `de`, `es`, `fr`, `it`, `ru`, `zh-CN`, `ja`, `ar`, `ku`, `pt`

Kurdish is represented as Kurmanji (`ku`). Chinese uses Simplified Chinese (`zh-CN`). Arabic is RTL.

## Story layout

Every story retains one ID and one directory:

```text
stories/<center>/<STORY-ID>/
  meta.json
  content/
    en.md
    tr.md
    de.md
    es.md
    fr.md
    it.md
    ru.md
    zh-CN.md
    ja.md
    ar.md
    ku.md
    pt.md
```

English remains canonical. Missing languages fall back to English in the current reader.

## Translation lifecycle

- `canonical`: English source of truth.
- `machine_draft`: generated translation awaiting review.
- `community`: contributed translation awaiting final review.
- `reviewed`: human-reviewed translation.

The generator never promotes a translation to `reviewed` automatically.

## UI localization

Locale JSON files live under `locales/<code>.json`. The current reader already discovers locale filenames during `scripts/build_reader.py`; therefore adding locale files automatically adds those language codes to `data/universe.json` and to the reader language selector.

## RTL

`web/assets/language-direction.v1.js` observes the document language and applies `dir=rtl` for Arabic-class RTL languages. This avoids changing the existing application state model.

## Automated generation

`scripts/generate_story_translations.py` reads canonical `content/en.md`, calls an OpenAI-compatible Chat Completions endpoint, writes the target Markdown, and updates `meta.json` with `machine_draft`.

Recommended process:

1. Generate one or two languages first.
2. Review representative stories for terminology consistency.
3. Lock preferred terminology.
4. Generate remaining stories.
5. Promote reviewed files individually or by review batch.

Do not treat cultural adaptation as translation. If a translation materially changes the narrative, it should become a new story node with its own ID and explicit relationship.
