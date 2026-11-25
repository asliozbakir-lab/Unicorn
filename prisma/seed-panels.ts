import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 700. Yıl Panelleri ve Kardeş Şehirler tohumlanıyor...");

  // 1. 700. Yıl Panelleri (Kullanıcının Google E-Tablosundan Birebir)
  const panels = [
    {
      title: "Geçmiş ve Gelecek Bağlamında Bursa’da Tıp",
      institution: "Türk Tabipleri Birliği Bursa Tabip Odası",
      contactPerson: "Sevcan Yaman",
      moderator: "Prof. Dr. Alparslan TÜRKKAN",
      panelists: "Prof. Dr. Türker KILIÇ, Prof. Dr. Murat CİVANER, Doç. Dr. Elif ATICI",
      date: "20.11.2026",
      planningStatus: "ORGANIZING",
      location: "Panorama 1326 Bursa Fetih Müzesi",
      notes: "Tıp tarihi, hekimlik etiği ve geleceğin sağlık teknolojileri masaya yatırılacak.",
    },
    {
      title: "Geçmiş ve Gelecek Bağlamında Bursa’da Hukuk",
      institution: "Bursa Barosu",
      contactPerson: "Sefa Başkan",
      moderator: "Bursa Barosu Temsilcisi",
      panelists: "Dr. Öğr. Üyesi Yasemin Kurtoğlu (Bursa Uludağ Üniversitesi Hukuk Fakültesi Bölüm Bşk. Yrd.)",
      date: "Mayıs 2026",
      planningStatus: "PLANNING",
      location: "Ördekli Kültür Merkezi",
      notes: "Osmanlı'dan günümüze Bursa adalet teşkilatı ve modern kent hukuku.",
    },
    {
      title: "Geçmiş ve Gelecek Bağlamında Bursa'da Otomotiv",
      institution: "Bursa Rotary Kulübü",
      contactPerson: "Tamer Esigül",
      moderator: "Otomotiv İhracatçıları Birliği Temsilcisi",
      panelists: "Sektör liderleri, elektrikli araç inovasyon uzmanları, sanayiciler",
      date: "25 Nisan 2026",
      planningStatus: "PLANNING",
      location: "Merinos AKKM",
      notes: "Türkiye'nin otomotiv başkenti Bursa'da elektrikli ve otonom araç dönüşümü.",
    },
    {
      title: "Geçmiş ve Gelecek Bağlamında Bursa’da Türkçe",
      institution: "Türk Dil Kurumu & Bursa Uludağ Üniversitesi",
      contactPerson: "Prof. Dr. Hatice Şahin",
      moderator: "Prof. Dr. Hatice Şahin (Bursa Uludağ Üniversitesi Fen-Edebiyat Fakültesi, Türk Dili ve Edebiyatı Bölümü)",
      panelists: "Prof. Dr. Şükrü Haluk Akalın (Hacettepe Üniversitesi), Belgin Tezcan Aksu (TDK Uzmanı), Prof. Lindita Xhanari Latifi (Tiran Üniversitesi Arnavutluk), Prof. Dr. Marija Đinđić (Sırp Bilimler ve Sanatlar Akademisi), Dr. Ayla Hafız Küçükusta (Balkan Türkoloji Araştırmaları Merkezi Kosova)",
      date: "14 Mayıs 2026",
      planningStatus: "ORGANIZING",
      location: "Panorama 1326 Bursa Fetih Müzesi",
      notes: "Balkanlar'dan Anadolu'ya Türkçenin tarihi seyri ve uluslararası boyutu.",
    },
    {
      title: "Geçmiş ve Gelecek Bağlamında Bursa’da Deprem",
      institution: "TMMOB Jeoloji Mühendisleri Odası",
      contactPerson: "Serkan Bey (Jeoloji M.O.)",
      moderator: "Prof. Dr. Hükmü Orhan (Konya Teknik Üniversitesi / JEMİRKO)",
      panelists: "Prof. Dr. Nizamettin Kazancı (UNESCO Türkiye Milli Komisyonu), Prof. Dr. Neslihan Dostoğlu (UNESCO Bursa Alan Başkanı / İstanbul Kültür Üni), Prof. Dr. Gürol Seyitoğlu (Ankara Üniversitesi - Kayapa-Yenişehir Fayı Analizi), Dr. İbrahim Karahancı (Uludağ Üni - 1855 Bursa Depremi Tanıklığı)",
      date: "23 Ekim 2026",
      planningStatus: "ORGANIZING",
      location: "Merinos AKKM",
      notes: "Bursa fay hatları, tarihsel depremler ve kentsel dirençlilik.",
    },
    {
      title: "Geçmiş ve Gelecek Bağlamında Bursa’da Gastronomi",
      institution: "BTSO (Bursa Ticaret ve Sanayi Odası)",
      contactPerson: "BTSO Gastronomi Konseyi",
      moderator: "Gastronomi Yazarı & Akademisyen",
      panelists: "Bursa mutfağı araştırmacıları, coğrafi işaret uzmanları, şefler",
      date: "Haziran 2026",
      planningStatus: "PLANNING",
      location: "Sümbüllü Bahçe Konağı",
      notes: "Saray mutfağından günümüze Bursa lezzetleri ve gastronomi turizmi.",
    },
    {
      title: "Geçmiş ve Gelecek Bağlamında Bursa’da Çevre ve Su",
      institution: "TMMOB Çevre Mühendisleri Odası",
      contactPerson: "Rüveyşa Hanım",
      moderator: "Çevre Mühendisliği Bölüm Başkanı",
      panelists: "Su kaynakları yönetimi uzmanları, Nilüfer Çayı ıslah heyeti",
      date: "Eylül 2026",
      planningStatus: "PLANNING",
      location: "Panorama 1326 Bursa Fetih Müzesi",
      notes: "Uludağ su havzaları, iklim değişikliğine uyum ve çevre politikaları.",
    },
    {
      title: "Geçmiş ve Gelecek Bağlamında Bursa’da Mimari",
      institution: "TMMOB Bursa Mimarlar Odası",
      contactPerson: "Şirin Rodoplu",
      moderator: "Prof. Dr. Mimar Nevzat Oğuz Özer & Dr. Mimar M. Batu Kepekcioğlu",
      panelists: "1. Gün: Prof. Dr. Özgür M. Ediz, Ayhan Abanozcu, Kutlu İnanç Bal, Cafer Bozkurt, Rahmi Dede, Nizamettin Kaya, Dürrin Süer, Saim Han Tümertekin. 2. Gün: Ömer Yılmaz, Özgür Bingöl, Tuna Han Koç, Bora Akın, Hasan Özbay, Cihan Sevindik, Burcu Sevinç Yılmaz, Regaip Adem",
      date: "9-10 Ekim 2026",
      planningStatus: "ORGANIZING",
      location: "Panorama 1326 Bursa Fetih Müzesi",
      notes: "Erken Osmanlı mimarisinden modern Bursa kentsel dokusuna 2 günlük büyük sempozyum.",
    },
    {
      title: "Geçmiş ve Gelecek Bağlamında Bursa’da Gıda",
      institution: "Gıda Mühendisleri Odası & Gazi Tarım A.Ş.",
      contactPerson: "Serkan Bey",
      moderator: "Gıda Güvenliği Uzmanı",
      panelists: "Gıda mühendisleri, tarımsal kalkınma kooperatifleri, Food Trails temsilcileri",
      date: "Temmuz 2026",
      planningStatus: "PLANNING",
      location: "Ördekli Kültür Merkezi",
      notes: "Sürdürülebilir tarım, gıda güvencesi ve yerel üretici destekleri.",
    },
    {
      title: "Geçmiş ve Gelecek Bağlamında Bursa’da Ticaret",
      institution: "MARSİFED (Marmara ve İç Anadolu Sanayi ve İş Dünyası Federasyonu)",
      contactPerson: "Osman Akın",
      moderator: "İktisat Tarihçisi",
      panelists: "Tarihi İpek Yolu, Hanlar Bölgesi esnafı, modern e-ticaret ve sanayi temsilcileri",
      date: "Kasım 2026",
      planningStatus: "PLANNING",
      location: "Bursa Ticaret Borsası Konferans Salonu",
      notes: "Tarihi çarşı ve hanlardan global e-ihracat merkezine Bursa ticareti.",
    },
    {
      title: "Geçmiş ve Gelecek Bağlamında Bursa’da Göç",
      institution: "TİKA, YTB & Bal-Göç",
      contactPerson: "Bal-Göç Genel Merkezi",
      moderator: "Göç Tarihi Araştırmacısı",
      panelists: "Balkan göçmenleri temsilcileri, sosyologlar, TİKA uzmanları",
      date: "Aralık 2026",
      planningStatus: "PLANNING",
      location: "Panorama 1326 Bursa Fetih Müzesi",
      notes: "Bursa'nın demografik kimliği, Balkan mirası ve kültürel zenginlik.",
    },
  ];

  for (const panel of panels) {
    await prisma.conquestPanel.create({
      data: panel,
    });
  }

  // 2. Kardeş Şehirler (Sister Cities)
  const sisterCities = [
    {
      cityName: "Şuşa",
      countryName: "Azerbaycan",
      countryCode: "AZ",
      flagEmoji: "🇦🇿",
      protocolDate: "2022",
      scope: "Kültür, Tarihi Miras ve Gençlik Değişimi",
      notes: "Türk Dünyası Kültür Başkenti Şuşa ile kardeşlik protokolü.",
    },
    {
      cityName: "Doboj (Doboy)",
      countryName: "Bosna-Hersek",
      countryCode: "BA",
      flagEmoji: "🇧🇦",
      protocolDate: "2013",
      scope: "Kentsel Hizmetler, Tarihi Miras ve Kültürel İş Birliği",
      notes: "Balkanlar ile tarihi bağların güçlendirilmesi.",
    },
    {
      cityName: "Stari Grad (Saraybosna)",
      countryName: "Bosna-Hersek",
      countryCode: "BA",
      flagEmoji: "🇧🇦",
      protocolDate: "2008",
      scope: "Osmanlı Mirasını Koruma ve Turizm",
      notes: "Başçarşı ve tarihi merkez yönetimi ortak çalışmaları.",
    },
    {
      cityName: "Kırcaali",
      countryName: "Bulgaristan",
      countryCode: "BG",
      flagEmoji: "🇧🇬",
      protocolDate: "2007",
      scope: "Kültürel Etkinlikler, Sosyal İşler ve Spor",
      notes: "Yoğun soydaş nüfusu ve kültürel festivaller iş birliği.",
    },
    {
      cityName: "Omurtag",
      countryName: "Bulgaristan",
      countryCode: "BG",
      flagEmoji: "🇧🇬",
      protocolDate: "2006",
      scope: "Kültür, Spor ve Altyapı Tecrübe Paylaşımı",
      notes: "Geleneksel kardeş şehir etkinlikleri.",
    },
    {
      cityName: "Kozlukebir (Arriana)",
      countryName: "Yunanistan",
      countryCode: "GR",
      flagEmoji: "🇬🇷",
      protocolDate: "2010",
      scope: "Batı Trakya Soydaş Buluşmaları ve Kültür",
      notes: "Gümülcine bölgesi kültürel iş birliği.",
    },
    {
      cityName: "Konayev (Kapşagay)",
      countryName: "Kazakistan",
      countryCode: "KZ",
      flagEmoji: "🇰🇿",
      protocolDate: "2016",
      scope: "Akıllı Şehircilik ve Ticari İlişkiler",
      notes: "Almatı bölgesi kentsel gelişim tecrübe transferi.",
    },
    {
      cityName: "Arhangay",
      countryName: "Moğolistan",
      countryCode: "MN",
      flagEmoji: "🇲🇳",
      protocolDate: "2011",
      scope: "Göçebe Mirası ve Tarih Araştırmaları",
      notes: "Orhun Vadisi Türk tarihi anıtları iş birliği.",
    },
    {
      cityName: "Mamuşa",
      countryName: "Kosova",
      countryCode: "XK",
      flagEmoji: "🇽🇰",
      protocolDate: "2009",
      scope: "Eğitim, Tarım ve Kültürel Destek",
      notes: "Kosova'nın tek Türk belediyesi ile kardeşlik bağı.",
    },
    {
      cityName: "Gazimağusa",
      countryName: "KKTC",
      countryCode: "TR",
      flagEmoji: "🇹🇷",
      protocolDate: "2015",
      scope: "Tarihi Kent Sur Yönetimi ve Üniversite İş Birliği",
      notes: "Doğu Akdeniz Üniversitesi ortak projeleri.",
    },
    {
      cityName: "Keles",
      countryName: "Türkiye (Bursa)",
      countryCode: "TR",
      flagEmoji: "🇹🇷",
      protocolDate: "2019",
      scope: "Dağ Yöresi Kırsal Kalkınma ve Eko-Turizm",
      notes: "Yerel dayanışma ve ortak kırsal kalkınma projeleri.",
    },
  ];

  for (const sc of sisterCities) {
    await prisma.sisterCity.create({
      data: sc,
    });
  }

  // 3. Üyesi Olunan Birlikler
  const unions = [
    { name: "Eurocities", description: "Avrupa Şehirler Birliği Kentsel İş Birliği Ağı (Brüksel)" },
    { name: "UCLG-MEWA", description: "Birleşmiş Kentler ve Yerel Yönetimler Orta Doğu ve Batı Asya Bölge Teşkilatı" },
    { name: "UNESCO Kültürlerarası Şehirler", description: "Council of Europe Intercultural Cities Programme" },
    { name: "Türkiye Sağlıklı Kentler Birliği", description: "Sürdürülebilir ve Sağlıklı Kentsel Gelişim Birliği (Bursa Merkezli)" },
    { name: "Dünya Tarihi Kentler Birliği (LHC)", description: "The League of Historical Cities (Kyoto, Japonya)" },
    { name: "Uluslararası Panoramalar Konseyi (IPC)", description: "International Panorama Council (Panorama 1326 üyesi)" },
    { name: "CIVITAS Cities Network", description: "Avrupa Temiz Kentsel Ulaşım ve Hareketlilik Ağı" },
    { name: "Marmara Belediyeler Birliği (MBB)", description: "Bölgesel Yerel Yönetimler ve Çevre Politikaları Birliği (İstanbul)" },
    { name: "Tarihi Kentler Birliği (TKB)", description: "Kültürel Mirası Koruma ve Yaşatma Birliği" },
    { name: "Türk Dünyası Belediyeler Birliği (TDBB)", description: "Avrasya ve Balkan Yerel Yönetimler İş Birliği" },
  ];

  for (const un of unions) {
    const existing = await prisma.networkMembership.findFirst({ where: { name: un.name } });
    if (!existing) {
      await prisma.networkMembership.create({ data: un });
    }
  }

  console.log("✅ 700. Yıl Panelleri ve Kardeş Şehirler başarıyla tohumlandı!");
}

main()
  .catch((e) => {
    console.error("❌ Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
