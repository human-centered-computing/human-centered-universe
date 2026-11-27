# Übersetzungssystem

> Übersetzungsstatus: KI-unterstützter Entwurf, menschliche Sprachprüfung ausstehend.

[English](README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [العربية](README.ar.md)

## Kontrollierte Quelle und maßgebliche Ebene
Türkische redaktionelle Quelle → KI-Übersetzung ins Englische → menschliche Prüfung → maßgebliches Englisch; daraus KI-Übersetzung nach de, es, fr, it, ru, zh-CN, ja, ar, ku, pt. Türkisch/Englisch menschlich kontrolliert, die zehn anderen Sprachen KI-erzeugt und nicht menschlich geprüft.

## Metadaten
- `en`: `{"status":"canonical","human_reviewed":true}`
- `tr`: `{"status":"reviewed","human_reviewed":true}`
- andere: `{"status":"machine_draft","human_reviewed":false}`
Erst nach tatsächlicher menschlicher Sprachprüfung zu reviewed ändern.

## Ebenen und Fallback
Übersetzungen bleiben unter derselben Story-ID als `content/<language-code>.md`; fehlt die gewählte Sprache, zeigt der Reader kanonisches Englisch.

## Kulturelle Adaption
Keine Übersetzung: eigener Story-Knoten, eigene ID und explizite Beziehungen.