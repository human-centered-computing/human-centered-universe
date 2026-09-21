# Language Policy

English (`en`) is the canonical, default and fallback publication language of Human-Centered Universe. Turkish (`tr`) is the human-controlled editorial working source.

## Translation pipeline

The project uses this explicit sequence:

```text
human-controlled Turkish → AI-translated English → human control of English
human-controlled English → AI translation into de, es, fr, it, ru, zh-CN, ja, ar, ku, pt
```

The English publication layer becomes canonical only after human control. Other language versions are AI translations from that controlled English layer and have not received human language review.

## Required metadata

Every declared translation contains both `status` and `human_reviewed`:

```json
{
  "en": {"status": "canonical", "human_reviewed": true},
  "tr": {"status": "reviewed", "human_reviewed": true},
  "de": {"status": "machine_draft", "human_reviewed": false}
}
```

The same rule applies to every available non-English/non-Turkish language.

Supported status values remain:

```text
canonical
reviewed
community
machine_draft
```

`canonical` describes the controlled English publication layer. `reviewed` describes the controlled Turkish editorial source. `machine_draft` means AI-produced and not human-reviewed. No other language may be presented as human-reviewed until an actual language review is completed and recorded.

## Supported reader languages

```text
en, tr, de, es, fr, it, ru, zh-CN, ja, ar, ku, pt
```

`ku` means Kurmancî in the Latin alphabet. `zh-CN` means Simplified Chinese.

## Reader fallback

If a selected story language is unavailable, the reader displays canonical English. Interface localization and story localization are separate; unavailable interface labels also fall back to English.

## Cultural adaptation

A cultural adaptation that materially changes a story is not a translation. It becomes a new story node with its own ID and an explicit relationship to the original node.
