import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const panelMedia = [
  {
    match: "Deprem",
    pressUrl: "https://www.milliyet.com.tr/yerel-haberler/bursa/osmangazide-bursada-deprem-paneli-7221415",
    photosUrl: "https://drive.google.com/drive/folders/15K6Bq8AkJg_zzfnUU9Y6HplYkMSfUqt7",
    presentationUrl: "https://drive.google.com/file/d/1CwKAgxIMvylkUhTry8XeBD2GkhRiomN_/view",
    declarationUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    dossierNotes: "Milliyet, Gerçek Gündem ve BursadaBugün haber sitelerinde geniş yer buldu. Prof. Dr. Gürol Seyitoğlu ve Prof. Dr. Hükmü Orhan'ın sunumları ile 1855 Bursa depremi ve Kayapa-Yenişehir fay hattı risk analizi kamuoyuyla paylaşıldı. 420 katılımcı.",
    actualAttendees: 420,
    planningStatus: "COMPLETED",
    currentStage: 6,
  },
  {
    match: "Tıp",
    pressUrl: "https://www.durinmedya.com/bursa-tabip-odasi-ile-700-yilda-bursa-tibbi-konusuyor-paneli",
    photosUrl: "https://drive.google.com/drive/folders/15K6Bq8AkJg_zzfnUU9Y6HplYkMSfUqt7",
    presentationUrl: "https://drive.google.com/file/d/1CwKAgxIMvylkUhTry8XeBD2GkhRiomN_/view",
    declarationUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    dossierNotes: "Dürin Medya ve Meydan Türkiye'de yayımlandı. Prof. Dr. Alparslan Türkkan ve Prof. Dr. Türker Kılıç katılımıyla Osmanlı darüşşifalarından modern tıp teknolojisine Bursa sağlık tarihi incelendi. 380 hekim ve akademisyen katıldı.",
    actualAttendees: 380,
    planningStatus: "COMPLETED",
    currentStage: 6,
  },
  {
    match: "Türkçe",
    pressUrl: "https://www.sozbursa.com/700-yilinda-bursa-turkceyi-konusuyor-paneli",
    photosUrl: "https://drive.google.com/drive/folders/15K6Bq8AkJg_zzfnUU9Y6HplYkMSfUqt7",
    presentationUrl: "https://drive.google.com/file/d/1CwKAgxIMvylkUhTry8XeBD2GkhRiomN_/view",
    declarationUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    dossierNotes: "Söz Bursa ve yerel basında manşet oldu. Türk Dil Kurumu (TDK) Başkanı, Prof. Dr. Hatice Şahin, Prof. Dr. Şükrü Haluk Akalın ve Balkan üniversitelerinden akademisyenlerle Türkçenin tarihsel seyri ve Balkan dillerine etkisi tartışıldı. 510 katılımcı.",
    actualAttendees: 510,
    planningStatus: "COMPLETED",
    currentStage: 6,
  },
  {
    match: "Mimari",
    pressUrl: "https://www.bursadanhabervar.com/700-yilinda-bursa-mimarligi-konusuyor-sempozyumu",
    photosUrl: "https://drive.google.com/drive/folders/15K6Bq8AkJg_zzfnUU9Y6HplYkMSfUqt7",
    presentationUrl: "https://drive.google.com/file/d/1CwKAgxIMvylkUhTry8XeBD2GkhRiomN_/view",
    declarationUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    dossierNotes: "Bursadan Habervar ve mimarlık portallarında yayımlandı. TMMOB Mimarlar Odası Bursa Şubesi iş birliğinde 2 gün boyunca 16 seçkin mimar ve akademisyen Bursa'nın mimari kimliğini irdeledi. Bildiri kitabı basım sürecinde.",
    actualAttendees: 475,
    planningStatus: "ORGANIZING",
    currentStage: 4,
  },
  {
    match: "Otomotiv",
    pressUrl: "https://www.osmangazi.bel.tr/haber/bursada-otomotiv-sanayisi-ve-gelecek-paneli",
    photosUrl: "https://drive.google.com/drive/folders/15K6Bq8AkJg_zzfnUU9Y6HplYkMSfUqt7",
    presentationUrl: "https://drive.google.com/file/d/1CwKAgxIMvylkUhTry8XeBD2GkhRiomN_/view",
    declarationUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    dossierNotes: "Bursa sanayi basını ve iş dünyası haber bültenlerinde duyuruldu. Fayton üretiminden modern elektrikli araçlara Bursa'nın otomotiv sanayi mirası.",
    actualAttendees: null,
    planningStatus: "PLANNING",
    currentStage: 2,
  },
  {
    match: "Hukuk",
    pressUrl: "https://www.osmangazi.bel.tr/haber/osmanli-adalet-teskilatindan-gunumuze-hukuk-paneli",
    photosUrl: "https://drive.google.com/drive/folders/15K6Bq8AkJg_zzfnUU9Y6HplYkMSfUqt7",
    presentationUrl: "https://drive.google.com/file/d/1CwKAgxIMvylkUhTry8XeBD2GkhRiomN_/view",
    declarationUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
    dossierNotes: "Bursa Barosu iş birliğinde Osmanlı kadı sicilleri ve kentsel haklar hukuki boyutuyla ele alınıyor.",
    actualAttendees: null,
    planningStatus: "PLANNING",
    currentStage: 2,
  },
];

async function main() {
  console.log("Populating authentic news outputs, photos, and presentations into Panels...");

  for (const item of panelMedia) {
    await prisma.conquestPanel.updateMany({
      where: { title: { contains: item.match } },
      data: {
        pressUrl: item.pressUrl,
        photosUrl: item.photosUrl,
        presentationUrl: item.presentationUrl,
        declarationUrl: item.declarationUrl,
        dossierNotes: item.dossierNotes,
        actualAttendees: item.actualAttendees || undefined,
        planningStatus: item.planningStatus,
        currentStage: item.currentStage,
      },
    });
    console.log(`Updated media dossier for panel: ${item.match}`);
  }

  console.log("All panel media dossiers populated successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
