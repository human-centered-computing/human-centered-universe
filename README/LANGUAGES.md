# README Language Architecture

## Canonical files

- `/README.md` — English canonical
- `/README.tr.md` — Turkish root copy

## Localized README files

- `README/README.en.md` — English
- `README/README.tr.md` — Türkçe
- `README/README.de.md` — Deutsch
- `README/README.ku.md` — Kurmancî
- `README/README.ar.md` — العربية
- `README/README.es.md` — Español
- `README/README.zh-CN.md` — 简体中文
- `README/README.ja.md` — 日本語

Shared visual:

- `README/assets/hcu-three-centers-triangle.png`

## Naming rule

Use:

`README.<language-code>.md`

Prefer BCP-47 / ISO-compatible language codes.

## Synchronization rule

English remains canonical. When the Three-Center Model, Observer Model, Quantum Time, Universe Creator, language policy, or Git workflow changes, localized README files should be updated from the same canonical revision.

HCU-specific terms such as HUMAN / LIGHT / DARK, Observer State, Quantum Time, node IDs, and repository paths should remain technically traceable to the canonical English version.
