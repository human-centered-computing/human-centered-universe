# HCU Reader Cache-Busting Patch v0.2.1

The latest GitHub Pages deployment contains 21 canon nodes, but browsers/CDNs
can continue showing an older JavaScript/CSS asset because the asset URLs did
not change between deployments.

Copy the contents of this package into the existing repository root and replace:

`scripts/build_reader.py`

Commit:

`Fix stale GitHub Pages reader cache`

Push to `main`.

After deployment, the generated `index.html` will reference fingerprinted assets such as:

`app.js?v=<hash>`
`styles.css?v=<hash>`

so new reader features are not hidden by stale cached assets.
