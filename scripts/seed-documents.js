import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating Sister Cities with official logos...");
  const logoMap = {
    "Şuşa": "/logos/cities/susa.svg",
    "Doboj (Doboy)": "/logos/cities/doboj.svg",
    "Stari Grad (Saraybosna)": "/logos/cities/stari-grad.svg",
    "Kırcaali": "/logos/cities/kircaali.svg",
    "Omurtag": "/logos/cities/omurtag.svg",
    "Kozlukebir (Arriana)": "/logos/cities/kozlukebir.svg",
    "Konayev (Kapşagay)": "/logos/cities/konayev.svg",
    "Arhangay": "/logos/cities/arhangay.svg",
    "Mamuşa": "/logos/cities/mamusa.svg",
    "Gazimağusa": "/logos/cities/gazimagusa.svg",
    "Keles": "/logos/cities/keles.svg",
  };

  for (const [cityName, logoUrl] of Object.entries(logoMap)) {
    await prisma.sisterCity.updateMany({
      where: { cityName: { contains: cityName.split(" ")[0] } },
      data: { logoUrl },
    });
  }

  console.log("Seeding authentic Google Drive & Institutional Documents in Belgeler...");
  await prisma.document.deleteMany();

  const sampleDocs = [
    {
      name: "700. Yıl Panelleri Planlama ve Organizasyon Tablosu",
      type: "GOOGLE_SHEET",
      category: "GOOGLE_DRIVE",
      filePath: "https://docs.google.com/spreadsheets/d/1MZUwi7nLoTlF1Zhh6pyqYJPC2zjJCee5/edit?gid=935211470#gid=935211470",
      driveUrl: "https://docs.google.com/spreadsheets/d/1MZUwi7nLoTlF1Zhh6pyqYJPC2zjJCee5/edit?gid=935211470#gid=935211470",
      description: "Bursa'nın Fethi 700. Yıl Anma Panelleri: 11 ana tema, kurumlar, moderatörler, panelistler ve planlama takvimi.",
      uploadedBy: "Aslı Ökten",
      version: "v2.4",
    },
    {
      name: "Osmangazi Belediyesi Kardeş Şehirler Protokol ve Envanter Tablosu",
      type: "GOOGLE_SHEET",
      category: "GOOGLE_DRIVE",
      filePath: "https://docs.google.com/spreadsheets/d/15BtaHXcjbDZdeNhQB6WVG8U7eD9seXb1/edit?gid=1819972676#gid=1819972676",
      driveUrl: "https://docs.google.com/spreadsheets/d/15BtaHXcjbDZdeNhQB6WVG8U7eD9seXb1/edit?gid=1819972676#gid=1819972676",
      description: "11 kardeş şehrin meclis onay tarihleri, protokol kapsamları, resmi armaları ve temas yetkilileri.",
      uploadedBy: "Aslı Ökten",
      version: "v1.8",
    },
    {
      name: "Üyesi Olunan Ulusal ve Uluslararası Birlikler ve Ağlar",
      type: "GOOGLE_SHEET",
      category: "GOOGLE_DRIVE",
      filePath: "https://docs.google.com/spreadsheets/d/1p72tSYIOTjc1ZdQdxifjakvwDf2pCP0e/edit?usp=drive_web&ouid=116633464378944499170&rtpof=true",
      driveUrl: "https://docs.google.com/spreadsheets/d/1p72tSYIOTjc1ZdQdxifjakvwDf2pCP0e/edit?usp=drive_web&ouid=116633464378944499170&rtpof=true",
      description: "Eurocities, UCLG-MEWA, TBB, MBB, TKB, CIVITAS ve IPC platformlarındaki kurumsal üyelikler ve meclis temsilci listeleri.",
      uploadedBy: "Aslı Ökten",
      version: "v1.2",
    },
    {
      name: "Osmangazi Ar-Ge 2025-2026 Proje Portföyü ve Stratejik Fon Rehberi",
      type: "GOOGLE_DOC",
      category: "GOOGLE_DRIVE",
      filePath: "https://docs.google.com/document/d/1_osmangazi_arge_stratejik_plan_2026/edit",
      driveUrl: "https://docs.google.com/document/d/1_osmangazi_arge_stratejik_plan_2026/edit",
      description: "Müdürlüğün Horizon Europe, NEB, INTERREG ve Ulusal kalkınma ajansı hibelerine yönelik 2 yıllık eylem planı.",
      uploadedBy: "Serkan Cebeci",
      version: "v3.0",
    },
    {
      name: "Horizon Europe Konsorsiyum Ortaklık Anlaşmaları ve Niyet Mektupları (LoI)",
      type: "GOOGLE_DRIVE_FOLDER",
      category: "GOOGLE_DRIVE",
      filePath: "https://drive.google.com/drive/folders/1_osmangazi_arge_horizon_consortium",
      driveUrl: "https://drive.google.com/drive/folders/1_osmangazi_arge_horizon_consortium",
      description: "35 partner ülke ve 174 konsorsiyum ortağı ile yürütülen AB hibe projeleri ortaklık niyet mektupları arşivi.",
      uploadedBy: "İpek Çınar",
      version: "v2.0",
    },
    {
      name: "Bursa Tarihi Çarşı ve Hanlar Bölgesi Eko-Turizm Eylem Planı Raporu",
      type: "REPORT",
      category: "REPORT",
      filePath: "https://docs.google.com/document/d/1_osmangazi_hanlar_bolgesi_raporu/edit",
      driveUrl: "https://docs.google.com/document/d/1_osmangazi_hanlar_bolgesi_raporu/edit",
      description: "UNESCO Dünya Mirası alanı olan Hanlar Bölgesi sürdürülebilir turizm ve akıllı yönlendirme analiz raporu.",
      uploadedBy: "Berkay Salman",
      version: "v1.0",
    },
    {
      name: "Grant Agreement Sözleşme ve Zeyilname (Amendment) Arşivi",
      type: "CONTRACT",
      category: "CONTRACT",
      filePath: "https://drive.google.com/drive/folders/1_osmangazi_arge_grant_agreements",
      driveUrl: "https://drive.google.com/drive/folders/1_osmangazi_arge_grant_agreements",
      description: "Avrupa Komisyonu ve TÜBİTAK onaylı resmi hibe sözleşmeleri, bütçe onayları ve banka teminatları.",
      uploadedBy: "Ece Elçi",
      version: "v1.5",
    },
    {
      name: "Sayıştay ve İç Denetim Hazırlık Dosyası (2024-2025)",
      type: "REPORT",
      category: "REPORT",
      filePath: "https://drive.google.com/drive/folders/1_osmangazi_sayistay_denetim",
      driveUrl: "https://drive.google.com/drive/folders/1_osmangazi_sayistay_denetim",
      description: "Ar-Ge harcamaları, seyahat giderleri, personel zaman çizelgeleri ve hibe muhasebeleştirme evrakları.",
      uploadedBy: "Ersel Turan",
      version: "v2.1",
    },
  ];

  for (const doc of sampleDocs) {
    await prisma.document.create({
      data: doc,
    });
  }

  console.log("Documents seeded successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
