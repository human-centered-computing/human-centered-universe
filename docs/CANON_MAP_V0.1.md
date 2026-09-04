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
| 1 | `BRG-0002` | First Vibration | BRIDGE |
| 2 | `BRG-0003` | Riha | BRIDGE |
| 3 | `BRG-0004` | The Seven Witnesses of the Dream | BRIDGE |
| 4 | `BRG-0005` | Shahmaran's Silence | BRIDGE |
| 5 | `BRG-0001` | The Stone Network | BRIDGE |
| 6 | `COM-0002` | Maran | COMMON |
| 7 | `COM-0003` | Alpha One | COMMON |
| 8 | `BRG-0006` | Four Names | BRIDGE |
| 9 | `BRG-0007` | 17:25 | BRIDGE |
| 10 | `BRG-0008` | Before Measurement | BRIDGE |
| 11 | `BRG-0009` | The Mathematics of Infinity | BRIDGE |
| 12 | `BRG-0010` | Where the Golden Ratio Broke | BRIDGE |
| 13 | `LGT-0001` | The Promise of Light | LIGHT |
| 14 | `DRK-0001` | The Gift of Darkness | DARK |
| 15 | `COM-0001` | Turning the Battlefield into a Home | COMMON |
| 16 | `COM-0004` | The Open Architects Network | COMMON |
| 17 | `COM-0005` | Golden and Variable Rules | COMMON |
| 18 | `BRG-0011` | The Rih Bridge | BRIDGE |
| 19 | `BRG-0012` | Record X: Pure Field | BRIDGE |
| 20 | `BRG-0013` | The Second Creation | BRIDGE |
| 21 | `COM-0006` | Creation Is Unfinished | COMMON |

## ID policy

- `LGT-xxxx` — Light Center
- `DRK-xxxx` — Dark Center
- `COM-xxxx` — Common Center
- `BRG-xxxx` — Bridge stories

Existing live IDs are preserved:
- `LGT-0001` — The Promise of Light
- `DRK-0001` — The Gift of Darkness
- `COM-0001` — Turning the Battlefield into a Home
- `BRG-0001` — The Stone Network

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
