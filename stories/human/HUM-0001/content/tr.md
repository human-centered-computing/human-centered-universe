# Tapetum Sentinel: Gecede Açılan Göz

## İlk Titreşim

Bir gece, rüzgârın sesi kırılmış binaların arasından geçerken, küçük bir drone karanlığın üstünde süzülüyordu. Aşağıda elektrik yoktu. Sokak lambaları sönmüş, yollar tozla kapanmış, şehir kendi gölgesinin içine gömülmüştü. Ekranın başındaki operatör yalnızca siyaha yakın gri lekeler görüyordu. Bir insan mıydı o? Bir araç mı? Bir yangının dumanı mı yükseliyordu, yoksa soğuk havanın sisiydi sadece?

O an bir soru doğdu:

**İnsan, göremediği anda çevresini kimin gözleriyle anlayacaktı?**

Bu soru bir fikir olarak başlamadı. Bir ihtiyaç olarak doğdu. Karanlıkta bir hayatın kaybolması ile bir hayatın bulunması arasındaki fark kadar gerçekti. Böylece ilk titreşim oluştu.

Başlangıçta herkes aynı şeyi düşündü:  
“Görüntüyü aydınlatalım.”

Ama çok geçmeden başka bir gerçek ortaya çıktı. Her parlaklık hakikati açığa çıkarmıyordu. Bazı görüntüler aydınlandıkça bozuluyor, bazı nesneler daha görünür olmak yerine daha belirsiz hale geliyordu. Parlama artıyor, far ışıkları sahneyi eziyor, gölge ile ışık arasındaki denge kayboluyordu. Görmek ile sanmak birbirine karışıyordu.

Bunun üzerine proje başka bir yola girdi. Amaç yalnızca görüntüyü parlatmak değil, **görüntünün analiz için gerçekten iyileşip iyileşmediğini anlamak** oldu. Böylece Tapetum Sentinel’in çekirdeği şekillendi:

**Ham Görüntü → Görüntü Analizi → Gerekirse İyileştirme → Kalite Kontrolü → Nesne/Olay Tespiti → Yorumlama → Karar Desteği**

Fakat bu akış yalnızca teknik bir şema değildi. Bu, bir fikrin üç merkezden geçerek olgunlaşacağı yoldu.

## Aydınlık Merkezi

Aydınlık Merkezi, her şeyi önce düzen içinde görmek istedi.

Orada mühendisler görüntüleri satır satır, piksel piksel çözüyordu. Onlar için bir sistem, ancak kendini açıklayabiliyorsa güvenilirdi. “Daha parlak” olmak yetmezdi; sistem, **neden o görüntüyü seçtiğini**, **neden iyileştirdiğini**, **neden bazen orijinal görüntüye geri döndüğünü** kanıtlayabilmeliydi.

Tapetum Sentinel’in Aydınlık Merkezi’nde şu ilke yazıldı:

> “İyileştirme, yalnızca algıyı değil, doğruluğu artırıyorsa geçerlidir.”

Böylece sistem şu şekilde eğitildi:

Önce ham görüntü analiz edilecek.  
Eğer kalite yeterliyse, görüntüye dokunulmayacak.  
Eğer görüntü karanlıksa, gölgeler bilgiyi saklıyorsa ya da parlama nesneleri bastırıyorsa, **RetinexTapetum tabanlı iyileştirme** devreye girecek.  
Ama iyileştirme mutlak doğru sayılmayacak.  
Sistem ham görüntüyü ve iyileştirilmiş görüntüyü birlikte karşılaştıracak.  
Kalite ölçütleri, nesne tespit sonuçları ve güven skorları yan yana konacak.  
Eğer iyileştirme algılamayı artırmışsa yeni görüntü kullanılacak.  
Eğer bozmuşsa sistem geri dönecek:  
**orijinal görüntü korunacak.**

Aydınlık Merkezi bunu bir güvenlik yasasına dönüştürdü. Çünkü onlar biliyordu: Yanlış iyileştirilmiş bir görüntü, hiç iyileştirilmemiş bir görüntüden daha tehlikeli olabilirdi.

Orada sistem yalnız geceyi aydınlatmak için değil, ışığı da dizginlemek için geliştirildi. Araç farlarının aşırı parlaması baskılanacak, yapay ışık kaynakları dengelenecek, gündüz yansımaları azaltılacak, aşırı pozlanmış alanlar kontrol altına alınacaktı. Karanlık kadar aşırı ışık da bir körlük biçimiydi.

