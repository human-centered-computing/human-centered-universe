# Interactive Reader

The Human-Centered Universe is read through **GitHub Pages**.

The GitHub repository is the source of truth. The public reader is generated automatically from live canon story folders.

## Reader modes

### READ

- English canonical source or selected translation
- Previous / next canon story
- Reading progress stored locally in the browser
- Resume from the last opened story
- Clickable story connections and Quantum Echoes

### EXPLORE

- Light, Dark and Common core overview
- Bridge story layer
- Searchable live story nodes
- Clicking a node opens it in Reader mode

### CREATE

- Open the GitHub repository
- Fork the universe
- Read the contribution guide
- Move from reader to contributor

## Language behavior

English is canonical.

If a selected translation does not exist, the reader displays the English canonical content and clearly shows a fallback notice.

Language preference is stored in the browser.

## Publishing

The workflow `.github/workflows/deploy-pages.yml`:

1. validates the universe,
2. builds `site/data/universe.json` from the live story files,
3. packages the `web/` application,
4. deploys the generated static site to GitHub Pages.

Every push to `main` automatically rebuilds the reader.

## One-time GitHub setting

After pushing these files:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Open **Actions** and confirm that **Deploy Interactive Reader** succeeds.

The expected project-site address is:

`https://human-centered-computing.github.io/human-centered-universe/`

GitHub shows the exact deployed URL in the workflow and Pages settings.
