# GitHub'a yükleme — Tüm Türkçe Bölümler Anlatıcı Modu v2

1. ZIP'i masaüstünde aç.
2. `hcu-narrator-all-tr-v2` klasörünün içine gir.
3. GitHub repository:
   `human-centered-computing/human-centered-universe`
4. main branch → Add file → Upload files.
5. Wrapper klasörün kendisini değil, içindeki `web/` ve `docs/` klasörlerini repository köküne yükle.
6. `web/index.html` üzerine yazılmasına izin ver.
7. Commit mesajı:

   `Add Turkish narrator mode to all live canon chapters`

8. GitHub Actions'ta Validate Universe ve Deploy Interactive Reader yeşil ✓ olmalı.
9. Herhangi bir Türkçe bölümü aç:
   `?mode=read&story=BRG-0003&lang=tr`
   veya başka bir canon ID.
10. Sayfada 🎧 Anlatıcı Modu görünmeli.

Not: Eski `web/assets/narrator.v1.js` ve `.css` repository'de kalabilir. Yeni index bunları yüklemediği için çakışma olmaz.
