# HCU Copy Story v5.3

Bu paket iki işi birlikte yapar:

1. Eski tarayıcı tabanlı `Sesli Oku` oynatıcısını sayfadan kaldırır.
2. `🎧 Anlatıcı Modu` paneline `📋 Hikâyeyi Kopyala` butonu ekler.

## Kopyalama davranışı

Buton:
- bölümün hikâye metnini kopyalar,
- başlık ve paragraf düzenini korur,
- görselleri ve görsel açıklamalarını kopyalamaz,
- oynatıcı kontrollerini kopyalamaz,
- başka bir TTS / sesli okuma uygulamasına yapıştırmaya uygundur.

Türkçe arayüz:
`📋 Hikâyeyi Kopyala` → `✓ Kopyalandı`

İngilizce ve diğer diller:
`📋 Copy Story` → `✓ Copied`

## GitHub'a yükleme

ZIP'i açın.
İçindeki `web/` klasörünü repository köküne yükleyin.

Değişecek:
- `web/index.html`

Yeni:
- `web/assets/copy-story.v1.js`

Commit mesajı:

`Add copy story button and remove duplicate audio player`

Eski `reader-audio.v1.js/css` dosyalarını repository'den silmek zorunda değilsiniz.
Yeni `index.html` artık onları yüklemez.
