# Language Policy

English (`en`) is the canonical and default language of Human-Centered Universe.

A story may be submitted in any source language. If the source is not English, a faithful canonical English version is created while the source-language text may be preserved as a translation layer.

Translations keep the same story ID.

```text
STORY-ID/
├── meta.json
├── analysis.json
└── content/
    ├── en.md
    ├── de.md
    ├── ar.md
    └── ...
```

The authoring interface is English. Content languages may be broader than interface localization. English is the fallback when either UI strings or story content are unavailable in the selected language.

A cultural adaptation is not a translation. It becomes a new story node.
