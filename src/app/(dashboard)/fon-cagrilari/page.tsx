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
    deadline: c.deadline,
    budgetInfo: c.budgetInfo,
    eligibility: c.eligibility,
    sourceUrl: c.sourceUrl,
    notes: c.notes,
    programName: c.fundingProgram?.name,
    programCode: c.fundingProgram?.code || undefined,
  }));

  return <FundingRadarView programs={programs} allCalls={serializedCalls} />;
}
