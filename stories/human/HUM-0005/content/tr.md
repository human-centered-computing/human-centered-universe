# Emeğin Altıncı Duyusu

Saat 17.42'de hastanenin yazılım katında ışıklar hâlâ yanıyordu.

Dilan, bilgisayarının ekranında aynı hata mesajını on üçüncü kez okuyordu. Yeni randevu sistemi bazı hastaların kimliklerini doğrulayamıyor, hiçbir açıklama yapmadan onları başlangıç ekranına gönderiyordu.

Sorun küçük görünüyordu. Proje planında adına açılmış bir görev bile yoktu.

Yöneticinin eski personel tablosuna göre Dilan'ın o günkü çalışması şöyleydi:

**Giriş:** 08.31  
**Çıkış:** 17.48  
**Toplam süre:** 9 saat 17 dakika  
**Tamamlanan görev:** 0

Dilan'ın gerçekte yaptığıysa bu tabloda görünmüyordu.

Sabah iki saat boyunca yaşlı hastaların sistemi neden kullanamadığını gözlemlemişti. Öğleden sonra kimlik doğrulama kayıtlarını incelemiş, hatanın yalnızca eski telefonlarda ortaya çıktığını fark etmişti. Sonra sorunun koddan değil, ekran okuyucusuyla güvenlik penceresi arasındaki uyumsuzluktan kaynaklandığını bulmuştu.

Çözümü henüz tamamlanmadığı için eski sisteme göre o gün hiçbir şey üretmemişti.

Tam bilgisayarını kapatacakken ekranın sağ alt köşesinde bir bildirim belirdi:

**Potansiyel katkı tespit edildi.**

Altında bir olay numarası vardı:

**CE-2026-00883241**

Dilan bildirimi açtı.

> Eski mobil cihazlarda kimlik doğrulama hatasına ilişkin araştırma, test ve çözüm taslağı tespit edildi. Kaynaklar: hata kayıtları, test sonuçları, kod değişiklikleri ve kullanıcı gözlem notları.

Sistem üç seçenek sunuyordu:

**Onayla**  
**Reddet**  
**İnceleme iste**

Dilan şaşkınlıkla ekrana baktı.

— Bunu nereden biliyorsun?

NextProject cevap vermedi. Onun yerine kanıtları gösterdi:

Saat 10.14'te açılan hata kaydı.  
Saat 11.08'de oluşturulan test senaryosu.  
Saat 14.26'da yapılan kod değişikliği.  
Saat 16.03'te erişilebilirlik uzmanına gönderilen inceleme talebi.

Sistem Dilan'ın ne düşündüğünü bilmiyordu. Niyetini okuyamıyor, emeğinin değerine kendi başına karar veremiyordu. Yalnızca farklı uygulamalara dağılmış çalışma izlerini bir araya getiriyor ve açıklanabilir bir öneri oluşturuyordu.

Bu, ölçülemeyen ruhani bir altıncı duyu değildi.

Görünmeyeni fark eden fakat gördüğünün anlamına insan adına karar vermeyen, açıklanabilir bir algı katmanıydı.

Dilan kanıtları yeniden inceledi ve **İnceleme iste** seçeneğine dokundu.

— Bu çalışma yalnızca bana ait değil. Sorunu ilk olarak danışmadaki hemşire Zilan bildirdi. Erişilebilirlik analizini Yusuf yaptı.

Sistem önceki kaydı değiştirmedi. Yeni bir olay ekledi:

**AttributionReviewRequested**

Zaman çizelgesinde iki kayıt yan yana göründü:

**17.42 — Sistem potansiyel katkıyı tespit etti.**  
**17.49 — Katkıcı, sahiplik incelemesi istedi.**

Geçmiş silinmemişti. Yalnızca genişlemişti.

---

Ertesi sabah ekip küçük toplantı odasında toplandı.

Masada Dilan, Zilan, Yusuf, proje yöneticisi Selim ve hastanenin bilgi işlem sorumlusu oturuyordu.

Selim ekrandaki iş parçacığını açtı:

**WP-2026-000427**

> Hasta randevu sistemindeki kimlik doğrulama sürecinin eski cihazlar ve ekran okuyucular için erişilebilir hâle getirilmesi.

