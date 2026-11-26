import { prisma } from "@/lib/prisma";
import { FundingRadarView } from "@/components/funding/FundingRadarView";

export default async function FundingCallsPage() {
  const [programs, allCalls] = await Promise.all([
    prisma.fundingProgram.findMany({
      include: {
        calls: true,
        subPrograms: true,
        projects: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.fundingCall.findMany({
      include: {
        fundingProgram: true,
      },
      orderBy: { deadline: "asc" },
    }),
  ]);

  const serializedCalls = allCalls.map((c) => ({
    id: c.id,
    title: c.title,
    callCode: c.callCode,
    deadline: c.deadline ? c.deadline.toISOString() : null,
    budgetInfo: c.budgetInfo,
    eligibility: c.eligibility,
    sourceUrl: c.sourceUrl,
    notes: c.notes,
    triageStatus: c.triageStatus,
    triageReason: c.triageReason,
    triageBy: c.triageBy,
    triageAt: c.triageAt ? c.triageAt.toISOString() : null,
    qualityGate: c.qualityGate,
    track: c.track,
    programName: c.fundingProgram?.name || "Fon Programı",
    programCode: c.fundingProgram?.code || null,
  }));

  return <FundingRadarView programs={programs} initialCalls={serializedCalls} />;
}
