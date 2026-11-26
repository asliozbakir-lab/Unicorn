"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Coins,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building,
  Target,
  Star,
  SkipForward,
  Ban,
  RotateCcw,
  Rocket,
  Inbox,
  X,
  ExternalLink,
} from "lucide-react";
import {
  triageFundingCallAction,
  updateCallGateAction,
  convertCallToProjectAction,
  type TriageStatus,
  type QualityGate,
} from "@/actions/funding-actions";

export interface CallItem {
  id: string;
  title: string;
  callCode: string | null;
  deadline: string | null;
  budgetInfo: string | null;
  eligibility: string | null;
  sourceUrl: string | null;
  notes: string | null;
  triageStatus: string;
  triageReason: string | null;
  triageBy: string | null;
  triageAt: string | null;
  qualityGate: string;
  track: string;
  programName: string;
  programCode: string | null;
}

interface ProgramItem {
  id: string;
  name: string;
  code: string | null;
  provider: string | null;
}

const DISMISS_REASONS = [
  "Konu / Alan Dışı",
  "İlçe Belediyesi Uygunluğu Yok",
  "Süre Yetersiz",
  "Bütçe / Eş-Finansman Uygun Değil",
  "Sebepsiz Gizle",
];

const QUALITY_GATES: QualityGate[] = ["G0", "G1", "G2", "G3", "G4", "G5"];

