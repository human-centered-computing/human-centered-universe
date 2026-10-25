# İtirazı açıyorum — HUM-0009 deneysel etkileşim çekirdeği

Tek haftalık kapsam: “Kurucunun kaydı” bölümünü, okurun kendi adına gelen itirazı incelediği küçük bir oynanabilir denemeye dönüştürmek.

## Güncel durum ve tekrar edilmeyen iş

25 Ekim 2026 depo incelemesi: temel alınan main commit `bc18a8ae3895a743cce025dfb046c71087f1146e`.
HUM-0009, tarih içermeyen birinci şahıs anlatımı ve farklı inançların ego/arınma anlayışlarını merkezine alan 4. sürümdedir.
Türkçe ve İngilizce metin ile ses kontrol noktaları ana dalda bulunur. Son Validate Universe ve Deploy Interactive Reader işleri başarılıdır.
20 Ekim'deki son değişiklikler, hikâyelerle yazılım projelerinin bağlantıları ve okuyucu dillerindeki etiketlerdir.

Bu paket hikâyeyi, inanç karşılaşmalarını veya çevirilerini yeniden yazmaz. Yeni bir kanon düğümü eklemez.
Mevcut üç seçimi okuyucudan ayrı, geçici bir deneme oturumunda sınar.

## Çalıştırma

Depo kökünden, Node.js ile; ek paket gerekmez:

```sh
node experiments/hum0009-objection/play.cjs
node experiments/hum0009-objection/play.cjs --en
node experiments/hum0009-objection/play.cjs --demo
node --test experiments/hum0009-objection/test.cjs
```

`1` ve `2`: belgeleri aç. `a/b/c`: yaklaşımı önizle. `y`: onayla. `r`: önizlemeden geri dön. `q`: çık.
Belgeyi açmış olmak, içeriğin okunduğunu veya anlaşıldığını kanıtlamaz; bu yalnızca akış koşuludur.

## Etkileşim

1. “Kalbim hızlanıyor: emeğim mi sorgulanıyor, iyi biri olduğuma dair inancım mı?” iç sesiyle başlarım.
2. Kendi iddiamı ve Dilan'ın toplantı notunu ayrı ayrı açarım.
3. Mevcut üç hikâye yaklaşımından birini önizlerim. Başka seçeneğe geçebilir veya geri dönebilirim; puan eklenmez.
4. Önizlediğim yaklaşımı onaylarım. Seçimin etkisi bir kez eklenir.
5. “İtirazın sonucu henüz karara bağlanmadı. Kendimi arınmış ilan etmiyorum.” cümlesini görürüm.

Bu sahne inceleme kararı veya hak sahipliği hükmü üretmez.
Dilan'ın notu itirazını destekleyen kurgusal bir belgedir; blokzincir, imza veya hash doğrulaması yapılmaz.
Üç yaklaşımın hiçbiri “doğru din”, “daha temiz ruh” veya “egosuzluk” ödülü değildir.

## Veri ve mevcut okuyucuya uyum

- `scene.json`: TR/EN iç ses ve iki belge; altı bilgi katmanı; mekânsal çekim belgesi.
- `flow.cjs`: saf durum geçişleri. Gerçek yolculuk nesnesini değiştirmez.
- `play.cjs`: terminalde oynanabilir prototip ve otomatik gösterim.
- `test.cjs`: önizleme, geri dönüş, tekrar onay, önceki seçim ve toplam 100 kontrolleri.
- Seçim anahtarları, çevirileri ve etkileri `stories/human/HUM-0009/meta.json` dosyasından alınır.
- Normalize etme kopyalanmaz; `web/assets/observer-engine.v2.js` kullanılır.
- Kaynak hikâye sürümü değişmişse akış durur; editör yeni metinle sahneyi yeniden karşılaştırmalıdır.
- Başlangıç 34/33/33'tür; çağıran uygulama mevcut ham profili ve seçim günlüğünü verebilir.
- Aynı HUM-0009 seçimi günlükte varsa yeni etki verilmez.
- Tarayıcı depolamasına, gerçek katkı ağına veya cüzdana yazılmaz; kişisel veri toplanmaz.

Bu paket canlı okuyucuya bağlanmış değildir. Pages derlemesi experiments dizinini yayınlamaz.
Bir okuyucu entegrasyonu yapılırsa bu denemeyi mevcut üç seçimin **yerine** bağlamak gerekir.
Ayrı bir ikinci HUM-0009 seçimi olarak eklenmemelidir. Sandbox çıktısı doğrudan gerçek yolculuğa aktarılamaz;
mevcut okuyucunun tek seçim/onay yolu kullanılmalıdır.

## Mekânsal sahne

Mevcut yazısız katkı ağı görselini ve FIRST VIBRATION'ın on iki sütun düzenini yeniden kullan.
Yeni bir 3D varlık üretmek bu adımın kapsamı değildir. `scene.json.spatial_brief` üç çekimi tanımlar.
İnançları sütunlara veya HUMAN/LIGHT/DARK merkezlerine dağıtma.
Klavye ile açılabilen metin belgeleri, hareket azaltma ve WebGL yokluğunda kararların tamamı korunmalıdır.
Bu paket bir WebGL sahnesi gerçekleştirmez; mekânsal belgeyi ve karar çekirdeğini sağlar.

## Bilgi katmanları

Anlatı içinde etiketler akışı kesmez; `epistemic_layers` köken ayrımını tutar:
yerleşik bilim, gerçek mühendislik, yorum, felsefe, inanç/kültürel anlam ve bilim kurgu.
Kuantum-AI, FIRST VIBRATION ve zamanların iç içe geçmesi kurgu katmanıdır.
Egonun kalıcı yok oluşu veya kuantum bilincin doğrulandığı iddia edilmez.
İnançlar farklı benlik anlayışlarıyla kalır; hiçbir kişi bütün geleneğinin ya da tüm dinlerin temsilcisi sayılmaz.

## Tamamlanma ölçütleri ve sınır

- [x] TR/EN içerik ve mevcut üç seçimi kullanan çalıştırılabilir deneme.
- [x] İki belge açılmadan seçim önizlenemiyor.
- [x] Önizleme, seçenek değiştirme ve geri dönüş profile etki eklemiyor.
- [x] Uyumlu onay bir etki ekliyor; tekrar onay ve eski seçim ikinci kez sayılmıyor.
- [x] HUMAN + LIGHT + DARK her sonuçta 100.
- [x] Altı bilgi katmanı, kültürel çoğulluk ve birinci şahıs anlatımı korunuyor.
- [x] Otomatik kontroller ve Türkçe/İngilizce gösterim çalışıyor.

Görsel arayüz, ekran okuyucu ve gerçek 3D render bu terminal prototipiyle doğrulanmış sayılmaz.
Canlı okuyucunun mevcut davranışı ve kullanıcı yolculukları bu paketten etkilenmez.
