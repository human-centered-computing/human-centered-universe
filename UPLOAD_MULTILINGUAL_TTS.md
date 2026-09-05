# Upload HCU Multilingual TTS v5

Upload this package's contents to the repository root:

human-centered-computing/human-centered-universe

Overwrite `web/index.html`.

Commit message:

`Add multilingual GitHub narration automation`

Then run:

Actions → Generate Multilingual Narration → Run workflow

Use:
- language: `all`
- story_id: `all`

Because the repo currently contains Turkish and English content, the first run
will generate both:

web/assets/audio/tr/*.mp3
web/assets/audio/en/*.mp3

Later, when `content/de.md`, `content/fr.md`, `content/es.md` or `content/it.md`
files are added, the same Action automatically generates those languages too.

If GitHub cannot push generated MP3 files:
Settings → Actions → General → Workflow permissions → Read and write permissions.
