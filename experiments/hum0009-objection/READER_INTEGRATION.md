# İtiraz sahnesini hikâyeye bağlama — HUM-0009

## Teslim edilen tek adım

Okur HUM-0009'u Türkçe veya İngilizce açınca iki belge artık hikâyenin **mevcut seçim alanında** yer alır.
“Benim kaydım” ile “Dilan'ın itirazı” açılınca üç mevcut yaklaşım etkinleşir. Seçimi önizler, vazgeçer
veya onaylarım. Onay, okuyucunun mevcut applyChoice / saveObserver yoluna gider. Yeni bir puan
defteri ve ikinci bir HUM-0009 seçimi oluşturulmaz.

Bu bağlantı PR #58'in çalışma dalındadır. Ana dala birleştirilmedi ve canlı yayında değildir.

## 8 Kasım 2026 incelemesi

- main: 45edf0d7dab876860a37acff268e10e04b892716; son ana dal değişikliği 27 Ekim Almanca ses kaydı.
- PR #58: açık taslak; başlangıç head'i 380f8594915b7f47d36b197a2920e7ddaadfc189.
- Son PR doğrulaması başarılıydı. 25 Ekim terminali ve 1 Kasım ayrı tarayıcı denemesi zaten vardı.
- Bu adım bunları yeniden yazmaz; aynı sahne verisini gerçek okuyucunun veri paketine bağlar.

## Kullanım

PR dalını aldıktan sonra depo kökünden:

```sh
python scripts/build_reader.py
node --test experiments/hum0009-objection/test.cjs experiments/hum0009-objection/browser.test.cjs scripts/test_objection_reader.cjs
python -m http.server 8000 --directory site
```

Aynı bilgisayarda:
http://localhost:8000/?mode=read&story=HUM-0009&lang=tr

İngilizce için lang=en. Diğer dillerde bu aşamada mevcut seçim akışı sürer.
Ayrı terminal/tarayıcı sandbox'ları geçici denemeler olarak kalır; aşağıdaki tablo farkı açıklar.

| Akış | Okuyucu yolculuğu |
|---|---|
| experiments/hum0009-objection/play.cjs | Yalnız geçici oturum |
| experiments/hum0009-objection/index.html | Yalnız geçici oturum |
| Derlenmiş kitapta HUM-0009 seçim alanı | Kullanıcının onayından sonra mevcut yolculuğa tek kayıt |

## Bağlantı dosyaları

- scripts/build_reader.py: revision 4 sahneyi yalnız HUM-0009'a ekler; ortak çekirdeği assets içine taşır.
  Hikâye ve sahne sürümü uyuşmuyorsa derleme açık hata ile durur.
- web/assets/hum0009-objection-reader.v1.js: belge durumu ve önizleme iznini yönetir; hiçbir skor yazmaz.
- web/assets/app.js: mevcut üç düğmeyi belge durumuna bağlar; gerçek applyChoice içinde de izni denetler.
- web/index.html: çekirdek → sahne bağlayıcısı → uygulama sırasını sağlar; uygulama sürümü güncellenmiştir.
- scripts/test_objection_reader.cjs: gerçek applyChoice fonksiyonunu çalıştırarak kayıt ve tekrar onay durumlarını sınar.

Sahne bağlayıcısı, terminal ve ayrı tarayıcı prototipinin kullandığı flow.js fabrikasını kullanır.
**flow.confirm okuyucu modunda çağrılmaz.** Etkiyi yalnız mevcut applyChoice ekler.
Önizleme kapatılırsa onay izni kalkar. Dil yeniden render edildiğinde belge açma bilgisi korunur,
bekleyen onay sıfırlanır; kullanıcı yeni dilde yeniden önizleyip onaylar.
Önceden seçilmiş kayıt asla tekrar ödüllendirilmez. Eski kaydın görüntülenmesi yeniden belge açmaya bağlı değildir.

