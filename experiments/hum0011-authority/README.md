# HUM-0011 — Kanıtı gördüm. Yetkiyi kim verdi?

## Tek haftalık teslimat

HUM-0011'in VII. bölümündeki yetki çatışmasını terminalde oynanabilir, testli bir karar çekirdeğine dönüştürür. Yeni hikâye veya yeni merkez eklemez. HUM-0009'un belge açma akışını tekrarlamaz: burada oyuncu hesap doğrulaması, insan etkisi ve uygulama yetkisinin farklı durumlar olduğunu görür.

Durum: deneysel yerel prototip. Canlı okuyucuya bağlanmamıştır; `site/` veya gerçek gözlemci kaydı değiştirilmez. Bu paket bir yapay zekâ denetleyicisi, güvenlik sınırı veya gerçek hukuki yetki sistemi değildir.

## Kontrol edilen güncel durum — 22 Kasım 2026

- Ana dal: `023765ac988fe3ecefa5c2e39044cd8ab4cecaf7`.
- HUM-0009 itiraz akışı PR #58 ile tamamlandı; HUM-0010 TR/EN PR #60 ile yayımlandı.
- HUM-0011 TR/EN, üç görsel ve TR/EN ses dosyaları mevcut. Dosyanın varlığı ses kalitesinin veya erişilebilirliğinin doğrulanması değildir.
- Son okuyucu dağıtımı: https://github.com/human-centered-computing/human-centered-universe/actions/runs/44795439649 — success.
- Kaynak metin ve meta blob kimlikleri `scene.json` içinde sabitlenmiştir. Değiştiklerinde test durur; yeni sürüm kanon açısından yeniden incelenmeden pinler güncellenmez.

## Çalıştırma

Depo kökünden, harici bağımlılık kurmadan:

```sh
node --test experiments/hum0011-authority/test.cjs
node experiments/hum0011-authority/play.cjs
node experiments/hum0011-authority/play.cjs light_accountable_collective
node experiments/hum0011-authority/play.cjs light_accountable_collective --confirm
```

Üçüncü komut önizlemeyi, son komut ise yalnız bellekte tutulan onayı da gösterir. Kalıcı oyuncu kaydı yazmaz. `flow.cjs` mevcut `observer-engine.v2.js` motorunu kullanır; normalizasyon yeniden yazılmaz.

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
- Gelecek UI bütün bilgiyi metinle sunmalı; renk, ses, WebGL ve hareket zorunlu olmamalıdır. Bu paket bu görsel/erişilebilirlik kontrollerini henüz gerçekleştirmez.

## Bilgi katmanları

Yerleşik bilim, gerçek mühendislik, yorum, felsefe, inanç/kültürel anlam ve bilimkurgu `scene.json#epistemic_layers` alanında ayrı tutulur. Beden dışında sürdürülen birbirine bağlı insan beyinleri, kuantum düşünce ağı ve yeni bilincin oluşumu HUM-0011'in olası kurgusal gerçekliğidir; doğrulanmış biyomedikal yetenek veya fizik iddiası değildir. Yaşam, benlik ve ölüm yorumları tek bir kültüre indirgenmez.

## Tamamlanma ölçütleri

- Kaynak pinleri gerçek HUM-0011 dosyalarıyla eşleşir; kaynak kayması testte yakalanır.
- Üç mevcut seçim ve etkileri korunur; her önizleme 100 toplam verir.
- Hesap onayı yetkiye dönüşmez; üç yol da yetkisiz kısıtlama ve kapatmayı reddeder.
- Bilinç, ayrı ses ve ayrılma imkânı bilinmeyenken biliniyormuş gibi kaydedilmez.
- Vazgeçme, tekrar onay ve önceki HUM-0011 seçimleri ek puan üretmez.
- İki dilde sahne ve planlar bulunur; insan incelemesi tamamlanmış gibi işaretlenmez.
- Terminal örneği ve tüm testler geçer. Canlı okuyucu entegrasyonu bu teslimata dahil değildir.

## Okuyucuya ileride bağlanırken

Bu çekirdek henüz web'e uygun bir modül değildir; Node `crypto` kaynak doğrulaması kullanır. İleride adaptör hazırlanırsa sandbox `confirm` sonucu ile okuyucunun `applyChoice` işlemi birlikte uygulanmamalıdır. Gerçek kayda yalnız mevcut okuyucu bir kez yazmalı; model/öykü yetki durumları oyuncu puanlarından bağımsız kalmalıdır.

License: CC-BY-SA-4.0. Turkish AI-assisted draft and English AI translation; human review pending.
