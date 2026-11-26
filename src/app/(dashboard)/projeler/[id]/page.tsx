import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canArchiveProject } from "@/lib/permissions";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Coins,
  Globe2,
  User,
  Archive,
  CheckCircle2,
  Layers,
  FileText,
} from "lucide-react";
import { formatCurrency, formatDate, CATEGORY_LABELS, PHASE_LABELS } from "@/lib/utils";
import { ArchiveProjectButton } from "@/components/projects/ArchiveProjectButton";
import { ProjectPrintButton } from "@/components/projects/ProjectPrintButton";
import type { ExportProjectData } from "@/lib/export-utils";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      responsibleUser: true,
      fundingProgram: true,
      partnerships: {
        include: {
          organization: {
            include: { country: true },
          },
        },
      },
      tasks: {
        include: { assignedUser: true },
        orderBy: { dueDate: "asc" },
      },
      documents: true,
      applications: {
        include: { fundingCall: true },
      },
    },
  });

  if (!project || project.deletedAt) {
    notFound();
  }

  const cat = CATEGORY_LABELS[project.category] || CATEGORY_LABELS.INTERNATIONAL;
  const ph = PHASE_LABELS[project.phase] || PHASE_LABELS.ACTIVE;
  const canArchive = canArchiveProject(user);

  const exportData: ExportProjectData = {
    id: project.id,
    code: project.code,
    name: project.name,
    category: project.category,
    phase: project.phase,
    budgetAmount: project.budgetAmount,
    currency: project.currency,
    coordinatorOrg: project.coordinatorOrg,
    municipalUnit: project.municipalUnit,
    description: project.description,
    objectives: project.objectives,
    startDate: project.startDate ? project.startDate.toISOString() : null,
    endDate: project.endDate ? project.endDate.toISOString() : null,
    responsibleUserName: project.responsibleUser?.name || null,
    responsibleUserTitle: project.responsibleUser?.title || null,
    fundingProgramName: project.fundingProgram?.name || null,
    fundingProgramProvider: project.fundingProgram?.provider || null,
    partnerships: project.partnerships.map((p) => ({
      organizationName: p.organization.name,
      countryName: p.organization.country.name,
      type: p.organization.type,
      role: p.role,
    })),
    tasksCount: project.tasks.length,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Üst Navigasyon */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/projeler"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0B4F3A] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tüm Projelere Dön</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <ProjectPrintButton project={exportData} />
          {canArchive && (
            <ArchiveProjectButton projectId={project.id} />
          )}
        </div>
      </div>

      {/* Proje Başlık Kartı */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
            {project.code}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${cat.bg} ${cat.color}`}>
            {cat.label}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${ph.badge}`}>
            {ph.label}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {project.name}
        </h1>

        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          {project.description || "Bu proje için henüz detaylı bir açıklama girilmemiştir."}
        </p>

        {project.objectives && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Temel Hedefler & Çıktılar
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">{project.objectives}</p>
          </div>
        )}
      </div>

      {/* 2 Sütunlu Bilgi Izgarası */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sol 2 Sütun: Ortaklar, Fon ve Başvurular */}
        <div className="md:col-span-2 space-y-6">
          {/* Ortaklar Konsorsiyumu */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#176C55]" />
                <h3 className="text-sm font-bold text-slate-900">Konsorsiyum & Ortak Kurumlar</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {project.partnerships.length} Ortak
              </span>
            </div>

            {project.partnerships.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Bu projeye henüz tanımlı dış ortak bulunmuyor.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {project.partnerships.map((part) => (
                  <div key={part.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{part.organization.country.flagEmoji || "🌐"}</span>
                        <span>{part.organization.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {part.organization.city}, {part.organization.country.name} • {part.organization.type}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {part.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Görevler */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#839B24]" />
                <h3 className="text-sm font-bold text-slate-900">İş Paketleri ve Görevler</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {project.tasks.length} Görev
              </span>
            </div>

            {project.tasks.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Tanımlanmış açık görev bulunmuyor.
              </div>
            ) : (
              <div className="space-y-2">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{task.title}</span>
                      <div className="text-[10px] text-slate-400">
                        Atanan: {task.assignedUser?.name || "Belirtilmedi"}
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Sütun: Metrikler ve Sorumlular */}
        <div className="space-y-6">
          {/* Bütçe Kartı */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Proje Bütçesi</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(project.budgetAmount, project.currency)}
            </div>
            {project.fixedExchangeRate && (
              <p className="text-[11px] text-slate-400 mt-1">
                Sözleşme Kuru: 1 {project.currency} = {project.fixedExchangeRate} ₺
              </p>
            )}
            {project.coordinatorOrg && (
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs">
                <span className="text-slate-400 block text-[11px]">Koordinatör Kurum:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {project.coordinatorOrg}
                </span>
              </div>
            )}
          </div>

          {/* Sorumlu Personel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-3">
              <User className="w-4 h-4 text-[#176C55]" />
              <span className="text-xs font-bold uppercase tracking-wider">Sorumlu Personel</span>
            </div>
            {project.responsibleUser ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#176C55]/10 text-[#176C55] font-bold text-sm flex items-center justify-center shrink-0">
                  {project.responsibleUser.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {project.responsibleUser.name}
                  </div>
                  <div className="text-xs text-[#839B24] font-medium">
                    {project.responsibleUser.title || "Ar-Ge Personeli"}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {project.responsibleUser.email}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Henüz personel atanmamış.</p>
            )}

            {project.municipalUnit && (
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs">
                <span className="text-slate-400 block text-[11px]">İlgili Belediye Birimi:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {project.municipalUnit}
                </span>
              </div>
            )}
          </div>

          {/* Fon Programı */}
          {project.fundingProgram && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Fon Kaynağı</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {project.fundingProgram.name}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Sağlayıcı: {project.fundingProgram.provider || "Avrupa Birliği"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
