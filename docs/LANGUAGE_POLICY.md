# Language Policy

Turkish (`tr`) is the canonical story language and source of truth of Human-Centered Universe.

## Canonical story source

Every live story node must contain:

```text
content/tr.md
```

The Turkish story is the authoritative literary version. English and every other supported language are translation layers derived from the current Turkish story.

A translation must preserve the same story ID and narrative meaning. It must not silently introduce an older English version, a summary, or a cultural rewrite.

## Supported reader languages

The initial multilingual reader target is:

```text
tr, en, de, es, fr, it, ru, zh-CN, ja, ar, ku, pt
```

`ku` means Kurmancî written in the Latin alphabet. `zh-CN` means Simplified Chinese.

## Translation status

Repository translation states are:

```text
canonical
reviewed
community
machine_draft
```

The Turkish source uses:

```json
{"status":"canonical"}
```

A translation produced from the current Turkish source starts as:

```json
{"status":"machine_draft"}
```

After human review it may be promoted to:

```json
{"status":"reviewed"}
```

## Reader fallback

If a selected story language is unavailable, the reader displays the current Turkish canonical story. It must not fall back to an older English story.

Interface localization is separate from story localization. If an interface locale is unavailable, the interface may use its configured UI fallback language while the story itself still falls back to Turkish.

## Migration from the former English-canonical model

Older nodes may temporarily retain legacy metadata declaring English as the source language. During migration, the build normalizes Turkish as the runtime canonical source whenever `content/tr.md` exists. Each story's repository metadata should be updated to `source_language: "tr"` when that story is retranslated from Turkish.

## Cultural adaptation

A cultural adaptation that materially changes the story is not a translation. It becomes a new story node with its own ID and explicit relationship to the original node.
