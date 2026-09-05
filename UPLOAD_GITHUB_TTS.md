# Upload instructions

Upload the contents of this folder to the repository root of:

human-centered-computing/human-centered-universe

Overwrite `web/index.html`.

Commit message:

`Add GitHub-native Turkish TTS automation`

Then:

1. Open GitHub → Actions.
2. Choose `Generate Turkish Narration`.
3. Click `Run workflow`.
4. Keep `story_id` as `all`.
5. Run it.
6. The workflow will generate and commit the MP3 files automatically.
7. The existing Pages deploy will publish the generated audio.

Expected generated files:

web/assets/audio/tr/BRG-0002.mp3
web/assets/audio/tr/BRG-0003.mp3
...
web/assets/audio/tr/COM-0006.mp3
web/assets/audio/tr/manifest.json

If the workflow fails at `git push` with a permissions error:
Repository Settings → Actions → General → Workflow permissions
and enable Read and write permissions, then re-run.
