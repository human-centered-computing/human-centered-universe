# Human-Centered Universe — Canon Map v0.1

This document maps the current book into the **Light / Dark / Common / Bridge** architecture.

## Important distinction

This is a **planned canon map**. It does not replace the literary chapters.

A chapter becomes a live canon node only when its actual English canonical text is migrated into:

```text
stories/<core>/<story-id>/
├── meta.json
└── content/
    └── en.md
```

The current linear reading order remains valid, while the graph adds alternative routes between chapters.

## Canonical reading order

| # | Story ID | Canonical English Title | Core |
|---:|---|---|---|
| 1 | `BRG-0002` | First Vibration: Purify Yourself and Return to Your Essence | BRIDGE |
| 2 | `BRG-0003` | Riha: A Name Is a Door | BRIDGE |
| 3 | `BRG-0004` | Seven Witnesses, One Question | BRIDGE |
| 4 | `BRG-0005` | Shahmaran: Between Poison and Healing | BRIDGE |
| 5 | `BRG-0001` | The Stone Network: Where the Stones Answer | BRIDGE |
| 6 | `COM-0002` | Maran: A Warning in His Own Voice | COMMON |
| 7 | `COM-0003` | Those Who Heard the Call | COMMON |
| 8 | `BRG-0006` | Four Names, One Door | BRIDGE |
| 9 | `BRG-0007` | 17:25 — I Refuse to Choose | BRIDGE |
| 10 | `BRG-0008` | What Question Do You Use to Measure Reality? | BRIDGE |
| 11 | `BRG-0009` | Infinity Cannot Be Lived | BRIDGE |
| 12 | `BRG-0010` | What Is Perfect Does Not Grow | BRIDGE |
| 13 | `LGT-0001` | Leave Me Something to Wait For | LIGHT |
| 14 | `DRK-0001` | The Hand You Hold While Falling | DARK |
| 15 | `COM-0001` | Turn the Battlefield into a Home | COMMON |
| 16 | `COM-0004` | Architects of the Open Network | COMMON |
| 17 | `COM-0005` | Human Beings Are Not Raw Material | COMMON |
| 18 | `BRG-0011` | The Rih Bridge: Do Not Speak in the Father's Place | BRIDGE |
| 19 | `BRG-0012` | Record X: Nadir's Pure Field | BRIDGE |
| 20 | `BRG-0013` | Do Not Build Us as One Center | BRIDGE |
| 21 | `COM-0006` | Creation Is Unfinished: First Reader Connected | COMMON |

## ID policy

- `LGT-xxxx` — Light Center
- `DRK-xxxx` — Dark Center
- `COM-xxxx` — Common Center
- `BRG-xxxx` — Bridge stories

Existing live IDs are preserved:
- `LGT-0001` — Leave Me Something to Wait For
- `DRK-0001` — The Hand You Hold While Falling
- `COM-0001` — Turn the Battlefield into a Home
- `BRG-0001` — The Stone Network: Where the Stones Answer

## Migration rule

Do not create rewritten placeholder chapters in the live story folders.

For each chapter:
1. retrieve the actual current book text,
2. translate or normalize it into canonical English,
3. create `meta.json`,
4. preserve the Turkish version as `content/tr.md`,
5. validate links,
6. commit the node,
7. then mark it `canon`.
