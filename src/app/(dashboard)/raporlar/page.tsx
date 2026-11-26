import { prisma } from "@/lib/prisma";
import { PortfolioReportStudio } from "@/components/reports/PortfolioReportStudio";
import type { ExportProjectData } from "@/lib/export-utils";

interface ReportsPageProps {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const { kategori } = await searchParams;

  const [projects, activeCallsCount, shortlistedCallsCount, panelsCount, sisterCitiesCount] =
    await Promise.all([
      prisma.project.findMany({
        where: { deletedAt: null },
        include: {
          responsibleUser: true,
          fundingProgram: true,
          partnerships: {
            include: {
              organization: { include: { country: true } },
            },
          },
          tasks: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.fundingCall.count({ where: { triageStatus: "NEW" } }),
      prisma.fundingCall.count({ where: { triageStatus: "SHORTLISTED" } }),
      prisma.conquestPanel.count(),
      prisma.sisterCity.count(),
    ]);

  const serializedProjects: ExportProjectData[] = projects.map((proj) => ({
    id: proj.id,
    code: proj.code,
    name: proj.name,
    category: proj.category,
    phase: proj.phase,
    budgetAmount: proj.budgetAmount,
    currency: proj.currency,
    coordinatorOrg: proj.coordinatorOrg,
    municipalUnit: proj.municipalUnit,
    description: proj.description,
    objectives: proj.objectives,
    startDate: proj.startDate ? proj.startDate.toISOString() : null,
    endDate: proj.endDate ? proj.endDate.toISOString() : null,
    responsibleUserName: proj.responsibleUser?.name || null,
    responsibleUserTitle: proj.responsibleUser?.title || null,
    fundingProgramName: proj.fundingProgram?.name || null,
    fundingProgramProvider: proj.fundingProgram?.provider || null,
    partnerships: proj.partnerships.map((p) => ({
      organizationName: p.organization.name,
      countryName: p.organization.country.name,
      type: p.organization.type,
      role: p.role,
    })),
    tasksCount: proj.tasks.length,
  }));

  return (
    <PortfolioReportStudio
      projects={serializedProjects}
      initialCategory={kategori || "ALL"}
      stats={{
        activeCallsCount,
        shortlistedCallsCount,
        panelsCount,
        sisterCitiesCount,
      }}
    />
  );
}
