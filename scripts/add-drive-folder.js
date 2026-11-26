import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.document.findFirst({
    where: { driveUrl: "https://drive.google.com/drive/folders/1NbO_5Ph8nUrtMpI0t4auipVjippJk3EY" },
  });

  if (existing) {
    console.log("Drive folder already exists with ID:", existing.id);
    return;
  }

  const doc = await prisma.document.create({
    data: {
      name: "Osmangazi Ar-Ge Müdürlüğü Kurumsal Drive Klasörü",
      type: "GOOGLE_DRIVE_FOLDER",
      category: "GOOGLE_DRIVE",
      filePath: "https://drive.google.com/drive/folders/1NbO_5Ph8nUrtMpI0t4auipVjippJk3EY",
      driveUrl: "https://drive.google.com/drive/folders/1NbO_5Ph8nUrtMpI0t4auipVjippJk3EY",
      description: "Müdürlük kurumsal Google Drive ana klasörü: Proje dosyaları, toplantı kayıtları, hibe çağrı formları ve resmî çalışma dökümanları.",
      uploadedBy: "Aslı Ökten",
      version: "v1.0",
    },
  });

  console.log("Successfully added Drive folder document:", doc.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