İş parçacığının altında katkılar ayrı ayrı görünüyordu:

- Zilan, problemi gerçek kullanıcı deneyiminden hareketle fark etmişti.
- Dilan, teknik nedeni araştırmış ve çözümü geliştirmişti.
- Yusuf, erişilebilirlik testlerini hazırlamıştı.
- Bilgi işlem ekibi, çözümün hastane sisteminde uygulanmasını sağlamıştı.

Selim ekrana bakarak sordu:

— Başarıyı kime yazacağız?

NextProject tek bir isim göstermedi. Onun yerine yeni bir soru oluşturdu:

> Bu sonucun meydana gelmesinde hangi katkılar hangi rolleri oynadı?

Eski sistemde yöneticinin bir kişiyi seçmesi gerekirdi. Yeni sistemdeyse sonucun tek bir sahibi olmak zorunda değildi.

Selim değerlendirmesini ekledi:

> Bu iş parçacığı, hastaların dijital hizmetlere erişimini doğrudan etkileyebilecek yüksek öncelikli bir iyileştirmedir.

Fakat Selim'in yorumu katkı kaydının üzerine yazılmadı. Ayrı bir olay olarak eklendi:

**ManagerAssessmentAdded**

Yönetici artık geçmişi değiştiren kişi değildi. Geçmişe kendi değerlendirmesini ekleyen tanıklardan biriydi.

Üç gün sonra çözüm tamamlandı. Dilan'ın pull request'i birleştirildi. Otomatik testler geçti. Yusuf'un erişilebilirlik raporu onaylandı. Hastane yeni sürümü yayımladı.

NextProject bütün kanıtları bir araya getirdi ve iş parçacığını katkıcıların onayına gönderdi. Dilan bu kez **Onayla** seçeneğine bastı. Kayıt onun dijital anahtarıyla imzalandı. Aynı işlemi Zilan ve Yusuf da yaptı.

Artık iki farklı doğrulama bulunuyordu:

**Sistem kanıtı + İnsan onayı**

Olayların özet değerleri kriptografik olarak hesaplandı. Belgelerin kendileri hastanenin korumalı veri alanında kaldı. Hastaların bilgileri, raporlar ve çalışma dosyaları blockchain'e yazılmadı.

Zincire yalnızca olay kimlikleri, zaman damgaları, kayıtların dijital parmak izleri ve doğrulama imzaları gönderildi.

Sistem, belgelerin içeriğini dünyaya açmadan şu cümleyi kanıtlayabiliyordu:

> Bu kayıt o tarihte vardı ve daha sonra değiştirilmedi.

Blockchain hikâyenin kahramanı değildi. Yalnızca hafızanın sessiz bekçisiydi.

---

Altı ay geçti.

Bir sabah NextProject eski iş parçacığına yeni bir olay ekledi:

**ImpactObserved**

Hastanenin ölçümlerine göre eski telefonlardan yapılan başarısız girişlerin oranı yüzde 38 azalmıştı. Ekran okuyucusu kullanan hastaların randevu tamamlama oranıysa yüzde 21 yükselmişti.

Katkı altı ay önce yapılmıştı. Etkisi şimdi ortaya çıkmıştı.

**Contribution Time ≠ Impact Time**

Eski performans sisteminde görev çoktan kapanmış ve aylık raporların arasında kaybolmuştu. NextProject ise katkıyla etkiyi birbirine karıştırmamıştı.

Önce ne yapıldığını kaydetmişti. Sonra insanlarda ne değiştiğini görmek için beklemişti.

Etki verileri bağımsız bir ekip tarafından doğrulandığında yeni bir olay daha eklendi:

**ImpactVerified**

Ancak sistem hâlâ kimseye puan vermemişti.

Selim bunun nedenini sorduğunda araştırma ekibinin cevabı açıktı:

— Katkıyı kaydetmekle ona değer biçmek aynı şey değildir.

Contribution Measurement Engine yalnızca şu soruya cevap veriyordu:

> Ne yapıldı?

Gelecekte geliştirilecek şeffaf puanlama motoruysa başka bir soruya cevap verecekti:

