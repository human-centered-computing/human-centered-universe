# HCU Browser TTS Fallback v5.4

Bu paket Anlatıcı Modu'na ücretsiz tarayıcı tabanlı metin seslendirme ekler.

## Davranış

Profesyonel MP3 hazırsa:
- mevcut profesyonel Anlatıcı Modu çalışır.

Profesyonel MP3 henüz hazır değilse:
- aynı Anlatıcı Modu panelinin içinde `🔊 Metin Seslendirme` görünür,
- ikinci ayrı medya oynatıcı oluşturulmaz,
- tarayıcı/cihaz sesleri kullanılır,
- API anahtarı gerekmez.

## Kontroller

- Tarayıcıyla Seslendir
- Duraklat / Devam Et
- Durdur
- Önceki paragraf
- Sonraki paragraf
- Ses seçimi
- Hız seçimi
- Paragraf konumu
- Hikâyeyi Kopyala butonu mevcut sistemde çalışmaya devam eder

## GitHub'a yükleme

ZIP'in kökünde doğrudan `web/` klasörü vardır.
ZIP'i açtıktan sonra bu `web/` klasörünü repository köküne yükleyin.

Değişecek:
- web/index.html

Yeni:
- web/assets/narrator-browser-fallback.v1.js
- web/assets/narrator-browser-fallback.v1.css

Commit mesajı:
Add browser TTS fallback to narrator mode

Bu ZIP'de ekstra `hcu-.../` üst klasörü yoktur; yollar doğrudan repo köküne göre hazırlanmıştır.
