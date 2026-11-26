import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Plus, FolderKanban, ArrowUpRight, Printer } from "lucide-react";
import { formatCurrency, CATEGORY_LABELS, PHASE_LABELS } from "@/lib/utils";
import { canCreateProject } from "@/lib/permissions";
import { ProjectPrintButton } from "@/components/projects/ProjectPrintButton";
import type { ExportProjectData } from "@/lib/export-utils";

interface ProjectsPageProps {
  searchParams: Promise<{
    kategori?: string;
    ara?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const user = await getCurrentUser();
  const { kategori, ara } = await searchParams;

  const whereClause: any = {
    deletedAt: null,
  };

  if (kategori && ["INTERNATIONAL", "NATIONAL", "CORPORATE", "INTERNAL"].includes(kategori)) {
    whereClause.category = kategori;
  }

  if (ara) {
    whereClause.OR = [
      { name: { contains: ara } },
      { code: { contains: ara } },
      { description: { contains: ara } },
    ];
  }

  const projects = await prisma.project.findMany({
    where: whereClause,
    include: {
      responsibleUser: true,
      partnerships: { include: { organization: { include: { country: true } } } },
      fundingProgram: true,
      tasks: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const canAdd = canCreateProject(user);

  const categories = [
    { key: "", label: "Tüm Projeler" },
    { key: "INTERNATIONAL", label: "Uluslararası Projeler" },
    { key: "NATIONAL", label: "Ulusal Projeler" },
    { key: "CORPORATE", label: "Kurumsal Projeler" },
    { key: "INTERNAL", label: "Kurum İçi Projeler" },
  ];

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Yeni Ekle / Toplu Çıktı */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Proje Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Müdürlüğün 4 ana kategorideki tüm projelerinin portföyü, özet çıktıları ve operasyonel takibi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={kategori ? `/raporlar?kategori=${kategori}` : "/raporlar"}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#0B4F3A]/30 bg-white hover:bg-[#0B4F3A]/5 text-[#0B4F3A] text-xs font-bold shadow-2xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Toplu Çıktı / Rapor Al</span>
          </Link>

          {canAdd && (
            <Link
              href="/projeler/yeni"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B4F3A] hover:bg-[#083c2c] text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Proje Kaydı</span>
            </Link>
          )}
        </div>
      </div>

      {/* Kategori Filtre Sekmeleri */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {categories.map((c) => {
          const isActive = (kategori || "") === c.key;
          return (
            <Link
              key={c.key}
              href={c.key ? `/projeler?kategori=${c.key}` : "/projeler"}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? "bg-[#0B4F3A] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* Projeler Kart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
            <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800">Proje Bulunamadı</h3>
            <p className="text-xs text-slate-500 mt-1">Bu filtre kriterine uygun kayıt mevcut değil.</p>
          </div>
        ) : (
          projects.map((proj) => {
            const cat = CATEGORY_LABELS[proj.category] || CATEGORY_LABELS.INTERNATIONAL;
            const ph = PHASE_LABELS[proj.phase] || PHASE_LABELS.ACTIVE;

            const exportData: ExportProjectData = {
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
            };

            return (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group osmangazi-card"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-mono font-semibold text-slate-400">
                      {proj.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cat.bg} ${cat.color}`}>
                      {cat.label}
                    </span>
                  </div>

                  <Link
                    href={`/projeler/${proj.id}`}
                    className="text-base font-bold text-slate-900 group-hover:text-[#0B4F3A] transition line-clamp-1"
                  >
                    {proj.name}
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {proj.description || "Açıklama girilmedi."}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Aşama:</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${ph.badge}`}>
                        {ph.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Bütçe:</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(proj.budgetAmount, proj.currency)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Sorumlu:</span>
                      <span className="text-slate-700 truncate max-w-[150px]">
                        {proj.responsibleUser?.name || "Atanmadı"}
                      </span>
                    </div>

                    {proj.partnerships.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Ortaklar:</span>
                        <span className="text-[#0B4F3A] font-semibold text-[11px]">
                          {proj.partnerships.length} Kurum
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 truncate">
                    {proj.fundingProgram?.name || proj.municipalUnit || "Osmangazi Ar-Ge"}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <ProjectPrintButton project={exportData} compact />
                    <Link
                      href={`/projeler/${proj.id}`}
                      className="text-xs font-semibold text-[#0B4F3A] hover:text-[#083c2c] flex items-center gap-1 transition"
                    >
                      <span>Detay</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