> Kabul edilen değerlendirme modeline göre bunun değeri nedir?

Puanlama modeli zamanla değişebilirdi. Fakat ham katkı geçmişi değişmeyecekti.

Tam da bu noktada araştırmacılar daha büyük bir sorunla karşılaştı.

Her katkı herkese açık mı olmalıydı? Bir insanın bütün çalışma geçmişi kalıcı olarak saklanmalı mıydı? Ölçülebilen her şey puanlanmalı mıydı? Bir algoritma, insan emeğinin değerini gerçekten anlayabilir miydi?

Bu soruların cevabını yalnızca mühendislerin vermesi doğru değildi.

Bu nedenle NextProject'in karar modelinde üç düşünce ekseni oluşturuldu:

**Aydınlık**  
**Karanlık**  
**İnsan**

Bunlar iyiyle kötünün temsilcileri değildi. Aynı sistemin üç farklı ihtimaliydi.

---

Toplantı salonunun ortasındaki dairesel masada Dilan, Yusuf, Zilan ve Selim oturuyordu. Karşılarındaki ekranda üç sembol belirdi.

Aydınlık, beyaz bir ışık halkasıydı.

Karanlık, ışığı içine alan siyah bir boşluktu.

İnsan ise ikisinin arasında titreşen sıcak bir noktaydı.

İlk sözü Aydınlık aldı:

— İnsan emeği yüzyıllar boyunca görünmez bırakıldı. Üretilen fikirler başkalarına mal edildi. Sessiz çalışanlar unutuldu. Gücü elinde tutanlar geçmişi istedikleri gibi yazdı. Bunların yeniden yaşanmaması için her katkı açık olmalıdır.

Ekranda bütün katkı kayıtlarının herkese açık olduğu bir gelecek belirdi. Her iş parçacığı, her kanıt, her değerlendirme ve her imza görülebiliyordu.

— Tam şeffaflık adaletin ön koşuludur. Saklanan emek korunamaz.

Karanlık cevap verdi:

— Fakat tamamen görünür olan insan özgür değildir.

Ekrandaki görüntü değişti. Çalışanların her hareketi izleniyor, yarım bıraktıkları fikirler kaydediliyor, başarısız denemeleri profillerine ekleniyor ve henüz olgunlaşmamış düşünceleri performans değerlendirmelerinde kullanılıyordu.

— Bir insanın düşünmek, hata yapmak ve başarısız olmak için görünmeyen bir alana ihtiyacı vardır. Her hareket katkı değildir. Her sessizlik verimsizlik değildir. Her başarısızlık da kalıcı bir kimliğe dönüşmemelidir.

Aydınlık itiraz etti:

— Gizlilik, emeğin yeniden gasp edilmesine neden olabilir.

— Tam görünürlük de gözetlemeyi adalet gibi gösterebilir, dedi Karanlık.

İnsan sembolü ilk kez konuştu:

— İkiniz de haklısınız. Bu nedenle ikiniz de tek başınıza sistemi yönetemezsiniz.

Masadakilerin önüne yeni bir Contribution Event getirildi. Sistem, Dilan'ın özel çalışma alanında oluşturduğu fakat henüz kimseyle paylaşmadığı bir taslağı potansiyel katkı olarak tespit etmişti.

Aydınlık kaydın hemen oluşturulmasını savundu:

— Üretim gerçekleşti. Kanıt var. Katkı kaybolmamalı.

Karanlık karşı çıktı:

— Bu yalnızca bir taslak. Dilan'ın düşünme alanına aittir. Onun izni olmadan çalışma kaydına dönüştürülemez.

İnsan, Dilan'a döndü:

— Bu çalışma olayının katkı olarak değerlendirilmesini istiyor musun?

Dilan kısa süre düşündü.

— Henüz değil. Fikir tamamlanmadı. Yanlış olabilir. Bir süre özel kalmasını istiyorum.

Sistem yeni bir durum oluşturdu:

**Private Incubation**

Çalışmanın içeriği katkı kayıtlarına eklenmedi. Yalnızca Dilan'ın kontrolündeki özel alanda saklandı. Bu alan yöneticilere ve puanlama motoruna kapatıldı.

