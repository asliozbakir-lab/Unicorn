const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const calls = await prisma.fundingCall.findMany({
    include: { fundingProgram: true },
  });

  for (const call of calls) {
    const title = call.title || '';
    const notes = call.notes || '';
    const progCode = call.fundingProgram?.code || '';

    let track = 'HAT_A';
    if (
      title.includes('Kredi') ||
      title.includes('İLBANK') ||
      title.includes('Finansman') ||
      notes.includes('İLBANK') ||
      progCode === 'ILBANK'
    ) {
      track = 'HAT_C';
    } else if (
      title.includes('Eurocities') ||
      title.includes('EaSI') ||
      title.includes('Anket') ||
      title.includes('Ağ') ||
      notes.includes('Eurocities') ||
      progCode === 'EUROCITIES'
    ) {
      track = 'HAT_B';
    }

    const qualityGate = call.deadline && call.sourceUrl ? 'G2' : 'G1';

    await prisma.fundingCall.update({
      where: { id: call.id },
      data: { track, qualityGate },
    });
  }

  console.log(`Classified ${calls.length} funding calls.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
