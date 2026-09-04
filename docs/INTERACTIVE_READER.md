# Interactive Reader

The Human-Centered Universe is read through **GitHub Pages**:

https://human-centered-computing.github.io/human-centered-universe/

The GitHub repository remains the source of truth. The public reader is generated automatically from live canon story folders.

## READ

- canonical English or selected translation
- previous / next canon navigation
- reading progress stored locally in the browser
- resume from the last opened story
- clickable story connections and Quantum Echoes
- Experience Threshold forms
- World Seed storage in the reader's browser

## EXPLORE

- Light, Dark and Common core overview
- Bridge story layer
- searchable live story nodes
- clicking a node opens it in Reader mode

## CREATE

- open the GitHub repository
- fork the universe
- read the contribution guide
- inspect the reader's current World Seed
- move from reader to contributor

## World Seed

Stories may define optional `interactions` in `meta.json`.

Each interaction contains a stable key and may be a:

- `text`
- `textarea`
- `select`

Answers marked `world_seed: true` are stored in browser `localStorage` under:

`hcu.worldSeed`

The current version **stores and displays** the World Seed. It does not yet claim that every answer changes later scenes.

Future versions may use the stored seed to influence branches, world-state visuals, or story routes.

The seed is local to the browser and is not automatically uploaded to GitHub or a server.

## Language behavior

English is canonical.

If a selected translation does not exist, the reader displays the English canonical content and clearly shows a fallback notice.

Language preference is stored in the browser.

## Publishing

The workflow `.github/workflows/deploy-pages.yml`:

1. validates the universe,
2. builds the reader data from live story files,
3. packages the `web/` application,
4. deploys the generated static site to GitHub Pages.

Every push to `main` rebuilds the reader.

## Canon

The current first-book order is defined in:

`universe/canon-map.v0.2.json`

The reader remains non-linear because every story can also be entered through its graph connections.
