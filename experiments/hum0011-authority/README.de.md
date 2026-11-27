# HUM-0011 — Beleg gesehen. Wer gab die Befugnis?

[English](README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [العربية](README.ar.md)

> Diese Zusammenfassung ist ein noch zu prüfender Übersetzungsentwurf, keine vollständige Übersetzung. Maßgeblich für Details und Abnahmekriterien ist die [türkische Originalquelle](README.tr.md).

Historische TR/EN-Reader-Integration November 2026. Fiktiver Autoritätskonflikt: geprüfte Rechnung ist weder bestätigte menschliche Wirkung noch Befugnis; Bewusstsein, getrennte Stimmen und Austritt ungeklärt. Drei bestehende Optionen, Vorschau/Abbruch/einmalige Bestätigung, Profile ergeben 100, keine Moral-/Bewusstseinswerte. Alle lehnen enforce und shutdown ab: keine unerlaubte Einschränkung oder automatische Abschaltung. Terminal/Reader nutzen vorhandenen Motor und fixierte Quellen, kein neuer Story-Knoten, keine persistente Terminal-Personendaten. Original meldet 28 Tests und Build erfolgreich, keine unabhängige Prüfung hier. Reader applyChoice einmal; Textalternativen erhalten Entscheidungen, Screenreader und 3D separat. Fiktion ist keine Rechtsbefugnis, KI-Governance oder biomedizinische Evidenz.



```sh
python scripts/build_reader.py
node --test experiments/hum0011-authority/test.cjs scripts/test_authority_reader.cjs
node experiments/hum0011-authority/play.cjs
node experiments/hum0011-authority/play.cjs light_accountable_collective
node experiments/hum0011-authority/play.cjs light_accountable_collective --confirm
```