#!/bin/bash

set -u

echo "Human-Centered Universe temizlik aracı"
echo "Bu betik yalnızca gereksiz/eski dosyaları kaldırır."
echo

if [ ! -d ".git" ] || [ ! -d "stories" ] || [ ! -d "web" ]; then
  echo "HATA: Bu dosyayı human-centered-universe depo klasörünün içinde çalıştırmalısın."
  exit 1
fi

echo "Silinecek dosya ve klasörler:"
cat <<'EOF'

Kök geçici dosyaları:
- UPLOAD.md
- UPLOAD_AUDIO_READER.md
- UPLOAD_BROWSER_TTS.md
- UPLOAD_COPY_STORY.md
- UPLOAD_GITHUB_TTS.md
- UPLOAD_GOBEKLI_TEPE_MEDIA.md
- UPLOAD_HOTFIX.md
- UPLOAD_MULTILINGUAL_TTS.md
- UPLOAD_NARRATOR_ALL_TR.md
- UPLOAD_NARRATOR_BRG0002.md
- UPLOAD_TO_GITHUB.md

Web içindeki geçici dosyalar:
- web/assets/UPLOAD_COPY_STORY.md
- web/assets/UPLOAD_FIX.md

Birebir / yanlışlıkla oluşmuş kopyalar:
- human-centered-universe/
- web/assets/web/

Eski anlatıcı / ses arayüzü:
- web/assets/narrator.v1.js
- web/assets/narrator.v1.css
- web/assets/narrator-library.v2.js
- web/assets/narrator-library.v2.css
- web/assets/narrator-library.v4.js
- web/assets/narrator-library.v4.css
- web/assets/reader-audio.v1.js
- web/assets/reader-audio.v1.css
- web/assets/audio/tr/narrator-library.v2.json
- web/assets/audio/tr/BRG-0002/

Eski Türkçe TTS sistemi:
- .github/workflows/generate-narration.yml
- scripts/generate_narration.py

EOF

read -r -p "Devam edip bunları silmek istiyor musun? (e/h): " answer
case "$answer" in
  e|E|evet|EVET)
    ;;
  *)
    echo "İşlem iptal edildi."
    exit 0
    ;;
esac

rm -f \
  UPLOAD.md \
  UPLOAD_AUDIO_READER.md \
  UPLOAD_BROWSER_TTS.md \
  UPLOAD_COPY_STORY.md \
  UPLOAD_GITHUB_TTS.md \
  UPLOAD_GOBEKLI_TEPE_MEDIA.md \
  UPLOAD_HOTFIX.md \
  UPLOAD_MULTILINGUAL_TTS.md \
  UPLOAD_NARRATOR_ALL_TR.md \
  UPLOAD_NARRATOR_BRG0002.md \
  UPLOAD_TO_GITHUB.md \
  web/assets/UPLOAD_COPY_STORY.md \
  web/assets/UPLOAD_FIX.md \
  web/assets/narrator.v1.js \
  web/assets/narrator.v1.css \
  web/assets/narrator-library.v2.js \
  web/assets/narrator-library.v2.css \
  web/assets/narrator-library.v4.js \
  web/assets/narrator-library.v4.css \
  web/assets/reader-audio.v1.js \
  web/assets/reader-audio.v1.css \
  web/assets/audio/tr/narrator-library.v2.json \
  .github/workflows/generate-narration.yml \
  scripts/generate_narration.py

rm -rf \
  human-centered-universe \
  web/assets/web \
  web/assets/audio/tr/BRG-0002

echo
echo "Temizlik tamamlandı."
echo
echo "Git durumu:"
git status --short
echo
echo "Henüz GitHub'a hiçbir şey gönderilmedi."
echo "Kontrol ettikten sonra commit/push işlemini ayrıca yapabilirsin."