export function FundingRadarView({
  programs,
  initialCalls,
}: {
  programs: ProgramItem[];
  initialCalls: CallItem[];
}) {
  const router = useRouter();
  const gateDialogRef = useRef<HTMLDialogElement>(null);
  const [calls, setCalls] = useState<CallItem[]>(initialCalls);
  const [activeTriageTab, setActiveTriageTab] = useState<TriageStatus>("NEW");
  const [activeTrack, setActiveTrack] = useState<"ALL" | "HAT_A" | "HAT_B" | "HAT_C">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const [dismissPromptCallId, setDismissPromptCallId] = useState<string | null>(null);
  const [busyCallId, setBusyCallId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [toast, setToast] = useState<{
    message: string;
    undoCallId?: string;
    undoStatus?: TriageStatus;
    undoReason?: string | null;
    projectLinkId?: string;
  } | null>(null);

  useEffect(() => {
    setCalls(initialCalls);
  }, [initialCalls]);

  // Native <dialog> fallback click-outside handler
  useEffect(() => {
    const dialog = gateDialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

    const outside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    let pressedOutside = false;
    const onDown = (e: PointerEvent) => {
      pressedOutside = outside(e);
    };
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && outside(e)) dialog.close();
    };

    dialog.addEventListener("pointerdown", onDown);
    dialog.addEventListener("pointerup", onUp);
    return () => {
      dialog.removeEventListener("pointerdown", onDown);
      dialog.removeEventListener("pointerup", onUp);
    };
  }, []);

  // Auto-hide toast after 6 seconds
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleTriage = async (
    call: CallItem,
    nextStatus: TriageStatus,
    reason: string | null = null
  ) => {
    const prevStatus = (call.triageStatus as TriageStatus) || "NEW";
    const prevReason = call.triageReason;

    setDismissPromptCallId(null);
    setBusyCallId(call.id);

    // Optimistic state update
    setCalls((prev) =>
      prev.map((c) =>
        c.id === call.id
          ? {
              ...c,
              triageStatus: nextStatus,
              triageReason: nextStatus === "NEW" ? null : reason,
              triageAt: new Date().toISOString(),
            }
          : c
      )
    );

    const statusLabels: Record<TriageStatus, string> = {
      NEW: "İncelenecekler listesine geri alındı.",
      SHORTLISTED: "⭐ Öncelikli (İlgileniyoruz) listesine eklendi.",
      DEFERRED: "⏭️ 'Sonra Bak' listesine taşındı.",
      DISMISSED: "🚫 Ekrandan gizlendi (Bize Uymuyor).",
      APPLIED: "✅ Başvuruya alındı.",
    };

    setToast({
      message: statusLabels[nextStatus],
      undoCallId: call.id,
      undoStatus: prevStatus,
      undoReason: prevReason,
    });

    startTransition(async () => {
      const res = await triageFundingCallAction({
        callId: call.id,
        status: nextStatus,
        reason,
      });
      setBusyCallId(null);
      if (res?.error) {
        // Rollback on failure
        setCalls((prev) =>
          prev.map((c) =>
            c.id === call.id ? { ...c, triageStatus: prevStatus, triageReason: prevReason } : c
          )
        );
        setToast({ message: `Hata: ${res.error}` });
      }
    });
  };

  const handleUndo = () => {
    if (!toast?.undoCallId || !toast.undoStatus) return;
    const target = calls.find((c) => c.id === toast.undoCallId);
    if (!target) return;
    const restoreStatus = toast.undoStatus;
    const restoreReason = toast.undoReason ?? null;
    setToast(null);
    handleTriage(target, restoreStatus, restoreReason);
  };

  const handleGateChange = (call: CallItem, gate: QualityGate) => {
    const prevGate = call.qualityGate;
    setCalls((prev) => prev.map((c) => (c.id === call.id ? { ...c, qualityGate: gate } : c)));

    startTransition(async () => {
      const res = await updateCallGateAction({ callId: call.id, qualityGate: gate });
      if (res?.error) {
        setCalls((prev) => prev.map((c) => (c.id === call.id ? { ...c, qualityGate: prevGate } : c)));
      }
    });
  };

  const handleConvertToProject = (call: CallItem) => {
    setBusyCallId(call.id);
    startTransition(async () => {
      const res = await convertCallToProjectAction(call.id);
      setBusyCallId(null);
      if (res?.error) {
        setToast({ message: `Hata: ${res.error}` });
        return;
      }
      if (res?.projectId) {
        setCalls((prev) =>
          prev.map((c) => (c.id === call.id ? { ...c, triageStatus: "APPLIED", qualityGate: "G4" } : c))
        );
        setToast({
          message: `🚀 "${res.projectCode}" koduyla proje kaydı oluşturuldu!`,
          projectLinkId: res.projectId,
        });
      }
    });
  };

  // Tab counts
  const counts = {
    NEW: calls.filter((c) => (c.triageStatus || "NEW") === "NEW").length,
    SHORTLISTED: calls.filter((c) => c.triageStatus === "SHORTLISTED").length,
    DEFERRED: calls.filter((c) => c.triageStatus === "DEFERRED").length,
    APPLIED: calls.filter((c) => c.triageStatus === "APPLIED").length,
    DISMISSED: calls.filter((c) => c.triageStatus === "DISMISSED").length,
  };

  const urgentCount = calls.filter((c) =>
    Boolean(
      c.triageStatus !== "DISMISSED" &&
        ((c.notes && (c.notes.includes("Acil") || c.notes.includes("ACİL"))) || c.title.includes("Acil"))
    )
  ).length;

  const filteredCalls = calls.filter((call) => {
    const matchesStatus = (call.triageStatus || "NEW") === activeTriageTab;
    const matchesTrack = activeTrack === "ALL" || call.track === activeTrack;
    const matchesSearch =
      searchTerm === "" ||
      call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (call.callCode && call.callCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (call.notes && call.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesUrgency =
      !onlyUrgent ||
      Boolean(
        (call.notes && (call.notes.includes("Acil") || call.notes.includes("ACİL"))) ||
          call.title.includes("Acil")
      );

    return matchesStatus && matchesTrack && matchesSearch && matchesUrgency;
  });

  const triageTabs: { key: TriageStatus; label: string; count: number; icon: any; activeBg: string }[] = [
    { key: "NEW", label: "İncelenecekler", count: counts.NEW, icon: Inbox, activeBg: "bg-[#0B4F3A] text-white" },
    { key: "SHORTLISTED", label: "İlgileniyoruz", count: counts.SHORTLISTED, icon: Star, activeBg: "bg-[#7A9A3B] text-white" },
    { key: "DEFERRED", label: "Sonra Bak (Geç)", count: counts.DEFERRED, icon: SkipForward, activeBg: "bg-amber-600 text-white" },
    { key: "APPLIED", label: "Projeye Dönüşenler", count: counts.APPLIED, icon: CheckCircle2, activeBg: "bg-blue-700 text-white" },
    { key: "DISMISSED", label: "Bize Uymuyor (Gizli)", count: counts.DISMISSED, icon: Ban, activeBg: "bg-slate-700 text-white" },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Üst Başlık */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#0B4F3A] uppercase tracking-wider bg-[#0B4F3A]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0B4F3A]" />
              Karar &amp; Eleme İş Akışı (Triage)
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {programs.length} Fon Programı • {calls.length} Çağrı Havuzu
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hibe, Fon ve Proje Çağrıları Radarı
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Size uymayan çağrıları tek tıkla ekrandan kaldırın, beğendiklerinizi yıldızlayıp doğrudan proje taslağına dönüştürün.
          </p>
        </div>

        <button
          type="button"
          onClick={() => gateDialogRef.current?.showModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-[#0B4F3A] text-xs font-bold shadow-2xs transition shrink-0"
        >
          <ShieldCheck className="w-4 h-4 text-[#0B4F3A]" />
          <span>G0–G5 Kalite Kapılarını İncele</span>
        </button>
      </div>

      {/* 2. Triage Karar Sekmeleri */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap gap-2">
        {triageTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTriageTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTriageTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                isActive ? `${tab.activeBg} shadow-xs` : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Fırsat Hatları (Hat A, Hat B, Hat C) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveTrack("ALL")}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
            activeTrack === "ALL"
              ? "bg-[#0B4F3A] text-white border-[#0B4F3A] shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Tüm Hatlar</div>
            <div className="text-sm font-bold mt-0.5">Tüm Fırsatlar</div>
          </div>
          <Coins className="w-5 h-5 opacity-70" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTrack("HAT_A")}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
            activeTrack === "HAT_A"
              ? "bg-[#176C55] text-white border-[#176C55] shadow-sm"
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
            <div className="text-sm font-bold mt-0.5">Teknik Destek &amp; Ağlar</div>
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
            <div className="text-sm font-bold mt-0.5">Kredi &amp; Finansman</div>
          </div>
          <Building className="w-5 h-5 opacity-70" />
        </button>
      </div>

      {/* 4. Arama & Aciliyet Filtresi */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Çağrı adı, kod, anahtar kelime veya sağlayıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0B4F3A] transition"
          />
        </div>

        <button
          type="button"
          onClick={() => setOnlyUrgent((v) => !v)}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            onlyUrgent
              ? "bg-rose-100 text-[#D61F26] border border-rose-300"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#D61F26]" />
          <span>Acil Çağrılar ({urgentCount})</span>
        </button>
      </div>

      {/* 5. Çağrı Kartları */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-500 flex items-center justify-between px-1">
          <span>Bu görünümde {filteredCalls.length} çağrı listeleniyor</span>
          <span>Değişiklikler otomatik olarak veritabanına kaydedilir</span>
        </div>

        {filteredCalls.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">Bu listede çağrı bulunmuyor</div>
            <p className="text-xs text-slate-500">
              Diğer sekmelere göz atabilir veya arama filtresini temizleyebilirsiniz.
            </p>
          </div>
        ) : (
          filteredCalls.map((call) => {
            const isExpanded = expandedCallId === call.id;
            const isDismissOpen = dismissPromptCallId === call.id;
            const isBusy = busyCallId === call.id;
            const isUrgent = Boolean(
              (call.notes && (call.notes.includes("Acil") || call.notes.includes("ACİL"))) ||
                call.title.includes("Acil")
            );

            return (
              <div
                key={call.id}
                className={`bg-white rounded-2xl border transition shadow-2xs overflow-hidden ${
                  isUrgent
                    ? "border-rose-200/90"
                    : "border-slate-200 hover:border-[#0B4F3A]/35"
                } ${isBusy ? "opacity-60 pointer-events-none" : ""}`}
              >
                <div className="p-4 sm:p-5 space-y-3">
                  {/* Üst Bilgi + Dış Portal / Detay Aç */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {call.callCode || "CAGRI"}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B4F3A]/10 text-[#0B4F3A]">
                          {call.qualityGate || "G1"}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                          {call.track === "HAT_B"
                            ? "Hat B • Teknik Destek"
                            : call.track === "HAT_C"
                            ? "Hat C • Kredi"
                            : "Hat A • Doğrudan Hibe"}
                        </span>
                        {isUrgent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-[#D61F26] border border-rose-200">
                            ACİL AKSİYON
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{call.title}</h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        {call.budgetInfo && (
                          <span className="flex items-center gap-1 text-slate-700 font-semibold">
                            <Coins className="w-3.5 h-3.5 text-[#0B4F3A]" />
                            {call.budgetInfo}
                          </span>
                        )}
                        {call.deadline && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Son Tarih: {new Date(call.deadline).toLocaleDateString("tr-TR")}
                          </span>
                        )}
                        {call.eligibility && (
                          <span className="text-[11px] text-slate-500">Rol: {call.eligibility}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {call.sourceUrl && (
                        <a
                          href={call.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedCallId(isExpanded ? null : call.id)}
                        aria-label={isExpanded ? "Detayı Gizle" : "Detayı Göster"}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Karar & Aksiyon Çubuğu (Triage Action Bar) */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {(activeTriageTab === "NEW" || activeTriageTab === "DEFERRED") && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleTriage(call, "SHORTLISTED")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B4F3A] hover:bg-[#083c2c] text-white text-xs font-bold shadow-2xs transition"
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>İlgileniyoruz</span>
                          </button>

                          {activeTriageTab !== "DEFERRED" && (
                            <button
                              type="button"
                              onClick={() => handleTriage(call, "DEFERRED", "Sonra Değerlendirilecek")}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-800 text-xs font-bold transition"
                            >
                              <SkipForward className="w-3.5 h-3.5" />
                              <span>Geç (Sonra Bak)</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDismissPromptCallId(isDismissOpen ? null : call.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-[#D61F26] text-xs font-bold transition"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Bize Uymuyor (Gizle)</span>
                          </button>
                        </>
                      )}

                      {activeTriageTab === "SHORTLISTED" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleConvertToProject(call)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0B4F3A] hover:bg-[#083c2c] text-white text-xs font-bold shadow-xs transition"
                          >
                            <Rocket className="w-3.5 h-3.5" />
                            <span>Projeye Dönüştür</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTriage(call, "DEFERRED", "Ertelendi")}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
                          >
                            <SkipForward className="w-3.5 h-3.5" />
                            <span>Geç</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDismissPromptCallId(isDismissOpen ? null : call.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-[#D61F26] text-xs font-semibold transition"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Uygun Değil</span>
                          </button>
                        </>
                      )}

                      {(activeTriageTab === "DISMISSED" || activeTriageTab === "DEFERRED" || activeTriageTab === "APPLIED") && (
                        <button
                          type="button"
                          onClick={() => handleTriage(call, "NEW", null)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0B4F3A]/30 bg-[#0B4F3A]/5 hover:bg-[#0B4F3A] text-[#0B4F3A] hover:text-white text-xs font-bold transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Ekrana Geri Al (İncelenecekler)</span>
                        </button>
                      )}
                    </div>

                    {/* Sağ Taraf: G0-G5 İnteraktif Kalite Kapısı veya Gerekçe Rozeti */}
                    {activeTriageTab === "SHORTLISTED" ? (
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 px-1.5">Kapı:</span>
                        {QUALITY_GATES.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleGateChange(call, g)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              call.qualityGate === g
                                ? "bg-[#0B4F3A] text-white"
                                : "text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    ) : (
                      call.triageReason && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                          Gerekçe: <strong className="text-slate-700">{call.triageReason}</strong>
                          {call.triageBy ? ` (${call.triageBy})` : ""}
                        </span>
                      )
                    )}
                  </div>

                  {/* Tek Tıklamalı Hızlı Gerekçe Çubuğu ("Bize Uymuyor" basıldığında açılır) */}
                  {isDismissOpen && (
                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-[#D61F26]">
                        Neden gizliyorsunuz? (Tek tıkla seçin):
                      </span>
                      {DISMISS_REASONS.map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => handleTriage(call, "DISMISSED", reason)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#D61F26] text-slate-700 hover:text-white border border-rose-200 text-[11px] font-semibold transition"
                        >
                          {reason}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setDismissPromptCallId(null)}
                        className="ml-auto text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-2"
                      >
                        Vazgeç
                      </button>
                    </div>
                  )}

                  {/* Genişletilmiş Ayrıntı ve Uzman Notları */}
                  {isExpanded && call.notes && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 whitespace-pre-line text-xs text-slate-700 leading-relaxed">
                        {call.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. G0-G5 Kalite Kapıları Native <dialog> */}
      <dialog
        ref={gateDialogRef}
        {...({ closedby: "any" } as any)}
        aria-labelledby="gates-dialog-title"
        className="m-auto bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0B4F3A]" />
            <h1 id="gates-dialog-title" className="text-base font-bold text-slate-900">
              G0–G5 Kurumsal Kalite Kapıları (Quality Gates)
            </h1>
          </div>
          <button
            type="button"
            onClick={() => gateDialogRef.current?.close()}
            aria-label="Kapat"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Ar-Ge Müdürlüğü&apos;nün her hibe çağrısını 6 aşamalı filtreden geçirdiği kurumsal doğrulama protokolü:
        </p>

        <div className="space-y-2 text-xs">
          {[
            { g: "G0", title: "Keşif & Aday Çağrı", desc: "Resmî bülten veya ağlardan ilk tespit." },
            { g: "G1", title: "Kaynak Doğrulaması", desc: "Orijinal AB, bakanlık veya ajans bağlantısının teyidi." },
            { g: "G2", title: "Takvim Doğrulaması", desc: "Son teslim ve ara raporlama takviminin kontrolü." },
            { g: "G3", title: "Uygunluk (Eligibility)", desc: "İlçe belediyesi statüsü ve ortaklık şartı incelemesi." },
            { g: "G4", title: "Mali & Eş-Finansman Analizi", desc: "Bütçe, hibe oranı ve eş-finansman risk kontrolü." },
            { g: "G5", title: "İnsan Onaylı (4-Göz Kontrolü)", desc: "Müdür ve Proje Sorumlusu tarafından kesin başvuru onayı." },
          ].map((item) => (
            <div key={item.g} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <span className="font-bold font-mono text-[#0B4F3A] shrink-0">{item.g}:</span>
              <div>
                <div className="font-bold text-slate-900">{item.title}</div>
                <div className="text-[11px] text-slate-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-right">
          <button
            type="button"
            autoFocus
            onClick={() => gateDialogRef.current?.close()}
            className="px-4 py-2 rounded-xl bg-[#0B4F3A] text-white text-xs font-bold transition"
          >
            Anladım
          </button>
        </div>
      </dialog>

      {/* 7. Yüzen Geri Al (Undo) Toast Bildirimi */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#0B4F3A] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/15 flex items-center gap-3 text-xs font-semibold max-w-md w-[92vw] sm:w-auto"
        >
          <span className="flex-1">{toast.message}</span>
          {toast.undoCallId && (
            <button
              type="button"
              onClick={handleUndo}
              className="px-2.5 py-1 rounded-lg bg-white text-[#0B4F3A] font-bold hover:bg-emerald-50 transition shrink-0"
            >
              Geri Al
            </button>
          )}
          {toast.projectLinkId && (
            <button
              type="button"
              onClick={() => router.push(`/projeler/${toast.projectLinkId}`)}
              className="px-2.5 py-1 rounded-lg bg-[#7A9A3B] text-white font-bold hover:opacity-90 transition shrink-0"
            >
              Projeye Git ↗
            </button>
          )}
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Bildirimi Kapat"
            className="text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
