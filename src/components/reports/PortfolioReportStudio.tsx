"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Printer,
  FileText,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Search,
  BarChart3,
  Coins,
  FolderKanban,
  Landmark,
} from "lucide-react";
import {
  downloadPortfolioCsv,
  downloadPortfolioDoc,
  type ExportProjectData,
} from "@/lib/export-utils";
import { formatCurrency, CATEGORY_LABELS, PHASE_LABELS } from "@/lib/utils";
import { ProjectPrintButton } from "@/components/projects/ProjectPrintButton";

interface PortfolioReportStudioProps {
  projects: ExportProjectData[];
  initialCategory?: string;
  stats: {
    activeCallsCount: number;
    shortlistedCallsCount: number;
    panelsCount: number;
    sisterCitiesCount: number;
  };
}

export function PortfolioReportStudio({
  projects,
  initialCategory = "ALL",
  stats,
}: PortfolioReportStudioProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory || "ALL");
  const [phaseFilter, setPhaseFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>(() => projects.map((p) => p.id));
  const [mounted, setMounted] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesCat = categoryFilter === "ALL" || p.category === categoryFilter;
    const matchesPhase = phaseFilter === "ALL" || p.phase === phaseFilter;
    const matchesSearch =
      searchTerm === "" ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.responsibleUserName && p.responsibleUserName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesPhase && matchesSearch;
  });

  const selectedProjects = filteredProjects.filter((p) => selectedIds.includes(p.id));
  const allFilteredSelected =
    filteredProjects.length > 0 && filteredProjects.every((p) => selectedIds.includes(p.id));

  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      const filteredSet = new Set(filteredProjects.map((p) => p.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredSet.has(id)));
    } else {
      const merged = new Set([...selectedIds, ...filteredProjects.map((p) => p.id)]);
      setSelectedIds(Array.from(merged));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const eurSum = selectedProjects
    .filter((p) => p.currency === "EUR" && p.budgetAmount)
    .reduce((acc, p) => acc + (p.budgetAmount || 0), 0);
  const trySum = selectedProjects
    .filter((p) => p.currency === "TRY" && p.budgetAmount)
    .reduce((acc, p) => acc + (p.budgetAmount || 0), 0);

  const filterLabel =
    categoryFilter === "ALL"
      ? "Tüm Proje Kategorileri"
      : CATEGORY_LABELS[categoryFilter]?.label || categoryFilter;

  const todayFormatted = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const handlePrintPortfolio = () => {
    if (selectedProjects.length === 0) return;
    setIsPrinting(true);
    document.body.classList.add("printing-sheet");

    const cleanup = () => {
      document.body.classList.remove("printing-sheet");
      setIsPrinting(false);
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);

    setTimeout(() => {
      window.print();
      setTimeout(cleanup, 1200);
    }, 80);
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Dışa Aktarma Araç Çubuğu */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#0B4F3A] uppercase tracking-wider bg-[#0B4F3A]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#0B4F3A]" />
              Kurumsal Raporlama &amp; Çıktı Stüdyosu
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Proje Özetleri, A4 Baskı ve Dışa Aktarma Merkezi
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Başkanlık, encümen veya konsorsiyum sunumları için seçili projeleri tek tıkla A4 PDF, Word (.doc) veya Excel (.csv) olarak alın.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={selectedProjects.length === 0}
            onClick={() => downloadPortfolioCsv(selectedProjects)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-xs font-bold shadow-2xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Excel (.csv) İndir</span>
          </button>

          <button
            type="button"
            disabled={selectedProjects.length === 0}
            onClick={() => downloadPortfolioDoc(selectedProjects, filterLabel)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#0B4F3A]/30 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-[#0B4F3A] text-xs font-bold shadow-2xs transition"
          >
            <FileText className="w-4 h-4" />
            <span>Word (.doc) İndir</span>
          </button>

          <button
            type="button"
            disabled={selectedProjects.length === 0}
            onClick={handlePrintPortfolio}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B4F3A] hover:bg-[#083c2c] disabled:opacity-50 text-white text-xs font-bold shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır / A4 PDF ({selectedProjects.length})</span>
          </button>
        </div>
      </div>

      {/* Canlı Portföy Özeti Şeridi */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3 osmangazi-card">
          <div className="w-10 h-10 rounded-xl bg-[#0B4F3A]/10 text-[#0B4F3A] flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Seçili Proje</div>
            <div className="text-lg font-extrabold text-slate-900">
              {selectedProjects.length} <span className="text-xs font-medium text-slate-400">/ {filteredProjects.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3 osmangazi-card">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Seçili EUR Bütçe</div>
            <div className="text-base font-extrabold text-slate-900">{formatCurrency(eurSum, "EUR")}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3 osmangazi-card">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Seçili TRY Bütçe</div>
            <div className="text-base font-extrabold text-slate-900">{formatCurrency(trySum, "TRY")}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3 osmangazi-card">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Radar &amp; Diplomasi</div>
            <div className="text-xs font-bold text-slate-900">
              {stats.shortlistedCallsCount} Öncelikli Çağrı • {stats.sisterCitiesCount} Kardeş Şehir
            </div>
          </div>
        </div>
      </div>

      {/* Filtreleme ve Toplu Seçim Çubuğu */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Proje adı, kodu veya sorumlu personel ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0B4F3A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Kategori Filtresi"
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Tüm Kategoriler</option>
            <option value="INTERNATIONAL">Uluslararası</option>
            <option value="NATIONAL">Ulusal</option>
            <option value="CORPORATE">Kurumsal</option>
            <option value="INTERNAL">Kurum İçi</option>
          </select>

          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            aria-label="Aşama Filtresi"
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Tüm Aşamalar</option>
            <option value="PREPARATION">Hazırlık</option>
            <option value="SUBMITTED">Başvuruldu</option>
            <option value="ACTIVE">Devam Ediyor</option>
            <option value="COMPLETED">Tamamlandı</option>
          </select>

          <button
            type="button"
            onClick={toggleAllFiltered}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
          >
            {allFilteredSelected ? (
              <CheckSquare className="w-3.5 h-3.5 text-[#0B4F3A]" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{allFilteredSelected ? "Seçimi Temizle" : "Tümünü Seç"}</span>
          </button>
        </div>
      </div>

      {/* Proje Seçim Tablosu */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-3.5 w-10 text-center">Seç</th>
                <th className="p-3.5">Kod &amp; Proje Adı</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">Aşama</th>
                <th className="p-3.5 text-right">Bütçe</th>
                <th className="p-3.5">Sorumlu</th>
                <th className="p-3.5 text-right">Tekil Çıktı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    Filtreye uygun proje bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => {
                  const isChecked = selectedIds.includes(p.id);
                  const cat = CATEGORY_LABELS[p.category] || CATEGORY_LABELS.INTERNATIONAL;
                  const ph = PHASE_LABELS[p.phase] || PHASE_LABELS.ACTIVE;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isChecked ? "bg-emerald-50/20" : ""
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleOne(p.id)}
                          aria-label={`${p.name} seç`}
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                      </td>
                      <td className="p-3.5 max-w-md">
                        <div className="font-mono text-[10px] font-bold text-slate-400">{p.code}</div>
                        <div className="font-bold text-slate-900">{p.name}</div>
                        {p.description && (
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {p.description}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cat.bg} ${cat.color}`}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${ph.badge}`}>
                          {ph.label}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(p.budgetAmount, p.currency)}
                      </td>
                      <td className="p-3.5 text-slate-600 whitespace-nowrap">
                        {p.responsibleUserName || "Atanmadı"}
                      </td>
                      <td className="p-3.5 text-right">
                        <ProjectPrintButton project={p} compact />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toplu A4 Yazdırma Portalı */}
      {mounted &&
        isPrinting &&
        createPortal(
          <div id="print-sheet-portal" className="hidden print:block p-6 bg-white text-slate-900">
            {/* Kurumsal Başlık */}
            <div className="flex items-center justify-between border-b-2 border-[#0B4F3A] pb-4 mb-5">
              <div className="flex items-center gap-3">
                <img
                  src="/brand/osmangazi-logo.png"
                  alt="Osmangazi Belediyesi"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#0B4F3A]">
                    T.C. Osmangazi Belediyesi • Araştırma ve Geliştirme Müdürlüğü
                  </div>
                  <h1 className="text-lg font-extrabold text-slate-900">
                    Proje Portföyü Yönetici Özeti Raporu
                  </h1>
                  <div className="text-[11px] text-slate-500">
                    Kapsam: {filterLabel} • Rapor Tarihi: {todayFormatted}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs">
                <div><strong>{selectedProjects.length}</strong> Seçili Proje</div>
                <div>EUR: <strong>{formatCurrency(eurSum, "EUR")}</strong></div>
                <div>TRY: <strong>{formatCurrency(trySum, "TRY")}</strong></div>
              </div>
            </div>

            {/* Proje Kartları / Tablosu */}
            <div className="space-y-3">
              {selectedProjects.map((p, idx) => {
                const cat = CATEGORY_LABELS[p.category]?.label || p.category;
                const ph = PHASE_LABELS[p.phase]?.label || p.phase;
                return (
                  <div
                    key={p.id}
                    className="p-3.5 border border-slate-300 rounded-xl print-avoid-break"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {idx + 1}. {p.code} • {cat} • {ph}
                        </div>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">{p.name}</div>
                      </div>
                      <div className="text-right text-xs font-bold text-[#0B4F3A] shrink-0">
                        {formatCurrency(p.budgetAmount, p.currency)}
                      </div>
                    </div>
                    {p.description && (
                      <p className="text-[11px] text-slate-700 mt-1.5 leading-snug">{p.description}</p>
                    )}
                    <div className="mt-2 pt-1.5 border-t border-slate-200 flex flex-wrap gap-x-4 text-[10px] text-slate-600">
                      <span><strong>Sorumlu:</strong> {p.responsibleUserName || "Atanmadı"}</span>
                      <span><strong>Fon:</strong> {p.fundingProgramName || "Öz Kaynak"}</span>
                      <span><strong>Ortak:</strong> {p.partnerships.length} Kurum</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