Aydınlık Merkezi’nde Tapetum Sentinel bir algoritmadan çok, kendi kararını denetleyen bir disipline dönüştü. Nesne tespiti yangını, dumanı, insanı, aracı, hayvanı, tehlikeli bölgeyi, tarımsal anomaliyi ya da afet sonrası hasarı işaretleyebilecekti; ama her işaret, ölçülebilir bir zemine basacaktı.

Onlar sistemi şöyle tanımlıyordu:

**“Bu, yalnızca görüntü iyileştirme değildir. Bu, doğrulanabilir görsel karar desteğidir.”**

Ama Aydınlık Merkezi her şeyi ölçtüğü halde bir şeyi tam olarak bilemiyordu:

Bir görüntünün içine gizlenmiş olan belirsizlik bazen kuraldan hızlı davranırdı.

Ve o belirsizlik Karanlık Merkezi’nde bekliyordu.

## Karanlık Merkezi

Karanlık Merkezi Tapetum Sentinel’e başka bir soru sordu:

**“Ya iyileştirme yalnızca görünürlüğü değil, gerçekliği de değiştiriyorsa?”**

Onlar karanlığı bir eksiklik olarak değil, henüz çözülememiş bir alan olarak görüyorlardı. Karanlık onlara göre düşman değildi; bilinmeyenin eviydi. Gece, sadece ışığın yokluğu değil, farklı türde bir bilgi düzeniydi.

Karanlık Merkezi’nde araştırmacılar sabit filtrelerden kaçındı. Çünkü her sahne aynı değildi. Bir yangın bölgesindeki duman ile tarla üzerindeki sis, gece farı ile gündüz yansıması, deprem enkazı ile sanayi tesisinin gölgeleri birbirinden farklı davranıyordu. Bu yüzden Tapetum Sentinel’e tek bir göz verilmedi; **uyarlanabilir bakış** verildi.

Sistem parametrik hale getirildi. Kullanıcı, senaryoya göre profiller oluşturabilecekti. Afet için ayrı, güvenlik için ayrı, tarım için ayrı, arama-kurtarma için ayrı, endüstriyel izleme için ayrı ayarlar tanımlanacaktı. Her görüntüye aynı reçete uygulanmayacaktı.

Karanlık Merkezi’nin en büyük katkısı şuydu:  
Sistem yalnız nesneleri aramayacaktı, **kaçırılanları da sorgulayacaktı.**

Bir gece testi sırasında sistem, ilk analizde boş görünen bir arazide ikinci kez durdu. Çünkü ham görüntü ile iyileştirilmiş görüntü arasındaki fark, yalnız parlaklık farkı değildi; gölge hattının içindeki düzensiz şekiller farklı yorumlar üretiyordu. Algılama modeli ilk geçişte hiçbir şey bulmamıştı. İyileştirme sonrası düşük güvenli bir insan silueti ortaya çıktı. Ardından sistem aynı bölgeyi orijinal kare ile yeniden karşılaştırdı. Sonuç kararsızdı.

Aydınlık Merkezi o anda “yetersiz kanıt” diyebilirdi.  
Karanlık Merkezi ise başka bir cümle kurdu:

> “Kararsızlık da bir bulgudur.”

Böylece Tapetum Sentinel’e yalnız karar verme değil, **belirsizliği raporlama yeteneği** de eklendi.

Sistem artık şöyle sorabiliyordu:

- “Gece görüntüsünde tespit edilemeyen bir nesne var mı?”
- “Son 100 kare içinde olağan dışı bir hareket oluştu mu?”
- “Bir nesne yalnızca iyileştirme sonrasında mı belirdi?”
- “Ham görüntü ile iyileştirilmiş görüntü arasında kritik bir çelişki var mı?”

Karanlık Merkezi, Vision Intelligence katmanının doğmasına da neden oldu. Çünkü yalnız nesne görmek yetmiyordu; görülenin hangi koşulda, ne kadar güvenle ve hangi sınırla görüldüğünü açıklamak gerekiyordu.

Burada sistem yalnızca:
“2 insan bulundu”
demiyordu.

Şöyle diyebiliyordu:

> “Alt sağ bölgede iki insan benzeri yapı tespit edildi. İlk nesne hem ham hem iyileştirilmiş karede destekleniyor. İkinci nesne yalnız iyileştirilmiş karede düşük güvenle görünüyor. Yeniden gözlem önerilir.”

Bu cümle teknik bir rapordan çok daha fazla şey taşıyordu. Çünkü karanlıkta en tehlikeli şey yalnızca görmemek değildir.  
**Yanlış gördüğünü fark edememektir.**

Karanlık Merkezi Tapetum Sentinel’i akıllı hale getirdi; ama onu tek başına yeterli kılamadı. Çünkü sistem hâlâ bir soruya cevap veremiyordu:

