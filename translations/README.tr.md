# Çeviri sistemi

> Çeviri durumu: Yapay zekâ destekli taslak; insan dil incelemesi bekliyor.

[English](README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [العربية](README.ar.md)

## Kontrollü kaynak ve kanonik katman
Türkçe editoryal kaynak → AI İngilizce çeviri → insan kontrolü → kanonik İngilizce; kanonik İngilizce → AI ile de, es, fr, it, ru, zh-CN, ja, ar, ku, pt. Türkçe ve İngilizce insan kontrollü; diğer on dil AI üretimi ve insan incelemesizdir.

## Metadata kuralı
- `en`: `{"status":"canonical","human_reviewed":true}`
- `tr`: `{"status":"reviewed","human_reviewed":true}`
- diğerleri: `{"status":"machine_draft","human_reviewed":false}`
Gerçek insan dil incelemesi tamamlanmadan reviewed yapılmaz.

## Dil katmanları ve fallback
Çeviriler aynı hikâye ID altında `content/<language-code>.md` olarak kalır. Seçili dil yoksa okuyucu kanonik İngilizce gösterir.

## Kültürel uyarlama
Çeviri değildir; yeni hikâye düğümü, kendi ID'si ve açık ilişkileri olur.