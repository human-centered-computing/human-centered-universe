# Turkish narration attribution

The automated Turkish narration workflow uses:

- Piper TTS runtime: `piper-tts` / OHF-Voice Piper.
- Turkish voice: `tr_TR-dfki-medium`.
- Voice model source: Rhasspy Piper Voices.
- Voice dataset license listed by the model card: CC BY-NC-SA 4.0.
- Voice quality: medium, 22,050 Hz.

Important:
The DFKI Turkish voice dataset is non-commercial (CC BY-NC-SA 4.0).
Use this workflow for non-commercial/public project narration unless and until
a commercially compatible Turkish voice is selected.

The website does not bundle the Piper runtime. GitHub Actions installs Piper
during generation and commits only the generated MP3 files and manifest.