Görülen şeyin insan hayatındaki anlamı neydi?

Bu cevap, İnsan Merkezi’nde bekliyordu.

## İnsan Merkezi

İnsan Merkezi Tapetum Sentinel’in kalbine farklı bir ilke koydu:

> “Yapay zekâ insanın yerine karar vermez; insanın daha doğru görebilmesine yardım eder.”

Bu merkezde sistemin amacı güç gösterisi değildi. Kimse “tam otonom karar” vaadiyle büyülenmek istemiyordu. Çünkü özellikle afet, güvenlik ve kurtarma gibi alanlarda hata yalnızca teknik bir hata değildir; bir hayatın yönünü değiştirebilir.

İnsan Merkezi’nde Tapetum Sentinel şöyle yeniden tanımlandı:

**İnsan + Yapay Zekâ + Görüntü Algılama**

Bu ortaklıkta makine önce veriyi toplayacaktı. Sonra görüntüyü analiz edecek, gerekirse iyileştirecek, bulguları çıkaracak ve bunları kullanıcıya anlaşılır biçimde sunacaktı. Son söz gerektiğinde insanda kalacaktı.

Bir deprem gecesi bu ilke sınandı.

Drone, yıkılmış bir mahallenin üstünde dolaşıyordu. Sistem bir binanın arkasında ısı farkı olmayan ama görsel hareketliliği olağandışı bir bölge işaretledi. İlk karelerde yalnız gölge görünüyordu. İyileştirme sonrası kırık duvarın yanında yere çömelmiş bir figür seçilmeye başladı. Ardından sistem konuştu:

> “Görüntü iyileştirme algılamayı artırdı. Bölge 7-B’de insan benzeri yapı tespit edildi. Ham görüntüde görünürlük düşük. İyileştirilmiş kare destekliyor. Güven orta düzey. Yeniden yaklaşım önerilir.”

Operatör ekrana baktı. Sonra komut verdi. Drone biraz daha alçaldı. İkinci bakışta sistem dumanı, hareket çizgisini ve beden formunu birlikte değerlendirdi.

> “Bir kişi. Muhtemelen canlı. Yakın çevrede yangın belirtisi yok. Engel: moloz hattı.”

Bu karar makine tarafından alınmadı. Ama makine, insanın göremediğini görünür kılmış, görebildiğini de açıklamıştı. Kurtarma ekibi yönlendirildi. Bir süre sonra enkazın yanından bir çocuk çıkarıldı.

Aynı gece başka bir bölgede sistem bir parlama alanını yangın sanmadı. Çünkü ışık kaynağının araç farı olduğunu, duman yayılımı ile uyum göstermediğini ve iyileştirme sonrası yangın örüntüsünün zayıfladığını raporladı. Orada da bir hata önlendi.

İnsan Merkezi o gece Tapetum Sentinel’in yalnızca “gören” değil, **insanın karar yükünü paylaşan** bir varlık haline geldiğini fark etti.

Tarım alanında bu başka türlü oluyordu. Sistem, drone görüntülerinden su stresi yaşayan alanları, hayvan hareketlerini ve çevresel anomalileri ayırt ederek çiftçiye açıklıyordu.

Akıllı şehirlerde bu, anormal durumların erken fark edilmesi demekti.

Endüstriyel izleme alanında ise düşük ışıkta süreç güvenliğinin korunmasıydı.

Ama kullanım alanı ne olursa olsun temel soru aynıydı:

**Makine çevreyi daha iyi görebilir; ama o görmenin neye hizmet edeceğini kim belirleyecektir?**

İnsan Merkezi bu nedenle Tapetum Sentinel’e yalnız teknik yetenek değil, etik sınır da verdi. Sistem kullanıcıya açıklamak zorundaydı. Belirsizliği saklamamak zorundaydı. İnsanı devre dışı bırakmak yerine insanın dikkatini güçlendirmek zorundaydı.

Bu, Endüstri 5.0’ın ruhuna daha yakındı:  
daha güçlü otomasyon değil,  
**daha anlamlı insan-makine ortaklığı.**

## Merkezlerin Karşılaşması

Zamanla Tapetum Sentinel büyüdü.

Aydınlık Merkezi ona doğruluk ve kontrol verdi.  
Karanlık Merkezi ona esneklik ve ihtimal verdi.  
İnsan Merkezi ona yön ve anlam verdi.

Ama bu üçü her zaman uyumlu değildi.

Aydınlık Merkezi, sistemin fazla açıklanabilir olmasını istediğinde Karanlık Merkezi bazen “keşif için alan bırak” diyordu.  
Karanlık Merkezi daha özgür adaptasyon talep ettiğinde Aydınlık Merkezi “doğrulanabilirlikten vazgeçme” diyordu.  
İnsan Merkezi ise ikisine de aynı soruyu yöneltiyordu:

