# Translation System

## Controlled source and canonical layer

Translation production follows two controlled stages:

```text
Turkish editorial source → AI translation to English → human control → canonical English
canonical English → AI translation to de, es, fr, it, ru, zh-CN, ja, ar, ku, pt
```

Turkish and English are human-controlled. The other ten languages are AI-produced and not human-reviewed.

## Metadata rule

- `en`: `{"status":"canonical","human_reviewed":true}`
- `tr`: `{"status":"reviewed","human_reviewed":true}`
- every other available language: `{"status":"machine_draft","human_reviewed":false}`

Do not promote an AI translation to `reviewed` until a human language review has actually been completed.

## Multilingual layers and fallback

Every translation remains under the same story ID as `content/<language-code>.md`. If a selected story language is unavailable, the reader displays canonical English.

## Cultural adaptation

A cultural adaptation is not a translation. It becomes a new story node with its own ID and explicit relationships.