## Hikâye, mekân ve bilgi katmanları

Birinci tekil anlatım ve tarihsiz hikâye korunur. Mevcut ego/arınma çatışması ve inançlar arası
ayrımlar aynen kalır. Kimsenin inancı, ruhu veya arınmışlığı puanlanmaz.
Merkez koordinatları anlatı tercihidir: HUMAN + LIGHT + DARK = 100.

FIRST VIBRATION ve Girê Miraza / Xerawreşk (Göbekli Tepe) bağlamı değişmez.
Mevcut on iki sütunlu görsel ve 3D sahneler korunur; bu adım yeni 3D renderer eklemez.
WebGL olmayan cihazda da belgeler ve seçimler metin olarak kullanılabilir.

Altı katman scene.json.epistemic_layers ve hikâye meta.json.choice_epistemic_layers içindedir:

| Katman | Bu sahnedeki anlamı |
|---|---|
| Yerleşik bilim | Kalıcı ego yok oluşuna veya evrensel psikolojik yasaya kanıt sunulmaz. |
| Gerçek mühendislik | Durum makinesi, sürüm kontrolü, yerel kayıt ve normalizasyon uygulanır. |
| Yorum | Eleştirinin benlik algısına tehdit gibi hissedilmesi anlatıcının deneyimidir. |
| Felsefe | Başarıdan, hatta arınmış olmaktan duyulan gurur eylemle sorgulanır. |
| İnanç/kültür | Farklı benlik, ruh ve kurtuluş anlayışları farklı kalır; inançsız kişinin hakkı da korunur. |
| Bilim kurgu | Kuantum-AI mekânı ve FIRST VIBRATION fiziksel bilinç kanıtı değildir. |

Belgeler kurgusal anlatı verisidir. Sistem gerçek blokzincir işlemi yapmaz ve katkı iddiasını
doğrulanmış hak sahipliği kararına dönüştürmez.

## Tamamlanma ve doğrulama

Yerel, HUM-0009 içeren küçük bir derleme ağacında 24/24 otomatik kontrol geçti:
önceki 15 çekirdek kontrolü ve 9 okuyucu bağlantı kontrolü.
Bu, bütün deponun bütün hikâyelerle üretim derlemesinin veya görsel testinin yapıldığı anlamına gelmez.

- [x] İki belge açılmadan seçim ve doğrudan applyChoice çağrısı kayıt oluşturmaz.
- [x] Önizleme/geri dönüş kalıcı profile dokunmaz; yanlış önizleme anahtarıyla onay reddedilir.
- [x] Üç yaklaşım da mevcut kayda bir kez eklenir; eski seçim ve çift onay ikinci etki eklemez.
- [x] Diğer hikâyeler ve bu sahnenin desteklenmeyen dilleri mevcut akışı sürdürür.
- [x] Dil yeniden çiziminde belgeler korunur, bekleyen onay yeniden istenir.
- [x] Bağlayıcı yüklenmezse etkin sahnenin kaydı kapalı kalır.
- [x] Derlenmiş veri sahneyi içerir ve script sırası/ortak çekirdek kopyası doğrulanır.
- [ ] Tam depo derlemesi ve CI sonuçları kontrol edilmeli.
- [ ] Gerçek tarayıcıda belgeler, üç dal, geri dönüş, çift onay ve sayfa yenileme denenmeli.
- [ ] 320px mobil, Tab/Enter, sonuç odağı ve ekran okuyucu kontrol edilmeli.
- [ ] İlk Titreşim ve On Üçüncü Çentik 3D sahnelerinde görsel gerileme kontrolü yapılmalı.

BROWSER_ACCEPTANCE.md ayrı sandbox'ı sınar. Kitabın içindeki akış için yukarıdaki yeni liste geçerlidir.
Görsel tarayıcı ve ekran okuyucu kontrolleri bu teslimatta tamamlanmış olarak işaretlenmemiştir.
