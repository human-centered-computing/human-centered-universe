# HCU Idea → Story Node Builder

The **HCU Idea → Story Node Builder** turns an idea into a complete Human-Centered Universe story node.

## Core model

An idea is not classified as right or wrong before the story begins.

It enters one connected narrative through:

```text
INITIAL VIBRATION
→ LIGHT CENTER
→ DARK CENTER
→ HUMAN CENTER
→ INTERACTION AND CONSEQUENCES
→ IDEA MATURATION
→ NEW HUMAN QUESTION
```

The centers are not moral labels:

- **LIGHT**: order, clarity, evidence, knowledge, continuity, verification, structure and protection.
- **DARK**: uncertainty, possibility, freedom, variation, disruption, plurality, emergence and transformation.
- **HUMAN**: lived human meaning, dignity, agency, consent, relationship, responsibility, identity, vulnerability and future consequences.

HUMAN is not a neutral midpoint. LIGHT is not automatically good. DARK is not automatically evil.

## Language policy

The **idea language** and **story language** are independent.

- A user may write an idea in any supported language.
- The literary story is generated in the selected story language.
- English (`en`) remains the canonical repository language.
- If the selected story language is not English, the AI also produces a faithful English canonical version of the same story.
- AI-generated non-English content is exported with translation status `machine_draft`.
- A reviewed human translation may later be changed to `reviewed`.
- Every language version keeps the same story ID.

## How to use

1. Select **Idea language**.
2. Select **Story language**.
3. Write the idea to mature.
4. Optionally choose a related existing node and relationship type.
5. Click **Create Three-Center Story Prompt**.
6. Send the prompt to an AI system capable of returning JSON.
7. Paste the returned JSON into **AI JSON Result**.
8. Click **Process and Validate**.
9. Review the generated story, final human question, 30 criteria, HUMAN/LIGHT/DARK position and observer choices.
10. Click **Create GitHub ZIP**.
11. Upload the generated story folder to the repository.

## Story ID safety

The deployed builder reads:

```text
./data/story-registry.json
```

This registry is generated from **all committed story folders**, including experimental and fork nodes. It prevents the builder from proposing an ID that already exists but is not part of the live reader.

## Repository package

A generated node uses:

```text
stories/<center>/<STORY-ID>/
├── meta.json
├── analysis.json
└── content/
    ├── en.md
    └── <selected-language>.md
```

For new nodes the center folders are:

```text
stories/human/
stories/light/
stories/dark/
```

Historical `BRG-*` and `COM-*` IDs remain unchanged.

## Three-center classification

After the story is generated, AI scores exactly 30 narrative criteria:

- 10 HUMAN criteria
- 10 LIGHT criteria
- 10 DARK criteria

Each criterion is scored from 0 to 10. Raw totals are normalized so:

```text
HUMAN + LIGHT + DARK = 100
```

This is a narrative-position model, not a proof that the underlying real-world idea is scientifically true or morally correct.

## Observer choices

Each story can export 3–5 observer choices. Every choice has HUMAN / LIGHT / DARK effects. The live reader accumulates these effects into the observer state and uses that evolving profile to recommend unread stories.

Choice labels are exported using the reader-compatible multilingual `labels` object.

## Source of truth

Committed story folders are the source of narrative reality.

`universe-map.json` remains useful for origin information and curated observation order, but a live story does not have to be manually duplicated into that file in order to be discovered by the reader, graph builder or narration generator.

> **Commit creates reality. Connection transforms meaning.**
