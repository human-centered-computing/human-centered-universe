# HCU Narrator Mode v1 — BRG-0002 Türkçe

Bu paket BRG-0002 Türkçe okuyucu sayfasına profesyonel **🎧 Anlatıcı Modu** ekler.

## Aktif olduğu sayfa

`?mode=read&story=BRG-0002&lang=tr`

## Ses

- Bölüm: İlk Titreşim: Arın ve Özüne Dön
- Dil: Türkçe
- Ses stili: Fancy
- Üretilen kayıt: `https://www.aidocmaker.com/g0/audio?name=c37759eca64d4989b5103480e65147f9`

## Özellikler

- Dinle / Duraklat
- 15 saniye geri / ileri
- 0.8× / 1× / 1.2× / 1.5× hız
- Oynatma ilerleme çubuğu
- Kaldığı yeri tarayıcıda hatırlama
- Anlatıcı başladığında tarayıcı SpeechSynthesis sesini durdurma
- Hızlı "Sesli Oku" başlatılırsa anlatıcıyı duraklatma
- Sadece BRG-0002 Türkçe bölümünde görünme

## Mimari

Mevcut `reader-audio.v1.js` ve `reader-audio.v1.css` değiştirilmez.
Canon, stories, build scriptleri ve GitHub Actions değiştirilmez.

## Kalıcı yerel MP3'e geçiş

Bu ilk paket doğrudan üretilen kayıt bağlantısını kullanır. MP3 dosyası daha sonra GitHub'a
`web/assets/audio/tr/BRG-0002/BRG-0002-narration.mp3`
olarak konursa `web/assets/narrator.v1.js` içindeki CONFIG.audio değeri şu şekilde değiştirilir:

`./assets/audio/tr/BRG-0002/BRG-0002-narration.mp3`
