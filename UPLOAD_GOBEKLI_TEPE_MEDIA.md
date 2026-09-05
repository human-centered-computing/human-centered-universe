# Göbekli Tepe media package — upload instructions

This package is an overlay for:

`human-centered-computing/human-centered-universe`

## What changes

- `web/index.html` — adds two versioned media-layer assets after the existing HCU assets.
- `web/assets/media.v1.js` — injects field photographs into the published reader without altering canon Markdown.
- `web/assets/media.v1.css` — responsive figure styling.
- `web/assets/photos/gobekli-tepe/` — 10 selected, web-optimized photographs plus `manifest.json`.
- `docs/GOBEKLI_TEPE_MEDIA.md` — design and provenance notes.
- `docs/gobekli-tepe-photo-selection.csv` — selection map from the 48 supplied photographs.

## What does NOT change

- `stories/**/content/*.md`
- `stories/**/meta.json`
- `scripts/build_reader.py`
- `scripts/validate_universe.py`
- `.github/workflows/deploy-pages.yml`
- canon ordering or story IDs

The current deployment flow remains:

`validate_universe.py -> build_reader.py -> site/ -> GitHub Pages`

Because `build_reader.py` already copies the complete `web/` directory into `site/`, the new media files are deployed automatically.

## Upload

1. Extract this ZIP.
2. Copy its contents into the repository root, preserving folders.
3. Allow `web/index.html` to replace the existing file.
4. Commit to `main` (or review in a branch first).
5. GitHub Actions will rebuild the existing Pages site normally.

Recommended commit message:

`Add Göbekli Tepe field photography layer`

## Important boundary

The photographs are real field photographs. The fictional events, underground network, seven-region analysis, missing node, quantum analogy, and Tapetum Sentinel discoveries remain narrative elements. Captions make this distinction explicit.

No image license has been granted by this package. If the repository later adopts a media license, define it separately from source-code licensing.
