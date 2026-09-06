# README Language Architecture

Canonical root files:

- `README.md` — English
- `README.tr.md` — Turkish

Localized README directory:

```text
README/
├── README.en.md
├── README.tr.md
├── LANGUAGES.md
└── assets/
    └── hcu-three-centers-triangle.png
```

## Rule

- English remains canonical.
- Turkish is provided both in the repository root and inside `README/`.
- When a new interface locale is added, create the matching file:
  - `README/README.de.md`
  - `README/README.fr.md`
  - `README/README.es.md`
  - `README/README.ar.md`
  - `README/README.ku.md`
  - etc.

## Naming

Use:

`README.<language-code>.md`

Prefer BCP-47 / ISO compatible language codes.

## Synchronization

When the canonical README changes, update:
- `README.md`
- `README.tr.md`
- localized files under `README/`

HCU-specific terms such as HUMAN / LIGHT / DARK, Quantum Time, Observer State, story node IDs, and file paths should remain technically traceable to the canonical English version.
