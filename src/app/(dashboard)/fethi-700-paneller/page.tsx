import { prisma } from "@/lib/prisma";
import { Landmark, Calendar, Users, Award, CheckCircle2, Clock } from "lucide-react";
import { PanelCard } from "@/components/panels/PanelCard";
import { NewPanelModal } from "@/components/panels/NewPanelModal";

interface PanelsPageProps {
  searchParams: Promise<{
    durum?: string;
  }>;
}

export default async function ConquestPanelsPage({ searchParams }: PanelsPageProps) {
  const { durum } = await searchParams;

  const whereClause: any = {};
  if (durum && ["PLANNING", "ORGANIZING", "COMPLETED"].includes(durum)) {
    whereClause.planningStatus = durum;
  }

  const panels = await prisma.conquestPanel.findMany({
    where: whereClause,
    orderBy: { createdAt: "asc" },
  });

  const totalCount = await prisma.conquestPanel.count();
  const organizingCount = await prisma.conquestPanel.count({ where: { planningStatus: "ORGANIZING" } });
  const completedCount = await prisma.conquestPanel.count({ where: { planningStatus: "COMPLETED" } });

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Yeni Panel Ekle Modalı */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#839B24] uppercase tracking-wider bg-[#839B24]/10 px-2 py-0.5 rounded">
              1326 — 2026
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Bursa'nın Fethi 700. Yıl Anma Etkinlikleri
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            700. Yıl Panelleri Yönetimi
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Geçmiş ve gelecek bağlamında Bursa temalı sempozyumlar, moderatörler, panelistler ve veri toplama
          </p>
        </div>

        <NewPanelModal />
      </div>

      {/* METRİK ŞERİDİ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#839B24]/10 text-[#839B24] flex items-center justify-center font-bold">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Toplam Panel</div>
            <div className="text-lg font-bold text-slate-900">{totalCount} Ana Tema</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Organizasyon Sürüyor</div>
            <div className="text-lg font-bold text-blue-700">{organizingCount} Panel</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Tamamlanan / Veri Toplanan</div>
            <div className="text-lg font-bold text-emerald-700">{completedCount} Raporlandı</div>
          </div>
        </div>
      </div>

      {/* PANELLER GRİD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {panels.map((p) => (
          <PanelCard key={p.id} panel={p} />
        ))}
      </div>
    </div>
  );
}
