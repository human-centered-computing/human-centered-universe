# Translation System

## Source of truth

English (`content/en.md`) is the canonical source for every live story.

## Multilingual layers

Any language may be added as `content/<language-code>.md`. A translation preserves the same story ID.

## Fallback

If the selected story language is unavailable, the reader displays English. If the selected language has story content but no interface locale, interface labels remain English.

## Cultural adaptation

A cultural adaptation is not a translation. It becomes a new story node with its own ID and explicit relationships.

## Review states

`canonical` → English source

`reviewed` → human-reviewed translation

`community` → contributed translation awaiting final review

`machine_draft` → machine/AI draft, not authoritative
