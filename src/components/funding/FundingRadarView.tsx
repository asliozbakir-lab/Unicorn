"use client";

import { useState } from "react";
import {
  Coins,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building,
  Target,
  FileCheck,
} from "lucide-react";

interface CallItem {
  id: string;
  title: string;
  callCode: string | null;
  deadline: Date | null;
  budgetInfo: string | null;
  eligibility: string | null;
  sourceUrl: string | null;
  notes: string | null;
  programName?: string;
  programCode?: string;
}

interface ProgramItem {
  id: string;
  name: string;
  code: string | null;
  provider: string | null;
  calls: any[];
  projects: any[];
}

export function FundingRadarView({
  programs,
  allCalls,
}: {
  programs: ProgramItem[];
  allCalls: CallItem[];
}) {
  const [activeTrack, setActiveTrack] = useState<"ALL" | "HAT_A" | "HAT_B" | "HAT_C">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState<"ALL" | "URGENT" | "HIGH">("ALL");
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const [showGateModal, setShowGateModal] = useState(false);

  // Filter logic
  const filteredCalls = allCalls.filter((call) => {
    // 1. Search term
    const matchesSearch =
      searchTerm === "" ||
      call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (call.callCode && call.callCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (call.notes && call.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Track matching
    let matchesTrack = true;
    if (activeTrack === "HAT_A") {
      // Doğrudan hibeler (Horizon, BEBKA, Erasmus)
      matchesTrack =
        !call.title.includes("EaSI") &&
        !call.title.includes("Kredi") &&
        !call.title.includes("İLBANK");
    } else if (activeTrack === "HAT_B") {
      // Teknik destek ve ağlar (Eurocities, EaSI, NetZero)
      matchesTrack = Boolean(
        call.title.includes("Eurocities") ||
        call.title.includes("EaSI") ||
        call.title.includes("Ağ") ||
        call.title.includes("Anket") ||
        (call.notes && call.notes.includes("Eurocities"))
      );
    } else if (activeTrack === "HAT_C") {
      // Kredi ve finansman (İLBANK, vb.)
      matchesTrack = Boolean(
        call.title.includes("Kredi") ||
        call.title.includes("İLBANK") ||
        call.title.includes("Finansman") ||
        (call.notes && call.notes.includes("İLBANK"))
      );
    }

    // 3. Urgency matching
    let matchesUrgency = true;
    if (selectedUrgency === "URGENT") {
      matchesUrgency = Boolean(
        (call.notes && (call.notes.includes("Acil") || call.notes.includes("ACİL"))) ||
        call.title.includes("Acil")
      );
    }

    return matchesSearch && matchesTrack && matchesUrgency;
  });

  // Calculate quick stats
  const totalCalls = allCalls.length;
  const urgentCount = allCalls.filter(
    (c) => Boolean((c.notes && c.notes.includes("Acil")) || c.title.includes("Acil"))
  ).length;

  return (
    <div className="space-y-6">
      {/* 1. Üst Başlık & Hızlı İstatistik Kartları */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#176C55] uppercase tracking-wider bg-[#176C55]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#176C55]" />
              OSGEDA 360 Hibe & Çağrı Radarı
            </span>
            <span className="text-xs font-semibold text-slate-500">
              G0–G5 Kalite Kapıları Doğrulamalı
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hibe, Fon ve Proje Çağrıları Radarı
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Avrupa Komisyonu, Eurocities EaSI, BEBKA, TÜBİTAK ve İLBANK açık çağrılarının anlık takibi ve kurumsal değerlendirmesi
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowGateModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-[#176C55] text-xs font-bold shadow-2xs transition shrink-0"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>G0–G5 Kalite Kapılarını İncele</span>
        </button>
      </div>

      {/* 2. Fırsat Hatları (Hat A, Hat B, Hat C) Sekmeleri */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveTrack("ALL")}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
            activeTrack === "ALL"
              ? "bg-[#176C55] text-white border-[#176C55] shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Tüm Hatlar</div>
            <div className="text-sm font-bold mt-0.5">Tüm Fırsatlar ({totalCalls})</div>
          </div>
          <Coins className="w-5 h-5 opacity-70" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTrack("HAT_A")}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
            activeTrack === "HAT_A"
              ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Hat A</div>
            <div className="text-sm font-bold mt-0.5">Doğrudan Hibeler</div>
          </div>
          <Award className="w-5 h-5 opacity-70" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTrack("HAT_B")}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
            activeTrack === "HAT_B"
              ? "bg-blue-700 text-white border-blue-700 shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Hat B</div>
            <div className="text-sm font-bold mt-0.5">Teknik Destek & Ağlar</div>
          </div>
          <Target className="w-5 h-5 opacity-70" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTrack("HAT_C")}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
            activeTrack === "HAT_C"
              ? "bg-purple-700 text-white border-purple-700 shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Hat C</div>
            <div className="text-sm font-bold mt-0.5">Kredi & Finansman</div>
          </div>
          <Building className="w-5 h-5 opacity-70" />
        </button>
      </div>

      {/* 3. Arama & Filtreleme Çubuğu */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Çağrı adı, kod, anahtar kelime veya sağlayıcı kurum ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#176C55] transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedUrgency(selectedUrgency === "URGENT" ? "ALL" : "URGENT")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedUrgency === "URGENT"
                ? "bg-rose-100 text-rose-800 border border-rose-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Sadece Acil Olanlar ({urgentCount})</span>
          </button>
        </div>
      </div>

      {/* 4. Çağrı Listesi (Kartlar) */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-500 flex items-center justify-between px-1">
          <span>Toplam {filteredCalls.length} Çağrı Listeleniyor</span>
          <span>Öncelik ve Takvime Göre Sıralı</span>
        </div>

        {filteredCalls.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
            Aradığınız kriterlere uygun açık çağrı bulunamadı.
          </div>
        ) : (
          filteredCalls.map((call) => {
            const isExpanded = expandedCallId === call.id;
            const isUrgent =
              (call.notes && (call.notes.includes("Acil") || call.notes.includes("ACİL"))) ||
              call.title.includes("Acil");

            return (
              <div
                key={call.id}
                className={`bg-white rounded-2xl border transition shadow-2xs overflow-hidden ${
                  isUrgent ? "border-rose-200 bg-rose-50/10" : "border-slate-200 hover:border-[#176C55]/30"
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {call.callCode || "CAGRI"}
                        </span>
                        {isUrgent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                            🔴 ACİL AKSİYON
                          </span>
                        )}
                        {call.eligibility && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Rol: {call.eligibility}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {call.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        {call.budgetInfo && (
                          <span className="flex items-center gap-1 text-slate-700 font-semibold">
                            <Coins className="w-3.5 h-3.5 text-[#176C55]" />
                            {call.budgetInfo}
                          </span>
                        )}
                        {call.deadline && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Son Tarih: {new Date(call.deadline).toLocaleDateString("tr-TR")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {call.sourceUrl && (
                        <a
                          href={call.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold shadow-2xs transition"
                        >
                          <span>Portal ↗</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedCallId(isExpanded ? null : call.id)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Genişletilmiş Ayrıntı ve Uzman Paneli */}
                  {isExpanded && call.notes && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 whitespace-pre-line leading-relaxed font-sans">
                        {call.notes}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          G1-G4 Doğrulamasından Geçti
                        </span>
                        <span>Kaynak: Osmangazi Ar-Ge Radarı</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. G0-G5 Kalite Kapıları Modal */}
      {showGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#176C55]" />
                <h3 className="text-base font-bold text-slate-900">
                  G0–G5 Kurumsal Kalite Kapıları (Quality Gates)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Ar-Ge Müdürlüğü'nün her hibe ve proje çağrısını 6 aşamalı filtreden geçirdiği kurumsal doğrulama protokolü:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="font-bold font-mono text-[#176C55] shrink-0">G0:</span>
                <div>
                  <div className="font-bold text-slate-900">Keşif & Aday Çağrı</div>
                  <div className="text-[11px] text-slate-500">Resmî bülten, komisyon portalları veya ağlardan ilk tespit.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="font-bold font-mono text-emerald-700 shrink-0">G1:</span>
                <div>
                  <div className="font-bold text-slate-900">Kaynak Doğrulaması</div>
                  <div className="text-[11px] text-slate-500">Orijinal AB, bakanlık veya ajans linkinin resmî teyidi.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="font-bold font-mono text-blue-700 shrink-0">G2:</span>
                <div>
                  <div className="font-bold text-slate-900">Takvim & Son Teslim Doğrulaması</div>
                  <div className="text-[11px] text-slate-500">Son teslim tarihi ve ara raporlama takviminin kontrolü.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="font-bold font-mono text-purple-700 shrink-0">G3:</span>
                <div>
                  <div className="font-bold text-slate-900">Uygunluk (Eligibility) İncelemesi</div>
                  <div className="text-[11px] text-slate-500">Belediye, ilçe statüsü ve ortaklık gereksinimlerinin uyumu.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="font-bold font-mono text-amber-700 shrink-0">G4:</span>
                <div>
                  <div className="font-bold text-slate-900">Mali & Eş-Finansman İncelemesi</div>
                  <div className="text-[11px] text-slate-500">Bütçe büyüklüğü, hibe oranı (%80-%100) ve mali risk analizi.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <span className="font-bold font-mono text-emerald-800 shrink-0">G5:</span>
                <div>
                  <div className="font-bold text-emerald-950">İnsan Onaylı & 4-Göz Kontrolü</div>
                  <div className="text-[11px] text-emerald-800">Ar-Ge Müdürü ve Proje Sorumlusu tarafından son başvuru onayı.</div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowGateModal(false)}
                className="px-4 py-2 rounded-xl bg-[#176C55] text-white text-xs font-bold transition"
              >
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