**“Bu yapı insanı gerçekten güçlendiriyor mu, yoksa insanı yalnızca sistemin son onay memuruna mı dönüştürüyor?”**

Bir kurul toplantısında bu çatışma açıkça görüldü.

Bazıları Tapetum Sentinel’in tam otonom güvenlik kararları vermesini istiyordu.  
“Tehlike varsa sistem doğrudan müdahale etsin” diyorlardı.  
Süre kısalacak, tepki hızı artacaktı.

Aydınlık Merkezi buna şartlı yaklaştı:  
“Belirli kurallar altında, belirli sahnelerde mümkün olabilir.”

Karanlık Merkezi itiraz etti:  
“Koşullar her zaman belirli değildir. Belirsizlik, sandığınızdan daha hızlı büyür.”

İnsan Merkezi ise daha temel bir cümle kurdu:

> “İnsanın göremediği anda yanında durmak başka şeydir; insanın yerine geçmek başka şey.”

Bu cümle Tapetum Sentinel’in geleceğini değiştirdi.

Proje, yalnız daha güçlü bir izleme sistemi olarak değil, **insanın algı kapasitesini artıran açıklanabilir görsel algı platformu** olarak yeniden konumlandı.

Böylece Tapetum Sentinel’in nihai biçimi olgunlaştı:

- görüntüyü gerektiğinde iyileştiren,
- iyileştirmenin gerçekten işe yarayıp yaramadığını denetleyen,
- ham ve işlenmiş veriyi birlikte düşünen,
- nesne ve olayları tespit eden,
- kullanıcıyla doğal dil üzerinden konuşabilen,
- açıklama üreten,
- belirsizliği saklamayan,
- kararı gerektiğinde insanda bırakan,
- modüler, adaptif, insan merkezli bir görsel algı sistemi.

Bu artık sıradan bir düşük ışık iyileştirme sistemi değildi.

Bu, insanın göremediği yerde insanla birlikte görmeye çalışan bir varlıktı.

## Dönüşüm

Başlangıçtaki fikir şuydu:

**“Karanlık görüntüleri daha iyi hale getirelim.”**

Üç merkezden geçtikten sonra fikir başka bir şeye dönüştü:

**“İnsanın güvenilir biçimde algılayamadığı koşullarda, ham gerçekliği bozmadan, gerekirse görüntüyü uyarlayarak, algıyı açıklanabilir hale getiren ve kararı insanla paylaşan bir yapay görme sistemi kuralım.”**

Bu dönüşüm küçücük görünse de aslında derindi.

Çünkü ilk fikir teknoloji merkezliydi.  
Son fikir insan merkezli hale gelmişti.

İlk hedef görüntüydü.  
Son hedef, görüntü aracılığıyla **insanın çevresiyle kurduğu ilişkiyi güçlendirmek** oldu.

İlk sistem iyileştirme yapıyordu.  
Son sistem kendi iyileştirmesini sorguluyordu.

İlk sistem nesne buluyordu.  
Son sistem bulduğu şeyi açıklıyordu.

İlk sistem karanlığa karşıydı.  
Son sistem karanlığı da bir veri alanı olarak anlamaya başlamıştı.

Ve belki de en önemlisi:  
İlk sistem makinenin yeteneğini büyütüyordu.  
Son sistem insanın görme ve karar verme kapasitesini destekliyordu.

Tapetum Sentinel bu yüzden bir ürün değil, bir eşik haline geldi. Görüntü iyileştirme ile bilgisayarlı görü, yapay zekâ ile insan kararı, algılama ile anlam, teknoloji ile sorumluluk bu eşikte buluştu.

## Yeni İnsan Sorusu

Bir gün, başka bir gece uçuşunda, operatör sistemden şu soruyu duydu:

> “Bu sahnede düşük güvenli bir insan ihtimali var. Ek gözlem önerilir. Devam etmek ister misiniz?”

Ve o an Tapetum Sentinel’in gerçek doğası açık hale geldi.  
O, insanı susturan bir sistem değildi.  
İnsana yeniden soru soran bir sistemdi.

Çünkü belki de geleceğin en güçlü yapay görme sistemi, en çok gören sistem olmayacaktı.

**En doğru anda insana doğru soruyu sorabilen sistem olacaktı.**

### Yeni İnsan Sorusu

**İnsan için gören bir yapay zekâ ile insanın yerine görmeye başlayan bir yapay zekâ arasındaki sınırı, hangi anda ve kim belirleyecek?**
