import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Coins,
  Globe2,
  Building,
  Plus,
  ArrowUpRight,
  History,
  TrendingUp,
  Landmark,
  MapPin,
  Users2,
  Palette,
  ExternalLink,
  Shield,
  Target,
  Compass,
  FileText,
} from "lucide-react";
import { formatCurrency, CATEGORY_LABELS, PHASE_LABELS } from "@/lib/utils";
import { canCreateProject } from "@/lib/permissions";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { CorporateIdentityModal } from "@/components/dashboard/CorporateIdentityModal";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Canlı Veritabanı Sorguları
  const [
    totalProjects,
    activeProjects,
    totalCountries,
    totalOrgs,
    projects,
    snapshots,
  ] = await Promise.all([
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.project.count({ where: { phase: "ACTIVE", deletedAt: null } }),
    prisma.country.count(),
    prisma.organization.count(),
    prisma.project.findMany({
      where: { deletedAt: null },
      include: { responsibleUser: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.historicalSnapshot.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  // Bütçe Hesaplamaları (EUR ve TRY ayrı!)
  let totalEurBudget = 0;
  let totalTryBudget = 0;
  const categoryCounts: Record<string, number> = {
    INTERNATIONAL: 0,
    NATIONAL: 0,
    CORPORATE: 0,
    INTERNAL: 0,
  };
  const phaseCounts: Record<string, number> = {
    PREPARATION: 0,
    SUBMITTED: 0,
    ACTIVE: 0,
    COMPLETED: 0,
  };

  for (const p of projects) {
    if (p.currency === "EUR" && p.budgetAmount) totalEurBudget += p.budgetAmount;
    if (p.currency === "TRY" && p.budgetAmount) totalTryBudget += p.budgetAmount;

    if (categoryCounts[p.category] !== undefined) categoryCounts[p.category]++;
    if (phaseCounts[p.phase] !== undefined) phaseCounts[p.phase]++;
  }

  const categoryChartData = [
    { name: "Uluslararası", count: categoryCounts.INTERNATIONAL, color: "#2563EB" },
    { name: "Ulusal", count: categoryCounts.NATIONAL, color: "#10B981" },
    { name: "Kurumsal", count: categoryCounts.CORPORATE, color: "#8B5CF6" },
    { name: "Kurum İçi", count: categoryCounts.INTERNAL, color: "#F59E0B" },
  ];

  const phaseChartData = [
    { name: "Hazırlık", count: phaseCounts.PREPARATION },
    { name: "Başvuruldu", count: phaseCounts.SUBMITTED },
    { name: "Aktif", count: phaseCounts.ACTIVE },
    { name: "Tamamlandı", count: phaseCounts.COMPLETED },
  ];

  const canAdd = canCreateProject(user);

  return (
    <div className="space-y-6">
      {/* Üst Karşılama ve Hızlı Eylem */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hoş Geldiniz, {user?.name} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Osmangazi Belediyesi Ar-Ge Müdürlüğü Proje ve Hibe Yönetim Portalı
          </p>
        </div>

        {canAdd && (
          <Link
            href="/projeler/yeni"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold shadow-sm shadow-[#176C55]/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Proje Başlat</span>
          </Link>
        )}
      </div>

      {/* CANLI GÖSTERGE KARTLARI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Toplam Proje */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Toplam Proje
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalProjects}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 4 Kategori
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Uluslararası, Ulusal, Kurumsal, Kurum İçi</p>
        </div>

        {/* Aktif Projeler */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Aktif Projeler
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{activeProjects}</span>
            <span className="text-xs text-slate-500 font-medium">Uygulamada</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Sahada ve konsorsiyumda devam eden</p>
        </div>

        {/* Toplam EUR Bütçe */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Uluslararası Fon
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-slate-900">
              {formatCurrency(totalEurBudget, "EUR")}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Horizon, DUT, NEB, Erasmus+ hibe</p>
        </div>

        {/* Ortaklık Ağı */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Küresel Ortaklık Ağı
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalCountries} Ülke</span>
            <span className="text-xs text-purple-600 font-semibold">174+ Ortak</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avrupa ve dünya genelinde ağ</p>
        </div>
      </div>

      {/* 1. SAYILARLA OSMANGAZİ */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#176C55]/10 text-[#176C55] flex items-center justify-center font-bold">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Sayılarla Osmangazi</h2>
              <p className="text-xs text-slate-500">Tarihi başkentin kentsel ölçeği, nüfus büyüklüğü ve kurumsal kapasitesi</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#176C55] border border-emerald-200">
            Bursa'nın Kalbi • Fethin 700. Yılı
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500">İlçe Nüfusu</span>
            <div className="text-xl font-bold text-slate-900 mt-1">890.000+</div>
            <span className="text-[10px] text-slate-400 mt-0.5">Türkiye'nin 4. Büyük İlçesi</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Mahalle Sayısı</span>
            <div className="text-xl font-bold text-slate-900 mt-1">136</div>
            <span className="text-[10px] text-slate-400 mt-0.5">Yerel Hizmet Ağı</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Yüzölçümü</span>
            <div className="text-xl font-bold text-slate-900 mt-1">714 km²</div>
            <span className="text-[10px] text-slate-400 mt-0.5">Uludağ'dan Bursa Ovasına</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Tarihi Miras</span>
            <div className="text-xl font-bold text-[#176C55] mt-1">1.326</div>
            <span className="text-[10px] text-slate-400 mt-0.5">Tescilli Anıt Eser</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Kardeş Şehir & Birlik</span>
            <div className="text-xl font-bold text-blue-600 mt-1">11 + 10</div>
            <span className="text-[10px] text-slate-400 mt-0.5">Küresel Şehir Ağları</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Uluslararası Toplantı</span>
            <div className="text-xl font-bold text-[#839B24] mt-1">425+</div>
            <span className="text-[10px] text-slate-400 mt-0.5">Ar-Ge Ortaklık Oturumu</span>
          </div>
        </div>
      </div>

      {/* 2. KURUMSAL KİMLİK KİTAPLARI VE 2029 STRATEJİK PLANI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sol Kart: Çift Kurumsal Kimlik Standardı */}
        <div className="bg-gradient-to-br from-slate-900 to-[#176C55] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#839B24]" />
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Çift Kurumsal Kimlik Standardı
              </span>
            </div>
            <h3 className="text-base font-bold tracking-tight">
              Kurumsal Kimlik Rehberleri & Tasarım Kılavuzları
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Osmangazi Belediyesi</strong> resmî amblem, antetli şablon, araç giydirme ve <strong>Fetih 700. Yıl</strong> özel varaklı anma logoları (#176C55, #839B24, #C5A059).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-4 mt-2 border-t border-white/10">
            <CorporateIdentityModal 
              municipalDriveUrl="https://drive.google.com/drive/folders/1Dx_A_Js8YTeMFok6OZOqWbf4fMWjdA2e"
              municipalPdfUrl="https://drive.google.com/file/d/1oOHkZ6hmFGsWQK4HXxoZEfQhmirCsbX1/view"
            />
            <a
              href="https://drive.google.com/file/d/1oOHkZ6hmFGsWQK4HXxoZEfQhmirCsbX1/view"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold shadow-2xs transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Belediye PDF (67 MB) ↗</span>
            </a>
            <a
              href="https://drive.google.com/drive/folders/17113jZ-vMzb9WjXZeg7FlrGgblQ9xxzl"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#839B24] hover:bg-[#6f841e] text-white text-xs font-semibold shadow-2xs transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>700. Yıl Drive ↗</span>
            </a>
          </div>
        </div>

        {/* Sağ Kart: Osmangazi Belediyesi 2025-2029 Stratejik Planı */}
        <div className="bg-gradient-to-br from-emerald-950 via-[#176C55] to-slate-900 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-300" />
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  5 Yıllık Kurumsal Vizyon
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                2025 – 2029
              </span>
            </div>
            <h3 className="text-base font-bold tracking-tight">
              Osmangazi Belediyesi 2025–2029 Stratejik Planı
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ar-Ge hedefleri, iklim eylemi, tarihi mirasın korunması, dijitalleşme ve kentsel dönüşüm stratejilerini içeren 5 yıllık resmî politika belgesi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-4 mt-2 border-t border-white/10">
            <a
              href="https://drive.google.com/file/d/1NOf8hBHbwY5LkNPoEqihMNvxAObqJGSw/view"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Stratejik Plan Kitabını Aç (PDF) ↗</span>
            </a>
            <Link
              href="/belgeler?kategori=CORPORATE_PUBLIC"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold shadow-2xs transition"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-300" />
              <span>Kurumsal Belgeler Arşivi</span>
            </Link>
          </div>
        </div>
      </div>

      {/* TARİHSEL SUNUM GÖSTERGELERİ (CANLI VERİLERDEN AYRI, RESMÎ DÖNEM KARNESİ) */}
      <div className="bg-gradient-to-r from-[#176C55]/10 via-[#839B24]/10 to-transparent p-5 rounded-2xl border border-[#176C55]/20">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-[#176C55]" />
          <h2 className="text-xs font-bold text-[#176C55] uppercase tracking-wider">
            Resmî Sunum Göstergeleri (Tarihsel Dönem Karnesi)
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 font-medium">
            Sunum Özeti
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {snapshots.map((snap) => (
            <div
              key={snap.id}
              className="bg-white/90 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-800">{snap.periodLabel}</span>
                <span className="text-[11px] font-semibold text-[#839B24]">
                  {formatCurrency(snap.totalGrantRequested, snap.currency)} Başvurulan Hibe
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-50">
                  <div className="text-lg font-bold text-slate-900">{snap.totalApplications}</div>
                  <div className="text-[10px] text-slate-500">Başvuru</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <div className="text-lg font-bold text-slate-900">{snap.partnerCountries}</div>
                  <div className="text-[10px] text-slate-500">Ülke</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <div className="text-lg font-bold text-slate-900">{snap.projectPartners}</div>
                  <div className="text-[10px] text-slate-500">Ortak</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <div className="text-lg font-bold text-slate-900">{snap.onlineMeetings}</div>
                  <div className="text-[10px] text-slate-500">Online Toplantı</div>
                </div>
              </div>
              {snap.note && (
                <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed italic">
                  {snap.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* GRAFİKLER */}
      <DashboardCharts categoryData={categoryChartData} phaseData={phaseChartData} />

      {/* SON EKLENEN / ÖNE ÇIKAN PROJELER LİSTESİ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Öne Çıkan ve Aktif Projeler</h3>
            <p className="text-xs text-slate-500">Son güncellenen belediye ve hibe projeleri</p>
          </div>
          <Link
            href="/projeler"
            className="text-xs font-semibold text-[#176C55] hover:text-[#125845] flex items-center gap-1 transition"
          >
            <span>Tüm Projeleri Gör ({totalProjects})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {projects.slice(0, 6).map((proj) => {
            const cat = CATEGORY_LABELS[proj.category] || CATEGORY_LABELS.INTERNATIONAL;
            const ph = PHASE_LABELS[proj.phase] || PHASE_LABELS.ACTIVE;

            return (
              <div
                key={proj.id}
                className="p-4 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-semibold text-slate-400">
                      {proj.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cat.bg} ${cat.color}`}>
                      {cat.label}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${ph.badge}`}>
                      {ph.label}
                    </span>
                  </div>
                  <Link
                    href={`/projeler/${proj.id}`}
                    className="text-sm font-bold text-slate-900 hover:text-[#176C55] transition line-clamp-1"
                  >
                    {proj.name}
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {proj.description || "Açıklama bulunmuyor."}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {formatCurrency(proj.budgetAmount, proj.currency)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Sorumlu: {proj.responsibleUser?.name || "Atanmadı"}
                    </div>
                  </div>
                  <Link
                    href={`/projeler/${proj.id}`}
                    className="p-2 text-slate-400 hover:text-[#176C55] hover:bg-slate-100 rounded-lg transition"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