Aydınlık kararı kabul etti fakat bir koşul ileri sürdü:

— Dilan isterse daha sonra çalışmanın geçmişte var olduğunu kanıtlayabilmeli.

Karanlık da kendi koşulunu ekledi:

— Bunu yaparken çalışmanın içeriği açığa çıkmamalı.

İnsan çözümü belirledi:

Belgenin kendisi özel alanda kalacak, yalnızca şifrelenmiş bir zaman kanıtı üretilecekti. Dilan isterse bu kanıtı daha sonra görünür hâle getirecekti.

Böylece mahremiyet ile emeğin korunması aynı anda mümkün olacaktı.

---

Ardından Yusuf'un hazırladığı erişilebilirlik raporu açıldı. Bir yapay zekâ modeli raporu yüksek değerli katkı olarak sınıflandırmıştı.

Aydınlık konuştu:

— Kanıt güçlü. Çalışmanın etkisi ölçülebilir. Sistem yüksek puan vermelidir.

Karanlık raporu inceledi:

— Model raporun uzunluğunu, kullanılan test sayısını ve etkilenen kullanıcı miktarını görüyor. Fakat Yusuf'un bir hastayla yaptığı on dakikalık konuşmanın bütün araştırmanın yönünü değiştirdiğini bilmiyor.

Yusuf başını salladı.

— Rapordaki en önemli fikir gerçekten o konuşmadan çıktı.

İnsan sembolü cevap verdi:

— Öyleyse ölçüm ile anlamı birbirinden ayırmalıyız.

Sistem raporu katkı olarak tanımlayabilir, kanıtlarının gücünü gösterebilir ve insan etkisini zaman içinde izleyebilirdi. Ancak katkının nihai değerini tek başına belirleyemezdi.

Ekranda yeni bir ilke belirdi:

> Algoritma katkıyı açıklayabilir; insanın değerini belirleyemez.

Aydınlık sordu:

— Peki puanlama ne olacak?

— Puanlama yapılabilir, dedi İnsan. Fakat her puanın yanında neden verildiği, hangi verilerin kullanıldığı ve algoritmanın hangi sürümüyle hesaplandığı gösterilecek. İnsanlar karara itiraz edebilecek. Hiçbir işe alma, işten çıkarma, ücret veya terfi kararı yalnızca otomatik puana dayandırılmayacak.

Karanlık sordu:

— Puanlama modelini kim değiştirecek?

— Bu sistemden etkilenen insanlar. Çalışanlar, yöneticiler, araştırmacılar ve hizmet alan kişiler birlikte karar verecek. Değerlendirme modelindeki her değişiklik yeni bir sürüm olarak yayımlanacak. Eski katkı kayıtları değişmeyecek; yalnızca farklı modeller altında yeniden yorumlanabilecek.

---

Son tartışma hastanenin kimlik doğrulama çalışması üzerineydi.

Sistemin ilk hesaplaması başarının yüzde 55'ini Dilan'a, yüzde 25'ini Yusuf'a, yüzde 15'ini bilgi işlem ekibine ve yüzde 5'ini Zilan'a vermişti.

Zilan yüzdelere baktı.

— Problemi ben fark etmeseydim bu çalışma hiç başlamayacaktı.

Aydınlık cevap verdi:

— Sistem ölçülebilen üretim miktarına göre hesaplama yaptı.

Karanlık itiraz etti:

— Tam da bu nedenle ölçülebilen şey, gerçeğin tamamı değildir.

Dilan kendi payına baktı.

— Benim yüzde 55 almam doğru değil. Zilan'ın problemi tanımlaması, benim yazdığım kod kadar önemliydi.

İnsan sembolü yüzdeleri ekrandan kaldırdı.

— Katkıyı tek bir pastayı bölüştürür gibi değerlendirmek zorunda değiliz. Bir insanın katkısı görünür olduğunda diğerinin katkısının küçülmesi gerekmez.

Yeni görünümde yüzdeler yerine bir katkı ağı oluşturuldu:

