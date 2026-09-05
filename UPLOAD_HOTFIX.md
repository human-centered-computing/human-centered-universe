# HCU Narrator Hotfix v5.1

Bu düzeltme iki sorunu çözer:

1. Manifest boş olsa bile okuma sayfasında `🎧 Anlatıcı Modu` görünür.
   Ses henüz üretilmediyse `Ses hazırlanıyor` mesajı gösterilir.
2. TTS bot commit'indeki `[skip ci]` kaldırılır.
   Böylece MP3 commitinden sonra mevcut GitHub Pages deploy workflow'u otomatik çalışır.

## Yükleme
ZIP'i açın ve içindeki `.github/` ile `web/` klasörlerini repository köküne yükleyin.
Mevcut dosyaların üzerine yazılmasını kabul edin.

Commit:
`Fix narrator visibility and Pages redeploy`

## Sonra
GitHub → Actions → Generate Multilingual Narration

Mevcut çalışma hâlâ devam ediyorsa bitmesini bekleyebilirsiniz.
Gerekirse manuel olarak:
- language = tr
- story_id = BRG-0002

çalıştırın.

MP3 oluştuktan sonra yeni bot commit'i Pages deploy'unu otomatik tetikler.
