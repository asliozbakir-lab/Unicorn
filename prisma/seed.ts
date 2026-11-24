import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Osmangazi Ar-Ge 360 tohumlama (seed) başlatılıyor...");

  // 1. Rolleri Oluştur
  const roles = [
    {
      name: "SYSTEM_ADMIN",
      label: "Sistem Yöneticisi",
      permissions: JSON.stringify(["all"]),
    },
    {
      name: "MANAGER",
      label: "AR-GE Müdürü",
      permissions: JSON.stringify(["projects:read", "projects:write", "projects:delete", "reports:read", "users:read"]),
    },
    {
      name: "STAFF",
      label: "Uzman / Mühendis",
      permissions: JSON.stringify(["projects:read", "projects:write", "tasks:write"]),
    },
    {
      name: "READONLY",
      label: "Salt Okunur / Denetçi",
      permissions: JSON.stringify(["projects:read", "reports:read"]),
    },
  ];

  const roleMap: Record<string, string> = {};
  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { label: r.label, permissions: r.permissions },
      create: r,
    });
    roleMap[r.name] = role.id;
  }

  // 2. Personel Hesapları (Şifre: Osmangazi360!)
  const passwordHash = await bcrypt.hash("Osmangazi360!", 10);

  const team = [
    {
      name: "Serkan Cebeci",
      email: "serkan.cebeci@osmangazi.bel.tr",
      title: "AR-GE Müdürü",
      roleId: roleMap["MANAGER"],
    },
    {
      name: "Aslı Ökten",
      email: "asli.okten@osmangazi.bel.tr",
      title: "Endüstriyel Tasarım Mühendisi",
      roleId: roleMap["STAFF"],
    },
    {
      name: "İpek Çınar",
      email: "ipek.cinar@osmangazi.bel.tr",
      title: "Endüstri Mühendisi",
      roleId: roleMap["STAFF"],
    },
    {
      name: "Berkay Salman",
      email: "berkay.salman@osmangazi.bel.tr",
      title: "Yüksek Mimar",
      roleId: roleMap["STAFF"],
    },
    {
      name: "Ece Elçi",
      email: "ece.elci@osmangazi.bel.tr",
      title: "Yüksek Mimar",
      roleId: roleMap["STAFF"],
    },
    {
      name: "Ersel Turan",
      email: "ersel.turan@osmangazi.bel.tr",
      title: "Ofis Sorumlusu",
      roleId: roleMap["STAFF"],
    },
    {
      name: "Sistem Yöneticisi",
      email: "admin@osmangazi.bel.tr",
      title: "Bilgi İşlem / Güvenlik Yöneticisi",
      roleId: roleMap["SYSTEM_ADMIN"],
    },
    {
      name: "İç Denetçi",
      email: "denetim@osmangazi.bel.tr",
      title: "Mali ve İdari Denetçi",
      roleId: roleMap["READONLY"],
    },
  ];

  const userMap: Record<string, string> = {};
  for (const u of team) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, title: u.title, roleId: u.roleId, passwordHash },
      create: { ...u, passwordHash },
    });
    userMap[u.email] = user.id;
  }

  // 3. 35 Partner Ülke
  const countries = [
    { code: "TR", name: "Türkiye", nameEn: "Turkey", flagEmoji: "🇹🇷" },
    { code: "DE", name: "Almanya", nameEn: "Germany", flagEmoji: "🇩🇪" },
    { code: "AT", name: "Avusturya", nameEn: "Austria", flagEmoji: "🇦🇹" },
    { code: "IT", name: "İtalya", nameEn: "Italy", flagEmoji: "🇮🇹" },
    { code: "PL", name: "Polonya", nameEn: "Poland", flagEmoji: "🇵🇱" },
    { code: "ES", name: "İspanya", nameEn: "Spain", flagEmoji: "🇪🇸" },
    { code: "NO", name: "Norveç", nameEn: "Norway", flagEmoji: "🇳🇴" },
    { code: "FR", name: "Fransa", nameEn: "France", flagEmoji: "🇫🇷" },
    { code: "LV", name: "Letonya", nameEn: "Latvia", flagEmoji: "🇱🇻" },
    { code: "HR", name: "Hırvatistan", nameEn: "Croatia", flagEmoji: "🇭🇷" },
    { code: "SK", name: "Slovakya", nameEn: "Slovakia", flagEmoji: "🇸🇰" },
    { code: "BE", name: "Belçika", nameEn: "Belgium", flagEmoji: "🇧🇪" },
    { code: "FI", name: "Finlandiya", nameEn: "Finland", flagEmoji: "🇫🇮" },
    { code: "CZ", name: "Çekya", nameEn: "Czech Republic", flagEmoji: "🇨🇿" },
    { code: "EE", name: "Estonya", nameEn: "Estonia", flagEmoji: "🇪🇪" },
    { code: "BG", name: "Bulgaristan", nameEn: "Bulgaria", flagEmoji: "🇧🇬" },
    { code: "LT", name: "Litvanya", nameEn: "Lithuania", flagEmoji: "🇱🇹" },
    { code: "LB", name: "Lübnan", nameEn: "Lebanon", flagEmoji: "🇱🇧" },
    { code: "UA", name: "Ukrayna", nameEn: "Ukraine", flagEmoji: "🇺🇦" },
    { code: "KR", name: "Güney Kore", nameEn: "South Korea", flagEmoji: "🇰🇷" },
    { code: "KZ", name: "Kazakistan", nameEn: "Kazakhstan", flagEmoji: "🇰🇿" },
    { code: "JO", name: "Ürdün", nameEn: "Jordan", flagEmoji: "🇯🇴" },
    { code: "MK", name: "Kuzey Makedonya", nameEn: "North Macedonia", flagEmoji: "🇲🇰" },
    { code: "CH", name: "İsviçre", nameEn: "Switzerland", flagEmoji: "🇨🇭" },
    { code: "GR", name: "Yunanistan", nameEn: "Greece", flagEmoji: "🇬🇷" },
    { code: "SE", name: "İsveç", nameEn: "Sweden", flagEmoji: "🇸🇪" },
    { code: "PT", name: "Portekiz", nameEn: "Portugal", flagEmoji: "🇵🇹" },
    { code: "GB", name: "Birleşik Krallık", nameEn: "United Kingdom", flagEmoji: "🇬🇧" },
    { code: "RO", name: "Romanya", nameEn: "Romania", flagEmoji: "🇷🇴" },
    { code: "HU", name: "Macaristan", nameEn: "Hungary", flagEmoji: "🇭🇺" },
    { code: "IE", name: "İrlanda", nameEn: "Ireland", flagEmoji: "🇮🇪" },
    { code: "NL", name: "Hollanda", nameEn: "Netherlands", flagEmoji: "🇳🇱" },
    { code: "DK", name: "Danimarka", nameEn: "Denmark", flagEmoji: "🇩🇰" },
  ];

  const countryMap: Record<string, string> = {};
  for (const c of countries) {
    const country = await prisma.country.upsert({
      where: { code: c.code },
      update: { name: c.name, nameEn: c.nameEn, flagEmoji: c.flagEmoji },
      create: c,
    });
    countryMap[c.code] = country.id;
  }

  // 4. Partner Kuruluşlar (Üniversiteler, Belediyeler, Ajanslar)
  const orgs = [
    { name: "Delft University of Technology (TU Delft)", countryCode: "NL", city: "Delft", type: "UNIVERSITY" },
    { name: "Technical University of Munich (TUM)", countryCode: "DE", city: "Münih", type: "UNIVERSITY" },
    { name: "Politecnico di Milano", countryCode: "IT", city: "Milano", type: "UNIVERSITY" },
    { name: "Politecnico di Torino", countryCode: "IT", city: "Torino", type: "UNIVERSITY" },
    { name: "University College London (UCL)", countryCode: "GB", city: "Londra", type: "UNIVERSITY" },
    { name: "University of Bristol", countryCode: "GB", city: "Bristol", type: "UNIVERSITY" },
    { name: "University of Liverpool", countryCode: "GB", city: "Liverpool", type: "UNIVERSITY" },
    { name: "University of Porto (U.Porto)", countryCode: "PT", city: "Porto", type: "UNIVERSITY" },
    { name: "Charles University (Univerzita Karlova)", countryCode: "CZ", city: "Prag", type: "UNIVERSITY" },
    { name: "Universitat de València", countryCode: "ES", city: "Valensiya", type: "UNIVERSITY" },
    { name: "Città di Torino", countryCode: "IT", city: "Torino", type: "MUNICIPALITY" },
    { name: "City of Florence", countryCode: "IT", city: "Floransa", type: "MUNICIPALITY" },
    { name: "Riga City Council", countryCode: "LV", city: "Riga", type: "MUNICIPALITY" },
    { name: "City of Rijeka", countryCode: "HR", city: "Rijeka", type: "MUNICIPALITY" },
    { name: "Gijon Municipality", countryCode: "ES", city: "Gijon", type: "MUNICIPALITY" },
    { name: "Bursa Uludağ Üniversitesi", countryCode: "TR", city: "Bursa", type: "UNIVERSITY" },
    { name: "İstanbul Teknik Üniversitesi (İTÜ)", countryCode: "TR", city: "İstanbul", type: "UNIVERSITY" },
    { name: "BEBKA (Bursa Eskişehir Bilecik Kalkınma Ajansı)", countryCode: "TR", city: "Bursa", type: "AGENCY" },
    { name: "AFAD (Afet ve Acil Durum Yönetimi Başkanlığı)", countryCode: "TR", city: "Ankara", type: "AGENCY" },
    { name: "Yellow Window", countryCode: "BE", city: "Brüksel", type: "PRIVATE" },
    { name: "deepblue consulting & research", countryCode: "IT", city: "Roma", type: "RESEARCH" },
  ];

  const orgMap: Record<string, string> = {};
  for (const o of orgs) {
    const org = await prisma.organization.create({
      data: {
        name: o.name,
        type: o.type,
        city: o.city,
        countryId: countryMap[o.countryCode] || countryMap["TR"],
      },
    });
    orgMap[o.name] = org.id;
  }

  // 5. Uluslararası Ağ Üyelikleri
  const networks = [
    { name: "Eurocities", description: "Avrupa Şehirler Birliği Kentsel İş Birliği Ağı" },
    { name: "UNESCO Kültürlerarası Şehirler", description: "Council of Europe Intercultural Cities Programme" },
    { name: "CIVITAS Cities Network", description: "Sürdürülebilir Kentsel Hareketlilik Ağı" },
    { name: "Dünya Tarihi Kentler Birliği", description: "The League of Historical Cities" },
    { name: "UCLG-MEWA", description: "Birleşmiş Kentler ve Yerel Yönetimler Orta Doğu ve Batı Asya Bölge Teşkilatı" },
    { name: "Uluslararası Panoramalar Konseyi", description: "International Panorama Council (IPC)" },
  ];
  for (const net of networks) {
    await prisma.networkMembership.create({ data: net });
  }

  // 6. Fon Programları
  const progHorizon = await prisma.fundingProgram.create({
    data: { name: "Horizon Europe (Ufuk Avrupa)", code: "HORIZON-EU", provider: "Avrupa Komisyonu" },
  });
  const progDUT = await prisma.fundingProgram.create({
    data: { name: "Driving Urban Transitions (DUT)", code: "DUT", provider: "Ufuk Avrupa Ortaklığı", parentProgramId: progHorizon.id },
  });
  const progNEB = await prisma.fundingProgram.create({
    data: { name: "New European Bauhaus (NEB)", code: "NEB", provider: "Avrupa Birliği" },
  });
  const progErasmus = await prisma.fundingProgram.create({
    data: { name: "Erasmus+ Programı", code: "ERASMUS", provider: "Avrupa Birliği / Türkiye Ulusal Ajansı" },
  });
  const progTubitak = await prisma.fundingProgram.create({
    data: { name: "TÜBİTAK İkili İş Birliği", code: "TUBITAK", provider: "TÜBİTAK" },
  });
  const progBebka = await prisma.fundingProgram.create({
    data: { name: "BEBKA Mali Destek Programı", code: "BEBKA", provider: "Sanayi ve Teknoloji Bakanlığı / BEBKA" },
  });

  // 7. Projeler (4 Ana Kategori)
  const projects = [
    // ULUSLARARASI
    {
      code: "OGZ-INT-FOODTRAILS",
      name: "Food Trails",
      category: "INTERNATIONAL",
      phase: "ACTIVE",
      budgetAmount: 180000,
      currency: "EUR",
      description: "Gıda politikalarının yaygınlaştırılması ve kentsel entegrasyonu odaklı Avrupa konsorsiyumu.",
      coordinatorOrg: "Città di Milano",
      responsibleEmail: "serkan.cebeci@osmangazi.bel.tr",
      fundingProgramId: progHorizon.id,
    },
    {
      code: "OGZ-INT-CLEVERFOOD",
      name: "Clever Food",
      category: "INTERNATIONAL",
      phase: "ACTIVE",
      budgetAmount: 145000,
      currency: "EUR",
      description: "Gıda politikası ve gıda konseyleri üzerine Torino, İrlanda ve Bosna ile eşleştirme çalışmaları.",
      coordinatorOrg: "Città di Torino",
      responsibleEmail: "ipek.cinar@osmangazi.bel.tr",
      fundingProgramId: progHorizon.id,
    },
    {
      code: "OGZ-INT-SCHOOL2FARM",
      name: "School to Farm",
      category: "INTERNATIONAL",
      phase: "COMPLETED",
      budgetAmount: 112000,
      currency: "EUR",
      description: "STEAM öğrenme modeliyle sürdürülebilir tarım odaklı oyunlaştırılmış müfredat geliştirme.",
      responsibleEmail: "asli.okten@osmangazi.bel.tr",
      fundingProgramId: progErasmus.id,
    },
    {
      code: "OGZ-INT-DUT-PROMISE",
      name: "DUT / PROMISE",
      category: "INTERNATIONAL",
      phase: "ACTIVE",
      budgetAmount: 235000,
      currency: "EUR",
      description: "12 ortaklı ve 1,7 milyon Euro bütçeli Driving Urban Transitions kentsel geçiş projesi.",
      coordinatorOrg: "TU Delft",
      responsibleEmail: "serkan.cebeci@osmangazi.bel.tr",
      fundingProgramId: progDUT.id,
    },
    {
      code: "OGZ-INT-CIVITAS-HUB",
      name: "CIVITAS Replication and Deployment",
      category: "INTERNATIONAL",
      phase: "ACTIVE",
      budgetAmount: 95000,
      currency: "EUR",
      description: "Floransa şehri ile 'Mobility Hub' başlığı altında kentsel hareketlilik ve planlama çalışmaları.",
      coordinatorOrg: "City of Florence",
      responsibleEmail: "berkay.salman@osmangazi.bel.tr",
      fundingProgramId: progHorizon.id,
    },
    {
      code: "OGZ-INT-ORTAKLASA",
      name: "ORTAKLAŞA: Romangal İpek Fabrikası",
      category: "INTERNATIONAL",
      phase: "ACTIVE",
      budgetAmount: 85000,
      currency: "EUR",
      description: "Tarihi Romangal İpek Fabrikası'nın sözlü tarih, podcast ve katılımcı kültürel faaliyetlerle canlandırılması.",
      responsibleEmail: "ece.elci@osmangazi.bel.tr",
      fundingProgramId: progNEB.id,
    },
    {
      code: "OGZ-INT-SCALEDEM",
      name: "SCALEDEM – Bre2Act",
      category: "INTERNATIONAL",
      phase: "PREPARATION",
      budgetAmount: 160000,
      currency: "EUR",
      description: "Kapsayıcı mahalle katılımı ile vatandaş fikirlerinin belediye eylemine dönüştürülmesi.",
      responsibleEmail: "asli.okten@osmangazi.bel.tr",
      fundingProgramId: progHorizon.id,
    },
    {
      code: "OGZ-INT-EVALINNO",
      name: "Eval-Inno: MSCA Staff Exchange",
      category: "INTERNATIONAL",
      phase: "SUBMITTED",
      budgetAmount: 130000,
      currency: "EUR",
      description: "Belediyeler, üniversiteler ve araştırma kurumları arası uluslararası personel ve bilgi değişimi.",
      responsibleEmail: "ipek.cinar@osmangazi.bel.tr",
      fundingProgramId: progHorizon.id,
    },

    // ULUSAL
    {
      code: "OGZ-NAT-SEHRINGOZLERI",
      name: "Şehrin Gözleri Projesi",
      category: "NATIONAL",
      phase: "ACTIVE",
      budgetAmount: 2450000,
      currency: "TRY",
      description: "BEBKA destekli akıllı şehir izleme, veri toplama ve kentsel durum analiz sistemi.",
      municipalUnit: "Bilgi İşlem Müdürlüğü",
      responsibleEmail: "serkan.cebeci@osmangazi.bel.tr",
      fundingProgramId: progBebka.id,
    },
    {
      code: "OGZ-NAT-IKLIM",
      name: "İklim Değişikliği ve Uyum Programı",
      category: "NATIONAL",
      phase: "SUBMITTED",
      budgetAmount: 1850000,
      currency: "TRY",
      description: "Osmangazi iklim eylem planı çerçevesinde ana ve eş başvuran olarak sunulan iki kapsamlı proje.",
      municipalUnit: "Çevre Koruma Müdürlüğü",
      responsibleEmail: "ipek.cinar@osmangazi.bel.tr",
    },
    {
      code: "OGZ-NAT-AFAD-TASKIN",
      name: "AFAD & Sağlıklı Kentler Afet Hazırlığı",
      category: "NATIONAL",
      phase: "ACTIVE",
      budgetAmount: 1200000,
      currency: "TRY",
      description: "Taşkın ve deprem afetlerine yönelik erken uyarı ve dayanıklı kentsel altyapı iş birlikleri.",
      municipalUnit: "Afet İşleri Müdürlüğü",
      responsibleEmail: "berkay.salman@osmangazi.bel.tr",
    },
    {
      code: "OGZ-NAT-TUBITAK-ULUDAĞ",
      name: "TÜBİTAK & Uludağ Üniversitesi Ortak Çalışmaları",
      category: "NATIONAL",
      phase: "ACTIVE",
      budgetAmount: 850000,
      currency: "TRY",
      description: "Radar zemin çökmesi ve toprak kabuğu biyoteknolojisi üzerine ikili Ar-Ge projeleri.",
      responsibleEmail: "asli.okten@osmangazi.bel.tr",
      fundingProgramId: progTubitak.id,
    },

    // KURUMSAL
    {
      code: "OGZ-CORP-CBS360",
      name: "Coğrafi Bilgi Sistemi (CBS) 360° Çekimler",
      category: "CORPORATE",
      phase: "ACTIVE",
      budgetAmount: 3200000,
      currency: "TRY",
      description: "1700 km yol ağının 2 cm hata payı ile panoramik lazer ve 360 kamera ile ölçümlenmesi.",
      municipalUnit: "Bilgi İşlem Müdürlüğü",
      responsibleEmail: "serkan.cebeci@osmangazi.bel.tr",
    },
    {
      code: "OGZ-CORP-EBELEDIYE",
      name: "E-İmar, E-Ruhsat ve E-Mobil Uygulamaları",
      category: "CORPORATE",
      phase: "COMPLETED",
      budgetAmount: 1400000,
      currency: "TRY",
      description: "Daha hızlı, şeffaf ve çevrim içi ruhsat/imar süreç yönetimi altyapısı.",
      municipalUnit: "İmar ve Şehircilik Müdürlüğü",
      responsibleEmail: "ersel.turan@osmangazi.bel.tr",
    },
    {
      code: "OGZ-CORP-ARACTAKIP",
      name: "Araç Takip ve Telemetri Sistemi",
      category: "CORPORATE",
      phase: "ACTIVE",
      budgetAmount: 950000,
      currency: "TRY",
      description: "200'e yakın belediye aracının anlık yakıt, rota ve performans değerlendirme sistemi.",
      municipalUnit: "Destek Hizmetleri Müdürlüğü",
      responsibleEmail: "ersel.turan@osmangazi.bel.tr",
    },
    {
      code: "OGZ-CORP-AKILLIBINA",
      name: "Akıllı Bina ve Tesis Yönetim Sistemi",
      category: "CORPORATE",
      phase: "ACTIVE",
      budgetAmount: 1100000,
      currency: "TRY",
      description: "Belediye hizmet binalarında enerji, emlak ve insan kaynakları yönetiminin dijitalleştirilmesi.",
      municipalUnit: "Tesisler Müdürlüğü",
      responsibleEmail: "berkay.salman@osmangazi.bel.tr",
    },
    {
      code: "OGZ-CORP-YAPAYZEKA-CAGRI",
      name: "Yapay Zekâ Destekli Çağrı Merkezi",
      category: "CORPORATE",
      phase: "PREPARATION",
      budgetAmount: 1750000,
      currency: "TRY",
      description: "Vatandaş talep ve şikayetlerinin yapay zekâ ile anlık analizi ve birimlere akıllı yönlendirilmesi.",
      municipalUnit: "Basın Yayın ve Halkla İlişkiler",
      responsibleEmail: "asli.okten@osmangazi.bel.tr",
    },

    // KURUM İÇİ
    {
      code: "OGZ-INTR-ROMANGAL",
      name: "Romangal Fabrikası Endüstriyel Miras Dönüşümü",
      category: "INTERNAL",
      phase: "ACTIVE",
      budgetAmount: 18500000,
      currency: "TRY",
      description: "Tarihi Yılmazipek İpek Fabrikası'nın kültür, tasarım ve inovasyon merkezine dönüştürülmesi.",
      municipalUnit: "Fen İşleri Müdürlüğü",
      responsibleEmail: "ece.elci@osmangazi.bel.tr",
    },
    {
      code: "OGZ-INTR-GENCLIK-GIRISIM",
      name: "Gençlik ve Girişimcilik Merkezi",
      category: "INTERNAL",
      phase: "ACTIVE",
      budgetAmount: 4200000,
      currency: "TRY",
      description: "Gençler için prototipleme atölyeleri, kuluçka ofisleri ve eğitim alanları.",
      municipalUnit: "Gençlik ve Spor Hizmetleri",
      responsibleEmail: "asli.okten@osmangazi.bel.tr",
    },
    {
      code: "OGZ-INTR-BASKETBOL-ZEMIN",
      name: "Basketbol Sahaları Zemin Tasarımı Projesi",
      category: "INTERNAL",
      phase: "COMPLETED",
      budgetAmount: 650000,
      currency: "TRY",
      description: "Park ve rekreasyon alanlarındaki basketbol sahalarına çağdaş grafik ve zemin tasarımı uygulanması.",
      municipalUnit: "Park Bahçeler & Kentsel Tasarım",
      responsibleEmail: "asli.okten@osmangazi.bel.tr",
    },
    {
      code: "OGZ-INTR-AKOM",
      name: "AKOM Merkezi ve Afet Hazırlık Projeleri",
      category: "INTERNAL",
      phase: "ACTIVE",
      budgetAmount: 3800000,
      currency: "TRY",
      description: "Afet koordinasyon merkezi donanımı ve mahalle bazlı acil durum lojistik istasyonları.",
      municipalUnit: "Afet İşleri Müdürlüğü",
      responsibleEmail: "berkay.salman@osmangazi.bel.tr",
    },
    {
      code: "OGZ-INTR-VISIT-OSMANGAZI",
      name: "Visit Osmangazi Kültür ve Turizm Portalı",
      category: "INTERNAL",
      phase: "ACTIVE",
      budgetAmount: 780000,
      currency: "TRY",
      description: "İlçenin tarihi mirasını ve turistik rotalarını tanıtan çok dilli dijital platform.",
      municipalUnit: "Kültür İşleri Müdürlüğü",
      responsibleEmail: "ersel.turan@osmangazi.bel.tr",
    },
  ];

  for (const p of projects) {
    const { responsibleEmail, ...pData } = p;
    await prisma.project.upsert({
      where: { code: p.code },
      update: {
        ...pData,
        responsibleUserId: userMap[responsibleEmail] || userMap["serkan.cebeci@osmangazi.bel.tr"],
      },
      create: {
        ...pData,
        responsibleUserId: userMap[responsibleEmail] || userMap["serkan.cebeci@osmangazi.bel.tr"],
      },
    });
  }

  // 8. Tarihsel Sunum Göstergeleri (Canlı verilerden ayrı korunan sunum karneleri)
  await prisma.historicalSnapshot.createMany({
    data: [
      {
        periodLabel: "2023-2024 Dönemi (Türkçe Sunum)",
        totalApplications: 19,
        partnerCountries: 35,
        projectPartners: 174,
        onlineMeetings: 219,
        inPersonMeetings: 18,
        totalGrantRequested: 1638812,
        currency: "EUR",
        note: "14 Proje, 4 Program ve 1 Ağ üyeliği başvurusu. 1 Proje ve 1 Program olumlu kabul edildi.",
      },
      {
        periodLabel: "2025-2026 Dönemi (Güncel Uluslararası Sunum)",
        totalApplications: 13,
        partnerCountries: 35,
        projectPartners: 174,
        onlineMeetings: 425,
        inPersonMeetings: 38,
        totalGrantRequested: 437556,
        currency: "EUR",
        note: "New European Bauhaus (3), Horizon Europe (4), Erasmus+ (4) ve TÜBİTAK İkili (2) başvuruları.",
      },
    ],
  });

  console.log("✅ Tohumlama tamamlandı!");
}

main()
  .catch((e) => {
    console.error("❌ Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
