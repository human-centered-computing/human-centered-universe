# Translation System

## Source of truth

Turkish (`content/tr.md`) is the canonical story source for every live story.

## Multilingual layers

Translations are stored as `content/<language-code>.md` under the same story ID. English is a translation layer just like German, Spanish, Japanese, Kurdish, or any other non-Turkish language.

## Translation direction

```text
content/tr.md → en, de, es, fr, it, ru, zh-CN, ja, ar, ku, pt
```

Do not translate from an older English file when a newer Turkish story exists.

## Fallback

If the selected story language is unavailable, the reader displays Turkish. Story fallback and interface fallback are independent.

## Cultural adaptation

A cultural adaptation is not a translation. It becomes a new story node with its own ID and explicit relationships.

## Review states

`canonical` → current Turkish source

`reviewed` → human-reviewed translation

`community` → contributed translation awaiting final review

`machine_draft` → AI-produced translation from the current Turkish source, not yet human-reviewed
