# Upload Interactive Reader v0.1

Copy the following folders/files into the root of the existing `human-centered-universe` repository:

```text
.github/workflows/deploy-pages.yml
scripts/build_reader.py
web/
docs/INTERACTIVE_READER.md
locales/en.json
locales/tr.json
```

Do not delete the existing story, universe, graph, validation, or canon files.

Commit message:

`Add GitHub Pages interactive reader`

Then push to `main`.

After pushing, on GitHub:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

Then open the **Actions** tab and check **Deploy Interactive Reader**.
