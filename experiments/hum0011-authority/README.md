# HUM-0011 — Kanıtı gördüm. Yetkiyi kim verdi?

## Tek haftalık teslimat

HUM-0011'in VII. bölümündeki yetki çatışmasını terminalde oynanabilir, testli bir karar çekirdeğine dönüştürür. Yeni hikâye veya yeni merkez eklemez. HUM-0009'un belge açma akışını tekrarlamaz: burada oyuncu hesap doğrulaması, insan etkisi ve uygulama yetkisinin farklı durumlar olduğunu görür.

Durum: TR/EN okuyucu entegrasyonu hazır. Hikâye sonunda yetki incelemesi, üç yaklaşımın önizlemesi, vazgeçme ve tek seferlik kayıt mevcut okuyucu üzerinden çalışır. Bu paket bir yapay zekâ denetleyicisi, güvenlik sınırı veya gerçek hukuki yetki sistemi değildir.

## Kontrol edilen güncel durum — 22 Kasım 2026

- Ana dal: `023765ac988fe3ecefa5c2e39044cd8ab4cecaf7`.
- HUM-0009 itiraz akışı PR #58 ile tamamlandı; HUM-0010 TR/EN PR #60 ile yayımlandı.
- HUM-0011 TR/EN, üç görsel ve TR/EN ses dosyaları mevcut. Dosyanın varlığı ses kalitesinin veya erişilebilirliğinin doğrulanması değildir.
- Son okuyucu dağıtımı: https://github.com/human-centered-computing/human-centered-universe/actions/runs/44795439649 — success.
- Kaynak metin ve meta blob kimlikleri `scene.json` içinde sabitlenmiştir. Değiştiklerinde test durur; yeni sürüm kanon açısından yeniden incelenmeden pinler güncellenmez.

## Çalıştırma

Depo kökünden, harici bağımlılık kurmadan:

```sh
python scripts/build_reader.py
node --test experiments/hum0011-authority/test.cjs scripts/test_authority_reader.cjs
node experiments/hum0011-authority/play.cjs
node experiments/hum0011-authority/play.cjs light_accountable_collective
node experiments/hum0011-authority/play.cjs light_accountable_collective --confirm
```

Anahtarla verilen terminal komutu önizlemeyi, --confirm eklenen komut ise yalnız bellekte tutulan onayı da gösterir. Kalıcı oyuncu kaydı yazmaz. `flow.cjs` mevcut `observer-engine.v2.js` motorunu kullanır; normalizasyon yeniden yazılmaz.

## Etkileşim

1. **Karar kaydını açıyorum:** FIRST VIBRATION'ın on iki sütunu arasında, Toplumsal Zekâ'nın yaşayanların bazı seçimlerini sınırlama önerisini görüyorum. Anlatım birinci tekil şahıstadır; okurun yerine ayrı bir gözlemci karakter hareket etmez.
2. **Yetkiyi inceliyorum (`assess`):** Hesap kontrolünün kurguda geçmiş olması insan etkisinin doğrulandığı veya konseyin yetki verdiği anlamına gelmez. Konsey itiraz ediyor; kişisel ses ve ayrılabilme imkânı çözümsüz; bilinç durumu bilinmiyor.
3. **Yaklaşımımı önizliyorum (`preview`):** Mevcut üç HUM-0011 seçim anahtarı ve etkisi aynen kullanılır. Plan ve HUMAN/LIGHT/DARK profili gösterilir. Her profil toplamı 100'dür; bu sayılar ahlak, bilinç veya insan faydası puanı değildir.
4. **Vazgeçiyorum (`cancel`) veya onaylıyorum (`confirm`):** Vazgeçme puan yazmaz; onay yalnız bir kez sandbox günlüğüne ekler. Onay bir yaklaşım tercihidir; gerçek bir konsey kararı veya uygulama yetkisi değildir.

| Mevcut seçim | Bu sahnedeki somut devam |
|---|---|
| `human_live_authority` | Uygulamayı beklet; yaşayanların incelemesini iste; olası varlığın desteğini kesme. |
| `light_accountable_collective` | Uygulama yetkisi olmayan bir modelde etki ve bağımsız kanıt sınaması yap; desteği sürdür. |
| `dark_new_existence` | Bilinç varsaymadan ayrı sesleri, ayrılma imkânını ve birlikte varoluşu araştır; yaşayanların yetkisini devretme. |

