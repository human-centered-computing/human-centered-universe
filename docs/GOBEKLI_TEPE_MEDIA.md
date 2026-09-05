# Göbekli Tepe Field Photography Layer

## Purpose

The field photographs connect the real archaeological landscape to the fictional Human-Centered Universe without turning narrative claims into archaeological claims.

The implementation deliberately keeps photography in the **presentation layer** rather than editing canonical story Markdown. This preserves the existing story IDs, translations, content files, validation rules, reader data format, and deployment workflow.

## Stories currently using the collection

### BRG-0003 — Riha: A Name Is a Door

Three photographs are inserted after passages that establish:

1. arrival at Göbekli Tepe,
2. the T-shaped pillars,
3. the 17:25 scene.

The third caption explicitly states that the photograph itself contains no supernatural claim.

### BRG-0001 — The Stone Network: Where the Stones Answer

Five photographs are inserted as **real field references** near passages concerning:

1. reading the surface,
2. excavation geometry,
3. layered three-dimensional scanning,
4. the network/topology metaphor,
5. the moving-center model.

Captions explicitly separate the real photographs from the fictional seven-region network and missing-node findings.

## Technical design

`web/assets/media.v1.js` loads:

`./assets/photos/gobekli-tepe/manifest.json`

It watches the reader DOM and inserts figures only in Read mode. Placement is anchored to the beginning of specific rendered paragraphs in English and Turkish. If an anchor is not found, no image is inserted; the reader continues normally.

This means a future text edit cannot cause a photo to appear in an arbitrary location. At worst, that placement quietly disappears until the anchor text in `manifest.json` is updated.

## Image processing

- Source: creator-supplied HEIC photographs.
- Selected: 10 of 48 real photographs.
- Web format: WebP.
- Maximum dimension: 1600 px.
- Metadata: stripped from published WebP files.
- Loading: browser `loading="lazy"` and `decoding="async"`.

The HEIC originals are intentionally not included in the public web package.

## Future extension

Two selected assets are currently kept in the collection without automatic placement:

- `GT-03` — central pillars,
- `GT-10` — protective canopy.

They can be used later for a place page, visual index, chapter opener, or interactive map without renaming the collection.
