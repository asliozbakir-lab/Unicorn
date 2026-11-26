import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const q = (request.nextUrl.searchParams.get("q") || "").trim();

  if (!q) {
    const [recentProjects, urgentCalls] = await Promise.all([
      prisma.project.findMany({
        where: { deletedAt: null },
        take: 4,
        orderBy: { updatedAt: "desc" },
        select: { id: true, code: true, name: true, category: true },
      }),
      prisma.fundingCall.findMany({
        where: { triageStatus: { in: ["NEW", "SHORTLISTED"] } },
        take: 4,
        orderBy: { deadline: "asc" },
        select: { id: true, callCode: true, title: true, triageStatus: true },
      }),
    ]);

    return NextResponse.json({
      projects: recentProjects,
      calls: urgentCalls,
      panels: [],
      cities: [],
      documents: [],
    });
  }

  const [projects, calls, panels, cities, documents] = await Promise.all([
    prisma.project.findMany({
      where: {
        deletedAt: null,
        OR: [
          { name: { contains: q } },
          { code: { contains: q } },
          { description: { contains: q } },
        ],
      },
      take: 5,
      select: { id: true, code: true, name: true, category: true },
    }),
    prisma.fundingCall.findMany({
      where: {
        triageStatus: { not: "DISMISSED" },
        OR: [
          { title: { contains: q } },
          { callCode: { contains: q } },
          { notes: { contains: q } },
        ],
      },
      take: 5,
      select: { id: true, callCode: true, title: true, triageStatus: true },
    }),
    prisma.conquestPanel.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { institution: { contains: q } },
        ],
      },
      take: 4,
      select: { id: true, title: true, institution: true },
    }),
    prisma.sisterCity.findMany({
      where: {
        OR: [
          { cityName: { contains: q } },
          { countryName: { contains: q } },
        ],
      },
      take: 4,
      select: { id: true, cityName: true, countryName: true, flagEmoji: true },
    }),
    prisma.document.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
        ],
      },
      take: 4,
      select: { id: true, name: true, category: true, driveUrl: true },
    }),
  ]);

  return NextResponse.json({ projects, calls, panels, cities, documents });
}