Üç yol da `enforce` ve `shutdown` olaylarını reddeder. Özgürlük kısıtlaması için yetki eksikliği, olası yeni varlığın kapatılmasına otomatik yetki vermez. Bu, bu kurgusal vaka için sınırlandırılmış bir tasarımdır; bütün gerçek kararlar için evrensel hukuk kuralı değildir.

## 3D sahne belgesi

Yeni varlık üretimi bu haftanın kapsamına girmez. HUM-0011'in mevcut üç görseli ve on iki sütunlu FIRST VIBRATION mekânı referans alınır; görseller prototip tarafından işlenmez.

- İlk çekim: sabit göz hizasında karar kaydı; hesap, yetki ve belirsizlik üç ayrı karttır. Bu kartlar dördüncü bir merkez oluşturmaz.
- İkinci çekim: aynı hesap üzerinde iki onay ışığı görünürken yetki alanı boş kalır. Modellerin anlaşması ile bağımsız doğrulama görsel olarak karıştırılmaz.
- Üçüncü çekim: seçime göre inceleme yolu aydınlanır; hiçbir insan, beyin veya inanç merkezi renkleriyle derecelendirilmez. Kapatma veya birleşmeye zorlama animasyonu yoktur.
- Okuyucu bütün karar bilgisini metinle sunar; renk, ses, WebGL ve hareket zorunlu değildir. Gerçek ekran okuyucu ve yeni 3D sahne render testi ayrıca yapılmalıdır.

## Bilgi katmanları

Yerleşik bilim, gerçek mühendislik, yorum, felsefe, inanç/kültürel anlam ve bilimkurgu `scene.json#epistemic_layers` alanında ayrı tutulur. Beden dışında sürdürülen birbirine bağlı insan beyinleri, kuantum düşünce ağı ve yeni bilincin oluşumu HUM-0011'in olası kurgusal gerçekliğidir; doğrulanmış biyomedikal yetenek veya fizik iddiası değildir. Yaşam, benlik ve ölüm yorumları tek bir kültüre indirgenmez.

## Tamamlanma ölçütleri

- Kaynak pinleri gerçek HUM-0011 dosyalarıyla eşleşir; kaynak kayması testte yakalanır.
- Üç mevcut seçim ve etkileri korunur; her önizleme 100 toplam verir.
- Hesap onayı yetkiye dönüşmez; üç yol da yetkisiz kısıtlama ve kapatmayı reddeder.
- Bilinç, ayrı ses ve ayrılma imkânı bilinmeyenken biliniyormuş gibi kaydedilmez.
- Vazgeçme, tekrar onay ve önceki HUM-0011 seçimleri ek puan üretmez.
- İki dilde sahne ve planlar bulunur; insan incelemesi tamamlanmış gibi işaretlenmez.
- Terminal örneği, 28 HUM-0011 çekirdek/okuyucu testi ve derleme doğrulaması geçer.

## Okuyucu entegrasyonu — 23 Kasım 2026

- `flow.js` terminal ve tarayıcının paylaştığı saf karar çekirdeğidir. `flow.cjs` Node tarafında kaynak blob pinlerini doğrular.
- Derleyici kaynak dosyaları yeniden doğrular, sahneyi HUM-0011 veri paketine ekler ve aynı `flow.js` dosyasını `site/assets/hum0011-flow.v1.js` olarak kopyalar.
- `web/assets/hum0011-authority-reader.v1.js` arayüzü bağlar. Okuyucuda sandbox `confirm` çalıştırılmaz; puanı yalnız mevcut `applyChoice` bir kez yazar.
- Kaydedilmiş seçimler korunur. TR/EN dil değişiminde inceleme açık kalır; bekleyen onay sıfırlanır. Sahne dışındaki diller olağan seçim akışını kullanır.
- Modül yüklenmezse etkin sahne seçimi kaydetmez. Uygulama ve kapatma yetkisi hiçbir seçimle değişmez.
- Kaynak pinleri, derlenmiş sahne, paylaşılan dosyanın aynılığı ve script sırası derleme doğrulayıcısında kontrol edilir.
- `web/index.html` uygulama dosyasını sabit eski sürüm sorgusuyla çağırmaz; derleyicinin içerik özeti yeni kod için önbellek anahtarını üretir.
- Ana metin ve üç mevcut seçim değiştirilmedi. Görsel kompozisyon eski 3D sahneleri bozmaz; yeni biyolojik donanım veya beyin ağı üretilmez.

License: CC-BY-SA-4.0. Turkish AI-assisted draft and English AI translation; human review pending.
