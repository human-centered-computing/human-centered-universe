# Language Policy

English (`en`) is the canonical and universal repository language of Human-Centered Universe.

## Canonical and default language

Every live story node must contain:

```text
content/en.md
```

The English version is the canonical published layer, the default reader language, and the fallback when a selected story translation is unavailable.

## Editorial working source

For the current authoring workflow, Turkish (`tr`) is the editorial working source used with the project author.

When the Turkish story is newer or more complete than an older English version, translations are regenerated from the current Turkish text:

```text
content/tr.md → en, de, es, fr, it, ru, zh-CN, ja, ar, ku, pt
```

After the English version is regenerated from the Turkish working source, the new English file becomes the canonical published version again.

This distinction is intentional:

- **English** = canonical, universal, default and fallback language.
- **Turkish** = editorial working/reference language for the current authoring and translation workflow.

## Supported reader languages

```text
en, tr, de, es, fr, it, ru, zh-CN, ja, ar, ku, pt
```

`ku` means Kurmancî written in the Latin alphabet. `zh-CN` means Simplified Chinese.

## Translation status

Supported repository states are:

```text
canonical
reviewed
community
machine_draft
```

The English published layer uses:

```json
{"status":"canonical"}
```

A newly generated translation starts as:

```json
{"status":"machine_draft"}
```

A human-reviewed translation may be promoted to:

```json
{"status":"reviewed"}
```

The Turkish working text may be marked `reviewed` when it is the current human-authored reference used to regenerate the multilingual set.

## Reader fallback

If the selected story language is unavailable, the reader displays the canonical English story.

Interface localization and story localization are separate. If an interface locale is unavailable, interface labels also fall back to English.

## Cultural adaptation

A cultural adaptation that materially changes the story is not treated as a translation. It becomes a new story node with its own ID and explicit relationship to the original node.
