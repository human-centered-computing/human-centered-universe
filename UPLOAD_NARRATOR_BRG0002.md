# GitHub'a yükleme — BRG-0002 Anlatıcı Modu

1. `hcu-narrator-brg0002-v1.zip` dosyasını masaüstünde aç.
2. İçindeki `hcu-narrator-brg0002-v1` klasörüne gir.
3. GitHub'da `human-centered-computing/human-centered-universe` repository'sini aç.
4. `main` branch üzerinde **Add file → Upload files** seç.
5. Wrapper klasörün kendisini değil, içindeki `web/` ve `docs/` klasörlerini repository köküne yükle.
6. `web/index.html` için mevcut dosyanın üzerine yazılmasına izin ver.
7. Commit mesajı:

   `Add narrator mode for BRG-0002 Turkish`

8. GitHub Actions'ta:
   - Validate Universe
   - Deploy Interactive Reader

   işlemlerinin yeşil ✓ olmasını bekle.
9. Sonra şu sayfayı aç:

   `https://human-centered-computing.github.io/human-centered-universe/?mode=read&story=BRG-0002&lang=tr`

10. Sayfada **🎧 Anlatıcı Modu** görünmeli.

## Repository'de oluşacak yapı

web/
├── index.html                         (güncellenir)
└── assets/
    ├── narrator.v1.js                 (yeni)
    ├── narrator.v1.css                (yeni)
    └── audio/
        └── tr/
            └── BRG-0002/
                ├── manifest.json
                └── README.md

docs/
└── NARRATOR_MODE.md                   (yeni)

Mevcut `app.js`, `styles.css`, `media.v1.*`, `reader-audio.v1.*`, stories ve canon dosyaları değiştirilmez.
