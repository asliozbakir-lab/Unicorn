import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const panelDetails = [
  {
    titleMatch: "Mimari",
    currentStage: 4,
    planningStatus: "ORGANIZING",
    budget: 85000,
    expectedAttendees: 450,
    actualAttendees: null,
    driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    checklist: [
      { id: 1, title: "Konsept & Oda Mutabakatı", desc: "TMMOB Mimarlar Odası ile 2 günlük büyük sempozyum çerçevesi onaylandı.", status: "COMPLETED", date: "15.01.2026" },
      { id: 2, title: "Moderatör & Panelist Davetleri", desc: "16 seçkin mimar ve akademisyenin teyitleri alındı (Prof. Dr. Nevzat Oğuz Özer vb.).", status: "COMPLETED", date: "02.02.2026" },
      { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Panorama 1326 Bursa Fetih Müzesi Ana Konferans Salonu 9-10 Ekim için tahsis edildi.", status: "COMPLETED", date: "20.02.2026" },
      { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Afiş tasarımları, davetiyeler, basın bülteni ve sosyal medya lansman planı hazırlanıyor.", status: "IN_PROGRESS", date: "Devam Ediyor" },
      { id: 5, title: "Panel Oturum İcrası", desc: "Canlı yayın, protokol karşılama ve kayıt masası organizasyonu.", status: "PENDING", date: "09.10.2026" },
      { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Sempozyum bildiri kitabı basımı, video arşivi ve anket analizleri.", status: "PENDING", date: "Ekim 2026" },
    ],
  },
  {
    titleMatch: "Tıp",
    currentStage: 3,
    planningStatus: "ORGANIZING",
    budget: 65000,
    expectedAttendees: 350,
    actualAttendees: null,
    driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    checklist: [
      { id: 1, title: "Konsept & Oda Mutabakatı", desc: "TTB Bursa Tabip Odası ile Osmanlı Darüşşifalarından modern hekimliğe çerçeve belirlendi.", status: "COMPLETED", date: "20.01.2026" },
      { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Prof. Dr. Alparslan Türkkan, Prof. Dr. Türker Kılıç ve heyet konuşmacı teyitleri alındı.", status: "COMPLETED", date: "10.02.2026" },
      { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Panorama 1326 veya Ördekli salon rezervasyonu ve ses/canlı yayın altyapısı inceleniyor.", status: "IN_PROGRESS", date: "Devam Ediyor" },
      { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Tıp tarihi afişi ve sağlık camiası resmî davetiye dağıtımı.", status: "PENDING", date: "Eylül 2026" },
      { id: 5, title: "Panel Oturum İcrası", desc: "20 Kasım 2026 panel icrası ve kayıt yönetimi.", status: "PENDING", date: "20.11.2026" },
      { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Bursa Tıp Tarihi bildirisi ve katılımcı hekim verilerinin toplanması.", status: "PENDING", date: "Kasım 2026" },
    ],
  },
  {
    titleMatch: "Deprem",
    currentStage: 3,
    planningStatus: "ORGANIZING",
    budget: 70000,
    expectedAttendees: 400,
    actualAttendees: null,
    driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    checklist: [
      { id: 1, title: "Konsept & Oda Mutabakatı", desc: "TMMOB Jeoloji Mühendisleri Odası & JEMİRKO ile fay hatları ve tarihsel depremler konsepti kuruldu.", status: "COMPLETED", date: "18.01.2026" },
      { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Prof. Dr. Hükmü Orhan, Prof. Dr. Neslihan Dostoğlu, Prof. Dr. Gürol Seyitoğlu teyitleri alındı.", status: "COMPLETED", date: "05.02.2026" },
      { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Panorama 1326 Müzesi salon tahsisi ve teknik sunum ekranları organizasyonu sürüyor.", status: "IN_PROGRESS", date: "Devam Ediyor" },
      { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "1855 Bursa Küçük Kıyamet Depremi temalı afiş ve broşür tasarımı.", status: "PENDING", date: "Ağustos 2026" },
      { id: 5, title: "Panel Oturum İcrası", desc: "23 Ekim 2026 panel oturumu ve AFAD/STK temsilcileri katılımı.", status: "PENDING", date: "23.10.2026" },
      { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Bursa Deprem Dirençlilik Eylem Planı raporu çıktısı.", status: "PENDING", date: "Ekim 2026" },
    ],
  },
  {
    titleMatch: "Türkçe",
    currentStage: 4,
    planningStatus: "ORGANIZING",
    budget: 90000,
    expectedAttendees: 500,
    actualAttendees: null,
    driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    checklist: [
      { id: 1, title: "Konsept & Oda Mutabakatı", desc: "Türk Dil Kurumu (TDK) ve Bursa Uludağ Üniversitesi ile resmî protokol imzalandı.", status: "COMPLETED", date: "10.01.2026" },
      { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Prof. Dr. Hatice Şahin, Prof. Dr. Şükrü Haluk Akalın ve Balkan akademisyenleri teyit etti.", status: "COMPLETED", date: "28.01.2026" },
      { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Yurtdışı konukların uçuş/konaklama rezervasyonları ve Ördekli KM salonu planlandı.", status: "COMPLETED", date: "15.02.2026" },
      { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Türkçe Dil Bayramı ve Fetih paneli kurumsal tanıtım hazırlıkları sürüyor.", status: "IN_PROGRESS", date: "Devam Ediyor" },
      { id: 5, title: "Panel Oturum İcrası", desc: "14 Mayıs 2026 uluslararası oturum ve bildiri sunumları.", status: "PENDING", date: "14.05.2026" },
      { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "TDK onaylı 700. Yıl Bursa ve Türk Dili Bildiri Kitabı basımı.", status: "PENDING", date: "Haziran 2026" },
    ],
  },
  {
    titleMatch: "Otomotiv",
    currentStage: 2,
    planningStatus: "PLANNING",
    budget: 50000,
    expectedAttendees: 300,
    actualAttendees: null,
    driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    checklist: [
      { id: 1, title: "Konsept & Oda Mutabakatı", desc: "Bursa Rotary Kulübü ve otomotiv sanayicileriyle içerik mutabakatı yapıldı.", status: "COMPLETED", date: "25.01.2026" },
      { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Tamer Esigül ve yerli otomotiv/TOGG & OİB temsilcileriyle görüşmeler sürüyor.", status: "IN_PROGRESS", date: "Devam Ediyor" },
      { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Merinos AKKM veya Panorama 1326 salon opsiyonları değerlendiriliyor.", status: "PENDING", date: "Mart 2026" },
      { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Faytonlardan elektrikli araçlara Bursa otomotiv sanayisi tanıtımı.", status: "PENDING", date: "Nisan 2026" },
      { id: 5, title: "Panel Oturum İcrası", desc: "25 Nisan 2026 panel organizasyonu.", status: "PENDING", date: "25.04.2026" },
      { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Otomotiv dönüşüm raporu ve sanayi envanteri veri girişi.", status: "PENDING", date: "Mayıs 2026" },
    ],
  },
  {
    titleMatch: "Hukuk",
    currentStage: 2,
    planningStatus: "PLANNING",
    budget: 45000,
    expectedAttendees: 250,
    actualAttendees: null,
    driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    checklist: [
      { id: 1, title: "Konsept & Oda Mutabakatı", desc: "Bursa Barosu ile Osmanlı adalet teşkilatı ve modern kent hukuku teması belirlendi.", status: "COMPLETED", date: "22.01.2026" },
      { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Sefa Başkan ve Dr. Öğr. Üyesi Yasemin Kurtoğlu ile oturum başlıkları netleştiriliyor.", status: "IN_PROGRESS", date: "Devam Ediyor" },
      { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Bursa Adalet Sarayı Konferans Salonu veya Ördekli KM.", status: "PENDING", date: "Nisan 2026" },
      { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Hukukçulara özel davetiye ve basın bilgilendirme.", status: "PENDING", date: "Mayıs 2026" },
      { id: 5, title: "Panel Oturum İcrası", desc: "Hukuk tarihi oturumunun icrası.", status: "PENDING", date: "2026 Güz" },
      { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Bursa Kadı Sicilleri ve Adalet Mirası tebliğleri yayını.", status: "PENDING", date: "2026 Kış" },
    ],
  },
  {
    titleMatch: "Çevre ve Su",
    currentStage: 2,
    planningStatus: "PLANNING",
    budget: 55000,
    expectedAttendees: 300,
    actualAttendees: null,
    driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    checklist: [
      { id: 1, title: "Konsept & Oda Mutabakatı", desc: "Çevre Mühendisleri Odası (Rüveyşa Hanım) ile Nilüfer Çayı ve Uludağ su havzaları çerçevesi kuruldu.", status: "COMPLETED", date: "05.02.2026" },
      { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Su yönetimi uzmanları ve iklim eylem komisyonu konuşmacı listesi hazırlanıyor.", status: "IN_PROGRESS", date: "Devam Ediyor" },
      { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Panorama 1326 salon planlaması.", status: "PENDING", date: "Haziran 2026" },
      { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Çevre haftası ve su temalı afiş/tanıtım.", status: "PENDING", date: "Ağustos 2026" },
      { id: 5, title: "Panel Oturum İcrası", desc: "Eylül 2026 çevre ve su sempozyumu.", status: "PENDING", date: "Eylül 2026" },
      { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Osmangazi Su Dirençliliği Raporu.", status: "PENDING", date: "Ekim 2026" },
    ],
  },
  {
    titleMatch: "Gastronomi",
    currentStage: 2,
    planningStatus: "PLANNING",
    budget: 60000,
    expectedAttendees: 400,
    actualAttendees: null,
    driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    checklist: [
      { id: 1, title: "Konsept & Oda Mutabakatı", desc: "BTSO ve GastroFest komitesiyle saray mutfağı ve coğrafi işaretli ürünler mutabakatı sağlandı.", status: "COMPLETED", date: "12.02.2026" },
      { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Geleneksel lezzet ustaları ve gıda tarihçileri davet listesi oluşturuluyor.", status: "IN_PROGRESS", date: "Devam Ediyor" },
      { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "GastroFest alanında açık hava ve salon oturumu entegrasyonu.", status: "PENDING", date: "Temmuz 2026" },
      { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Gastronomi rotası haritası ve lezzet paneli lansmanı.", status: "PENDING", date: "Ağustos 2026" },
      { id: 5, title: "Panel Oturum İcrası", desc: "Canlı tadım ve tarihsel mutfak paneli.", status: "PENDING", date: "Eylül 2026" },
      { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Bursa Lezzet Mirası Arşivi.", status: "PENDING", date: "Ekim 2026" },
    ],
  },
  {
    titleMatch: "Gıda",
    currentStage: 2,
    planningStatus: "PLANNING",
    budget: 50000,
    expectedAttendees: 300,
    actualAttendees: null,
    driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    checklist: [
      { id: 1, title: "Konsept & Oda Mutabakatı", desc: "Gıda Mühendisleri Odası ve Gazi Tarım A.Ş. ile tarımsal kalkınma çerçevesi kuruldu.", status: "COMPLETED", date: "14.02.2026" },
      { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Food Trails temsilcileri ve yerel kooperatif başkanlarıyla temas kuruluyor.", status: "IN_PROGRESS", date: "Devam Ediyor" },
      { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Ördekli Kültür Merkezi salon planı.", status: "PENDING", date: "Mayıs 2026" },
      { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Gıda güvencesi ve tarım politikası duyurusu.", status: "PENDING", date: "Haziran 2026" },
      { id: 5, title: "Panel Oturum İcrası", desc: "Temmuz 2026 panel icrası.", status: "PENDING", date: "Temmuz 2026" },
      { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Sürdürülebilir Tarım ve Gıda Eylem Raporu.", status: "PENDING", date: "Ağustos 2026" },
    ],
  },
  {
    titleMatch: "Ticaret",
    currentStage: 2,
    planningStatus: "PLANNING",
    budget: 60000,
    expectedAttendees: 350,
    actualAttendees: null,
    driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    checklist: [
      { id: 1, title: "Konsept & Oda Mutabakatı", desc: "MARSİFED ve Osman Akın ile İpek Yolu'ndan e-ticarete ticaret tarihi mutabakatı yapıldı.", status: "COMPLETED", date: "16.02.2026" },
      { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Tarihi çarşı dernekleri ve sanayici iş dünyası konuşmacılarıyla görüşülüyor.", status: "IN_PROGRESS", date: "Devam Ediyor" },
      { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Bursa Ticaret Borsası Konferans Salonu.", status: "PENDING", date: "Ağustos 2026" },
      { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Hanlar Bölgesi esnafı ve iş dünyası davetiyeleri.", status: "PENDING", date: "Ekim 2026" },
      { id: 5, title: "Panel Oturum İcrası", desc: "Kasım 2026 panel oturumu.", status: "PENDING", date: "Kasım 2026" },
      { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Bursa Ticaret Mirası Bildirgesi.", status: "PENDING", date: "Aralık 2026" },
    ],
  },
  {
    titleMatch: "Göç",
    currentStage: 2,
    planningStatus: "PLANNING",
    budget: 65000,
    expectedAttendees: 450,
    actualAttendees: null,
    driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    checklist: [
      { id: 1, title: "Konsept & Oda Mutabakatı", desc: "TİKA, YTB ve Bal-Göç Genel Merkezi ile Balkan göçü ve kültürel kimlik mutabakatı yapıldı.", status: "COMPLETED", date: "18.02.2026" },
      { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Balkan göçmen dernekleri ve göç sosyologlarıyla konuşmacı listesi oluşturuluyor.", status: "IN_PROGRESS", date: "Devam Ediyor" },
      { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Panorama 1326 Bursa Fetih Müzesi.", status: "PENDING", date: "Eylül 2026" },
      { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Balkanlar ve Bursa göç tarihi sergisi ve panel tanıtımı.", status: "PENDING", date: "Kasım 2026" },
      { id: 5, title: "Panel Oturum İcrası", desc: "Aralık 2026 anma paneli icrası.", status: "PENDING", date: "Aralık 2026" },
      { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Balkan Göçü ve Bursa Demografisi Kitabı.", status: "PENDING", date: "Ocak 2027" },
    ],
  },
];

async function main() {
  console.log("Enhancing Conquest Panels with detailed preparation stages and checklist workflows...");

  const allPanels = await prisma.conquestPanel.findMany();

  for (const panel of allPanels) {
    const detail = panelDetails.find((d) => panel.title.toLowerCase().includes(d.titleMatch.toLowerCase()));
    if (detail) {
      await prisma.conquestPanel.update({
        where: { id: panel.id },
        data: {
          currentStage: detail.currentStage,
          planningStatus: detail.planningStatus,
          budget: detail.budget,
          expectedAttendees: detail.expectedAttendees,
          driveFolderUrl: detail.driveFolderUrl,
          checklist: JSON.stringify(detail.checklist),
        },
      });
      console.log(`Updated panel: ${panel.title} (Stage ${detail.currentStage}/6)`);
    } else {
      // Default 6-stage template for any other panel
      const defaultChecklist = [
        { id: 1, title: "Konsept & Oda Mutabakatı", desc: "İlgili kurumla tema ve çerçeve belirlenmesi.", status: "COMPLETED", date: "Ocak 2026" },
        { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Konuşmacı onay süreci.", status: "IN_PROGRESS", date: "Şubat 2026" },
        { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Salon ve teknik altyapı planı.", status: "PENDING", date: "Tarih bekliyor" },
        { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Kurumsal afiş ve basın bülteni.", status: "PENDING", date: "Tarih bekliyor" },
        { id: 5, title: "Panel Oturum İcrası", desc: "Oturum yönetimi ve kayıt.", status: "PENDING", date: "Tarih bekliyor" },
        { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Sonuç raporu ve bildiri arşivi.", status: "PENDING", date: "Tarih bekliyor" },
      ];
      await prisma.conquestPanel.update({
        where: { id: panel.id },
        data: {
          currentStage: 2,
          planningStatus: "PLANNING",
          checklist: JSON.stringify(defaultChecklist),
          driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
        },
      });
    }
  }

  console.log("All panels updated successfully with preparation stages!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
