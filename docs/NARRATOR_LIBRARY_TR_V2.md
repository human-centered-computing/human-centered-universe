# HCU Türkçe Anlatıcı Kütüphanesi v2

Bu paket canlı canondaki 21 Türkçe bölümün tamamına 🎧 Anlatıcı Modu ekler.

- Dil: Türkçe
- Anlatıcı stili: Fancy
- Toplam bölüm: 21
- Mevcut Hızlı Sesli Oku korunur.
- Göbekli Tepe medya katmanı korunur.
- `stories/`, `universe/`, `scripts/`, `.github/workflows/` değiştirilmez.

## Önemli
Bu sürüm sesleri üretilen barındırılmış ses bağlantılarından oynatır. `narrator.v1.js/css` dosyaları repository'de kalabilir ancak `web/index.html` artık onları yüklemez; bunun yerine `narrator-library.v2.js/css` yüklenir. Böylece BRG-0002'de çift oynatıcı oluşmaz.
