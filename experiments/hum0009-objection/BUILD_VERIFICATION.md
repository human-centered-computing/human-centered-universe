# Tam okuyucu derlemesi için PR kontrolü

## Tek adım ve gerekçe

15 Kasım 2026 kontrolünde main hâlâ 45edf0d7 (27 Ekim), PR #58 açık taslak ve head 6cf876d03cae15b567ddafcabb26028815d22f8b idi.
Mevcut Validate Universe işi başarılıydı, fakat scripts/build_reader.py veya yeni 24 sahne/okuyucu testini çalıştırmıyordu.
Önceki haftanın okuyucu bağlantısı yeniden yazılmadı. Bu teslimat, **tam derleme doğrulamasını CI işine ekler**.

## Dosyalar

- .github/workflows/validate-universe.yml: mevcut kontrollerden sonra tam okuyucuyu derler,
  24 sahne/bağlantı testini, 8 hata-enjeksiyon testini ve derlenmiş çıktı denetimini çalıştırır.
- scripts/verify_reader_build.py: derlenen kitabı kaynak hikâyelerle karşılaştırır ve JSON rapor üretir.
- scripts/test_verify_reader_build.py: kontrolün eksik varlık, kayıp hikâye, yanlış merkez toplamı,
  eski sahne, eksik bilgi katmanı, yanlış script sırası ve kaldırılmış 3D scriptini yakaladığını sınar.

Çalıştırma, depo kökünden:

```sh
python scripts/build_reader.py
node --test experiments/hum0009-objection/test.cjs experiments/hum0009-objection/browser.test.cjs scripts/test_objection_reader.cjs
python scripts/test_verify_reader_build.py
python scripts/verify_reader_build.py --report reader-build-report.json
```

## Denetlenen sözleşme

1. Kaynakta canon/core durumundaki hikâyelerle derlenmiş hikâye kimlikleri birebir eşleşir.
2. Her hikâyenin yalnız HUMAN/LIGHT/DARK ağırlıkları bulunur; toplam 100'dür.
3. FIRST VIBRATION başlangıcı BRG-0002 olarak korunur.
4. HTML'deki yerel JS/CSS dosyaları gerçekten vardır; dış adrese veya site dışına kaçış reddedilir.
5. Gözlemci motoru → ortak sahne çekirdeği → okuyucu bağlayıcısı → uygulama sırası korunur.
6. Derlenmiş HUM-0009 sahnesi kaynakla aynıdır ve hikâyenin revision değeriyle eşleşir.
7. Üç kanonik seçim, TR/EN metin, on iki sütun ve altı bilgi katmanı pakette yer alır.
8. Ortak flow.js kopyası byte düzeyinde aynıdır; mevcut iki 3D scripti paketlenmiştir.

Hikâye sayısı sabitlenmez: yeni hikâyeler kaynakta kabul edildiğinde doğrulama kümesi otomatik genişler.
Dosyaların SHA-256 değerleri JSON raporda tutulur. Bu değerler dosya kimliğini izler;
bir katkının doğru, adil veya manevi olarak üstün olduğunu kanıtlamaz.

## Katman ayrımı ve kanon

Anlatı metni değiştirilmez. Bilgi katmanları sahne verisinde açıkça ayrıdır:
yerleşik bilim (evrensel ego yasası iddiası yok), gerçek mühendislik (derleme/durum/kayıt kontrolleri),
yorum (anlatıcının eleştiriyi algılaması), felsefe (arınma/başarı döngüsü),
inanç/kültür (farklı benlik anlayışlarının farklı kalması), bilim kurgu (FIRST VIBRATION ve kuantum-AI).
Kuantum bilincin veya arınmanın fiziksel olarak doğrulandığı ileri sürülmez.
Girê Miraza / Xerawreşk, birinci şahıs anlatımı ve kültürel çoğulluk korunur.

## Sonuç nasıl okunur?

CI işinde “Build complete interactive reader”, “Test objection scene and reader integration”,
“Test reader artifact verifier failure cases” ve “Verify complete reader artifact” adımlarının
tamamı başarılı olmalıdır. Job summary hikâye ve runtime dosyası sayısını gösterir.
JSON rapor kod sürümünü ve doğrulanan kontrolleri içerir. Yerel 8 hata-enjeksiyon testi bu teslimatta geçti;
tam depo sonucu GitHub işinin gerçek sonucundan okunmalıdır.

Bu teslimat yayımlama veya ana dala birleştirme yapmaz. Şunlar otomatik raporda da açıkça
**doğrulanmadı** olarak kalır:

- Gerçek tarayıcı görünümü ve 320px mobil düzen
- Tab/Enter, odak aktarımı, ekran okuyucu
- WebGL/3D çiziminin görsel doğruluğu
- İnsan editör incelemesi

3D scriptinin dosya olarak bulunması, 3D sahnesinin doğru çizildiği anlamına gelmez.
Bu kontrol yeşile döndüğünde tam derleme engeli kapanır; görsel kontroller ayrıca tamamlanmalıdır.

## Gerçek tam depo sonucu — 15 Kasım 2026

[Validate Universe işi 43733613571](https://github.com/human-centered-computing/human-centered-universe/actions/runs/43733613571) başarılı tamamlandı.

- Kod head'i: f7dfe52f6f4319cf7bb220bbed8bd77c4866f0db
- Test edilen PR birleşim görünümü: 00b631c291f851f43e3f3dbc101a62e14316f663
- Yayımlanabilir hikâye: **70**
- Yerel JS/CSS dosyası: **20**
- Sahne/okuyucu testleri: **24/24 geçti**
- Doğrulayıcı hata-enjeksiyon testleri: **8/8 geçti**
- Tam derleme ve çıktı doğrulaması: **başarılı**

Görsel çizim, klavye odağı, ekran okuyucu, mobil düzen, gerçek 3D çizimi ve insan editör
incelemesi raporda doğrulanmadı olarak kalır. Bu sonuç Pages dağıtımı değildir; PR açık taslaktır.
Bu sonuç bölümünün ve kontrol listesinin eklenmesi test edilmiş uygulama kodunu değiştirmez.
