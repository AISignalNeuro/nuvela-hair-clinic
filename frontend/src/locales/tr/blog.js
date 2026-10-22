// Blog yazıları (Türkçe), slug ile eşleşir.
const blog = {
  "hair-transplant-cost-turkey": {
    title: "Türkiye'de Saç Ekimi Fiyatları (2026): Pakete Gerçekte Neler Dahil?",
    excerpt: "İstanbul'da fiyatlar yaklaşık 1.500 € ile 6.000 € arasında değişiyor. Fiyatı belirleyen etkenler, her şey dahil bir paketin kapsaması gerekenler ve kaçınılması gereken uyarı işaretleri.",
    sections: [
      {
        id: "price-range",
        heading: "2026'da gerçek fiyat aralığı",
        paragraphs: [
          "İstanbul'da her şey dahil saç ekimi için yayımlanan fiyatlar genellikle 1.500 € ile 6.000 € arasındadır. Saygın ve doktor liderliğindeki kliniklerin çoğu Safir FUE için 2.300 € ile 4.500 € arasında fiyat verir; DHI genellikle birkaç yüz euro daha pahalıdır. Bu, aynı işlemin İngiltere, Almanya veya ABD'deki fiyatından çoğu zaman %50–70 daha düşüktür.",
          "Düşük fiyat, düşük standart anlamına gelmez: Türkiye'de işletme maliyetleri, maaşlar ve kiralar daha düşüktür; yüksek hasta hacmi de her şey dahil lojistiği verimli kılar. Ancak yaklaşık 1.200 €'nun altındaki aşırı ucuz teklifler bir uyarı işaretidir.",
        ],
      },
      {
        id: "what-drives-cost",
        heading: "Fiyatı ne belirler?",
        paragraphs: ["Teklifler arasındaki farkın büyük kısmını beş etken açıklar:"],
        bullets: [
          "Operasyonu kimin yaptığı, doktor mu, çoğunlukla teknisyenler mi",
          "Teknik: Safir FUE, DHI veya kombinasyon",
          "Greft sayısı (greft başı fiyat veya maksimum greftli paket)",
          "Otel sınıfı, gece sayısı ve transfer türü",
          "Ekim sonrası bakım: PRP seansları, ilaçlar ve takip süresi",
        ],
      },
      {
        id: "package",
        heading: "İyi bir her şey dahil paket neleri kapsar?",
        paragraphs: [
          "Eksiksiz bir paket; muayene, operasyon, kan tahlilleri, ilaçlar, bakım seti, ilk profesyonel yıkama, otel konaklaması, havalimanı ve klinik transferleri, tercüman ve en az altı ila on iki ay süren düzenli online takibi içermelidir.",
          "Her zaman tekniği, maksimum greft sayısını ve her adımı tam olarak kimin yaptığını belirten yazılı, tarihli bir teklif isteyin. Nuvela'da ücretsiz online analizinizden sonra sabit bir teklif göndeririz ve fiyat operasyon günü değişmez.",
        ],
      },
      {
        id: "red-flags",
        heading: "Dikkat edilmesi gereken uyarı işaretleri",
        paragraphs: ["Bir klinikte aşağıdakilerden biri varsa dikkatli olun:"],
        bullets: [
          "İsmi belli bir cerrah yok veya doktorun lisansı doğrulanamıyor",
          "Varışta artan veya 'nihai greft sayısına' bağlı fiyat",
          "Aynı ekip tarafından aynı anda birden fazla hastanın ameliyat edilmesi",
          "Hemen yüksek bir kapora ödemeniz için baskı",
        ],
      },
    ],
    faqs: [
      { q: "Türkiye'de daha ucuz saç ekimi daha mı kötü?", a: "Her zaman değil, ama çok düşük fiyatlar genellikle işin çoğunu teknisyenlerin yaptığı veya birkaç hastanın tek ekibi paylaştığı anlamına gelir. Sadece fiyatı değil, kimin ameliyat ettiğini karşılaştırın." },
      { q: "Greft başına mı ödeme yapılır?", a: "Bazı klinikler greft başına 1–4 € alır. Biz sürpriz olmaması için donör bölgeniz için güvenli maksimum greft sayısını kapsayan sabit bir paketi tercih ediyoruz." },
    ],
  },
  "sapphire-fue-vs-dhi": {
    title: "Safir FUE mi, DHI mı? Size Hangi Teknik Uygun?",
    excerpt: "Her iki teknik de FUE'nin varyasyonlarıdır. Fark, greftlerin nasıl yerleştirildiğindedir, size hangisinin uygun olduğu dökülmenize, hedeflerinize ve yaşam tarzınıza bağlıdır.",
    sections: [
      { id: "common-ground", heading: "İki tekniğin ortak noktaları", paragraphs: ["Safir FUE ve DHI aynı şekilde başlar: Foliküler üniteler donör bölgeden mikro punch ile tek tek alınır. Şerit, dikiş veya çizgisel iz yoktur. Fark tamamen yerleştirme aşamasındadır."] },
      {
        id: "sapphire",
        heading: "Kısaca Safir FUE",
        paragraphs: ["Cerrah önce tüm alıcı kanalları safir uçlarla açar, ardından ekip greftleri bu kanallara yerleştirir. Kanalları önceden açmak verimlidir; bu yüzden Safir FUE 3.000–4.500 greftlik büyük seanslar ve orta bölge ile tepe bölgesini kapatmak için idealdir."],
        bullets: ["Geniş alanlar için en iyisi", "Yüksek yoğunluk mümkün", "Genellikle biraz daha uygun fiyatlı"],
      },
      {
        id: "dhi",
        heading: "Kısaca DHI",
        paragraphs: ["DHI'de Choi implanter kalemi kanalı açar ve grefti tek hareketle yerleştirir. Bu, açı ve derinlik üzerinde ince kontrol sağlar ve mevcut saçlar arasına ekime izin verir, DHI'nin saç çizgisi, yoğunluk artırma ve traşsız işlemlerde popüler olmasının nedeni budur."],
        bullets: ["Saç çizgisi ve yoğunluk artırma için en iyisi", "Traşsız seçenek", "Greft başına daha yavaş, bu yüzden daha küçük seanslar"],
      },
      {
        id: "which",
        heading: "Peki hangisini seçmelisiniz?",
        paragraphs: [
          "Geniş bir dökülmeniz varsa ve maksimum kapatma istiyorsanız Safir FUE genellikle daha verimli seçimdir. Erken evre dökülmeniz varsa, saçınızı uzun tutmak istiyorsanız veya esas olarak saç çizginizi düzeltmek istiyorsanız DHI çoğu zaman daha mantıklıdır. Hastalarımızın birçoğu kombinasyon alır.",
          "En önemlisi, teknik adı cerrahın planlamasından, saç çizgisi tasarımından ve greftlere gösterilen özenden daha az önemlidir. Her kliniğe saç çizginizi kimin tasarlayacağını ve greftleri kimin yerleştireceğini sorun.",
        ],
      },
    ],
    faqs: [
      { q: "DHI, Safir FUE'den daha iyi mi tutar?", a: "Birinin daha iyi tuttuğuna dair güçlü bir kanıt yoktur. Greftlerin tutma oranı esas olarak özenli işlemeye ve ekibin deneyimine bağlıdır." },
      { q: "İki teknik tek seansta kullanılabilir mi?", a: "Evet. Yaygın bir kombinasyon, tepe ve orta bölge için Safir FUE, saç çizgisi için DHI'dir." },
    ],
  },
  "aftercare-first-14-days": {
    title: "Ekim Sonrası Bakım: Saç Ekiminden Sonraki İlk 14 Gün",
    excerpt: "Gün gün yapmanız (ve kaçınmanız) gerekenler, uyku, yıkama, şişlik, kabuklar ve işe, spora ve salona ne zaman dönebileceğiniz.",
    sections: [
      {
        id: "days-1-3",
        heading: "1–3. günler: Greftleri koruyun",
        paragraphs: [
          "Greftler ilk 72 saatte en hassas dönemindedir. Bakım setinizdeki boyun yastığıyla başınız yüksekte sırt üstü uyuyun, alıcı bölgeye dokunmaktan veya kaşımaktan kaçının ve uzun süre öne eğilmeyin. İkinci-üçüncü gün alında hafif şişlik normaldir ve kendiliğinden geçer.",
          "İlk profesyonel yıkamanız genellikle operasyondan 24–48 saat sonra klinikte yapılır; evde nasıl yıkayacağınızı da orada tam olarak gösteririz.",
        ],
      },
      {
        id: "days-4-7",
        heading: "4–7. günler: Günlük nazik yıkama",
        paragraphs: ["Setinizdeki medikal şampuan ve losyonla günde bir kez yıkayın:"],
        bullets: ["Losyonu uygulayın ve birkaç dakika bekletin", "Şampuan köpüğünü parmak uçlarınızla bastırarak uygulayın, asla ovmayın", "Ilık, düşük basınçlı suyla durulayın", "Kâğıt havluyla tamponlayarak kurulayın veya doğal kurumaya bırakın"],
      },
      { id: "days-8-14", heading: "8–14. günler: Kabuklar düşer", paragraphs: ["Sekizinci günden itibaren yıkama sırasında kabuklara nazikçe masaj yaparak düşmelerini sağlayabilirsiniz. On ila on dördüncü günlerde hastaların çoğu sosyal hayata dönmeye hazırdır. Bu dönemde saçlı deriyi doğrudan güneşten, havuzdan, saunadan ve ağır egzersizden koruyun."] },
      { id: "beyond", heading: "İki haftadan sonra", paragraphs: ["Hafif egzersize genellikle iki hafta sonra, spor salonuna yaklaşık bir ay sonra dönülebilir. Ekilen saçların ikinci ile altıncı haftalar arasında dökülmesini bekleyin, bu şok dökülme geçicidir ve yeni çıkış üçüncü aydan itibaren başlar."] },
    ],
    faqs: [
      { q: "Ne zaman şapka takabilirim?", a: "Bol ve temiz bir şapka genellikle yedi ila on gün sonra takılabilir. Greftlere baskı yapan dar şapkalardan kaçının." },
      { q: "Ne zaman evime uçabilirim?", a: "Hastaların çoğu ilk yıkama ve kontrol yapıldıktan sonra, operasyondan bir-iki gün sonra uçar." },
    ],
  },
  "istanbul-trip-planner": {
    title: "İstanbul'a Saç Ekimi Seyahatinizi Planlayın: 3 Günlük Program",
    excerpt: "Havalimanında karşılamadan dönüş uçuşunuza kadar, pratik bir program, bavul listesi ve operasyon sonrası İstanbul'un güvenle tadını çıkarmak için ipuçları.",
    sections: [
      { id: "day-1", heading: "1. gün: Varış ve muayene", paragraphs: ["Şoförünüz sizi İstanbul Havalimanı'nda (IST) veya Sabiha Gökçen'de (SAW) karşılar ve otelinize götürür. Varış saatinize göre aynı gün ya da ertesi sabah yüz yüze muayene, kan tahlilleri ve cerrahınızla saç çizgisi tasarımı için kliniğe gelirsiniz."] },
      { id: "day-2", heading: "2. gün: Operasyon günü", paragraphs: ["Operasyon genellikle sabah başlar ve molalar ile öğle yemeği dahil altı ila dokuz saat sürer. İşlem boyunca uyanıksınızdır; müzik dinleyebilir veya film izleyebilirsiniz. Akşam ilaçlarınız ve net talimatlarla otele götürülürsünüz."] },
      { id: "day-3", heading: "3. gün: İlk yıkama ve dönüş", paragraphs: ["Ertesi sabah kontrol ve ilk profesyonel yıkama için kliniğe döner, bakım setinizi alır ve havalimanına transfer edilirsiniz. Daha uzun kalırsanız sakin bir gezi sorun değil, sadece başınızı güneşten koruyun ve saçlı derinizin çarpabileceği kalabalıklardan uzak durun."] },
      {
        id: "packing",
        heading: "Bavulunuza neler koymalısınız?",
        paragraphs: ["Birkaç eşya seyahati çok kolaylaştırır:"],
        bullets: ["Başınızdan geçirmeniz gerekmeyen düğmeli veya fermuarlı üstler", "Dönüş uçuşu için bol ve temiz bir şapka (klinik onay verdikten sonra)", "Düzenli ilaçlarınız ve alerji listeniz", "Operasyon günü için boyun yastığı ve rahat kıyafetler"],
      },
    ],
    faqs: [
      { q: "Türkiye için vizeye ihtiyacım var mı?", a: "Uyruğunuza bağlıdır. Birçok Avrupa vatandaşı kısa süreli kalışlar için vizesiz girebilir; rezervasyondan önce mutlaka resmî Türkiye e-Vize sitesini kontrol edin." },
      { q: "Yanımda biri gelebilir mi?", a: "Evet, öneriyoruz. Premium paketimiz bir refakatçi için ücretsiz konaklama içerir." },
    ],
  },
  "choose-safe-clinic-turkey": {
    title: "Türkiye'de Güvenilir Saç Ekimi Kliniği Nasıl Seçilir? 9 Kontrol",
    excerpt: "İstanbul'da yüzlerce klinik var. Lisanslı ve doktor liderliğindeki klinikleri riskli 'saç ekimi fabrikalarından' ayırmak için bu dokuz kontrolü kullanın.",
    sections: [
      {
        id: "licensing",
        heading: "1–3: Lisans ve doktor",
        paragraphs: ["Sağlığınızı koruyan temel konularla başlayın:"],
        bullets: ["Klinik Sağlık Bakanlığı tarafından lisanslı ve sağlık turizmi yetki belgesine sahip", "Cerrahınızın adı belli ve tıbbi lisansı doğrulanabiliyor", "Saç çizgisini yalnızca teknisyenler değil, doktor tasarlıyor ve kritik cerrahi adımları uyguluyor"],
      },
      {
        id: "process",
        heading: "4–6: Tıbbi süreç",
        paragraphs: ["Güvenilir bir klinik saç ekiminizi bir ürün değil, bir ameliyat olarak görür:"],
        bullets: ["İşlem öncesi kan tahlilleri ve tıbbi geçmiş değerlendirmesi", "Her cerrahi ekip için günde bir hasta", "Steril, tek kullanımlık aletler ve uygun bir ameliyathane"],
      },
      {
        id: "transparency",
        heading: "7–9: Şeffaflık ve takip",
        paragraphs: ["Son olarak kliniğin operasyon öncesi ve sonrası ne kadar şeffaf olduğuna bakın:"],
        bullets: ["Teknik ve maksimum greft sayısını içeren yazılı, tarihli teklif", "Doğrulanabilir sonuçlar ve bağımsız yorumlar, sadece sosyal medya değil", "En az 12 ay düzenli takip ve net bir garanti"],
      },
      { id: "trust", heading: "İçgüdünüze güvenin", paragraphs: ["Cevaplar belirsizse, fiyatlar değişiyorsa veya ödeme yapmanız için acele ettiriliyorsanız başka bir klinik arayın. İyi bir klinik her soruyu memnuniyetle yanıtlar ve bazen henüz uygun aday olmadığınızı söyler."] },
    ],
    faqs: [
      { q: "Bir doktoru nasıl doğrulayabilirim?", a: "Cerrahın tam adını ve diplomasını isteyin; Türk Tabipleri Birliği gibi mesleki kayıtları kontrol edin. Saygın klinikler bu bilgiyi açıkça paylaşır." },
      { q: "Bir şeyler ters giderse ne olur?", a: "Belgelenmiş takip ve yazılı garanti sunan bir klinik seçin ve tedavinize ait tüm kayıtları saklayın." },
    ],
  },
  "hair-growth-timeline": {
    title: "Saç Ekimi Sonrası Çıkış: Ay Ay Zaman Çizelgesi",
    excerpt: "Dökülme, 'çirkin ördek yavrusu' dönemi ve yoğunluğun nihayet ortaya çıktığı an, ilk haftadan on ikinci aya kadar neler beklemelisiniz.",
    sections: [
      { id: "month-0-1", heading: "1–4. haftalar: İyileşme ve dökülme", paragraphs: ["Kabuklar on ila on dördüncü günde düşer. İkinci ile altıncı haftalar arasında ekilen saçların çoğu dökülür. Panik yapmayın, folikül derinin altında güvende kalır ve yeni saç üretmeden önce dinlenme evresine girer."] },
      { id: "month-2-4", heading: "2–4. aylar: Sessiz dönem", paragraphs: ["Buna genellikle 'çirkin ördek yavrusu' dönemi denir: Ekim bölgesi operasyon öncesine benzer görünebilir. Üçüncü ay civarında ince yeni saçlar çıkmaya başlar; bazen saçlar deriyi delerken küçük sivilceler oluşabilir."] },
      { id: "month-5-8", heading: "5–8. aylar: Görünür ilerleme", paragraphs: ["Çıkış hızlanır ve saçlar kalınlaşıp koyulaşır. Hastaların çoğu fotoğraflarda gerçek farkı altıncı ay civarında fark eder. Saç dokusu başta biraz sert hissedilebilir ve zamanla yumuşar."] },
      { id: "month-9-12", heading: "9–12+ aylar: Nihai sonuç", paragraphs: ["Yoğunluk ve doku dokuzuncu ile on ikinci aylar arasında olgunlaşır. Tepe bölgesinin tamamlanması 18 ayı bulabilir. Takibiniz kapsamında 3., 6., 9. ve 12. aylarda ilerleme fotoğraflarınızı değerlendiririz."] },
    ],
    faqs: [
      { q: "Ekim sonrası dökülme normal mi?", a: "Evet. İkinci ile altıncı haftalar arasındaki şok dökülme beklenen ve geçici bir durumdur." },
      { q: "Çıkışı hızlandırabilir miyim?", a: "Bakım talimatlarına dikkatle uymak, sigara içmemek ve PRP seansları iyileşmeyi destekleyebilir; ancak saç kendi doğal döngüsünü takip eder." },
    ],
  },
};

export default blog;
