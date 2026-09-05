# HCU Audio Reader v1

## Amaç

Bu paket, Human-Centered Universe okuyucusuna tarayıcının yerleşik Speech Synthesis özelliğini kullanarak sesli okuma ekler.

## Değişen dosyalar

- `web/index.html`
- `web/assets/reader-audio.v1.js`
- `web/assets/reader-audio.v1.css`

## Değişmeyen yapı

Aşağıdaki yapılara dokunulmaz:

- `stories/`
- `universe/`
- `scripts/build_reader.py`
- `scripts/validate_universe.py`
- `.github/workflows/`
- Göbekli Tepe görsel katmanı (`media.v1.js` / `media.v1.css`)

## Özellikler

- Türkçe ve İngilizce sesli okuma
- Başlat / duraklat / devam / durdur
- Önceki ve sonraki paragraf
- 0.75×, 1×, 1.25×, 1.5× hız
- Cihaz/tarayıcıdaki uygun sesleri seçme
- Okunan metin bloğunu vurgulama
- Bölüm ve dil bazında kaldığı yeri `localStorage` ile hatırlama
- Fotoğraf açıklamalarını okumama
- Bölüm/dil değişince sesi otomatik durdurma
- Otomatik oynatma yapmama

## Yükleme

ZIP'i açın ve içindeki `web/` ve `docs/` klasörlerini repository köküne taşıyın.
`web/index.html` dosyasının mevcut dosyanın üzerine yazılmasına izin verin.

Önerilen commit mesajı:

`Add browser-native audio reader`
