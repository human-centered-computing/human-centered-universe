# Translation System

## Canonical published language

English (`content/en.md`) is the canonical published version of every live story. It is also the default reader language and the story fallback language.

## Editorial working source

For the current Human-Centered Universe authoring workflow, Turkish (`content/tr.md`) is the working reference used when it contains newer or more complete story edits than English.

Translation production follows:

```text
content/tr.md → en, de, es, fr, it, ru, zh-CN, ja, ar, ku, pt
```

The regenerated English version then becomes the current canonical published layer.

Do not use an older English file as the translation source when the Turkish working text contains newer story content.

## Multilingual layers

Every translation remains under the same story ID as `content/<language-code>.md`.

## Fallback

If a selected story language is unavailable, the reader displays English.

## Review states

`canonical` → current English published source

`reviewed` → human-reviewed translation or current human-authored working text

`community` → contributed translation awaiting final review

`machine_draft` → AI-produced translation awaiting human review

## Cultural adaptation

A cultural adaptation is not a translation. It becomes a new story node with its own ID and explicit relationships.