- Zilan: Problemi fark etme ve tanımlama
- Dilan: Teknik araştırma ve yazılım geliştirme
- Yusuf: Erişilebilirlik analizi ve doğrulama
- Bilgi işlem ekibi: Uygulama ve sürdürülebilirlik
- Hastalar: Deneyim ve geri bildirim
- Kurum: Kaynak ve operasyon desteği

Ortada ortak sonuç bulunuyordu:

**Dijital sağlık hizmetine erişimin iyileştirilmesi**

Sistem artık “Başarı kimin?” diye sormuyordu.

> Bu sonucun gerçekleşmesi için hangi katkılar birbirine ihtiyaç duydu?

---

Toplantının sonunda üç sembol yeniden yan yana geldi.

Aydınlık konuştu:

— Ben olmadan emek görünmez kalır.

Karanlık konuştu:

— Ben olmadan insanın özel alanı yok olur.

İnsan konuştu:

— Ben olmadan görünürlük gözetlemeye, mahremiyet ise unutulmaya dönüşebilir.

NextProject bu üç düşünceden yalnızca birini seçmedi.

Aydınlık, kanıtların ve karar süreçlerinin açıklanabilir olmasını sağlayacaktı. Karanlık, kişisel verileri, gelişmekte olan fikirleri ve insanın hata yapma alanını koruyacaktı. İnsan ise hangi bilginin ne zaman, kimle ve hangi amaçla kullanılacağına karar verecekti.

Taslaklar, kişi yayınlayana kadar **Özel Kuluçka Alanı** içinde kalacaktı. Katkılar; özel, ekip içi, kurum içi veya herkese açık olarak sınıflandırılabilecekti. Bir sistem tespiti kesin hüküm sayılmayacaktı. İnsanlar katkıyı onaylayabilecek, reddedebilecek, açıklama ekleyebilecek veya bağımsız inceleme isteyebilecekti.

Başarısız deneyler, hangi yöntemin çalışmadığını kanıtlıyorsa bilimsel katkı olarak kaydedilebilecekti. Bir sonucun sahipliği yalnızca yüzdelere bölünmeyecek; katkılar arasındaki ilişkiler bir ağ olarak gösterilecekti. İnsan etkisi, çalışmadan etkilenen kişiler tarafından da doğrulanabilecekti.

Hiçbir otomatik sistem insan hakkında tek başına nihai karar veremeyecekti.

---

Bir yıl sonra hastanenin duvarındaki personel takip ekranları kaldırıldı.

Artık kimse yalnızca binaya giriş ve çıkış saatleriyle tanımlanmıyordu.

İnsanların profillerinde kaç saat masada oturdukları değil; hangi problemleri çözdükleri, ne ürettikleri, kimlerle birlikte çalıştıkları, üretimlerinin insanlarda nasıl bir karşılık bulduğu ve bu süreçte nasıl geliştikleri görünüyordu.

NextProject insanları gözetleyen kusursuz bir göz değildi. Bir hakem de değildi.

Dağınık emek izlerini algılayan, kanıtları bir araya getiren ve karar vermeden önce insana soran açıklanabilir bir altıncı duyuydu.

Aydınlık görünmeyen emeği ortaya çıkarıyordu.

Karanlık insanın mahremiyetini ve özgür düşünme alanını koruyordu.

İnsan ise bu iki kuvvet arasında anlamı, sınırı ve amacı belirliyordu.

Yapay zekâ gözlemliyor, ilişkilendiriyor ve seçenekleri açıklıyordu. Fakat hüküm vermiyordu.

Son karar her zaman insanda kalıyordu.

Dilan o akşam binadan saat 16.12'de çıktı.

Eski ölçülere göre erken ayrılmıştı.

Fakat o gün başka bir hastanenin de kullanabileceği erişilebilirlik kılavuzunu tamamlamış, iki genç geliştiriciye mentorluk yapmış ve aylardır çözülemeyen bir veri güvenliği probleminin nedenini ortaya çıkarmıştı.

Kapıdan geçerken ekranda artık çalışma süresi görünmüyordu.

Yalnızca dört cümle vardı:

**Measure contribution, not presence.**

**Emeği aydınlığa çıkar.**

**İnsanın mahremiyetini koru.**

**Kararı insana bırak.**
