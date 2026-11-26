"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  User,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  CheckSquare,
  Square,
  AlertCircle,
  Banknote,
  FileSpreadsheet,
  Camera,
  Newspaper,
  Presentation,
  FileCheck,
  ExternalLink,
  Edit3,
  X,
} from "lucide-react";
import {
  updatePanelStatusAction,
  toggleChecklistItemAction,
  savePanelDossierAction,
} from "@/actions/panel-actions";

interface ChecklistItem {
  id: number;
  title: string;
  desc: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  date: string;
}

interface PanelCardProps {
  panel: {
    id: string;
    title: string;
    institution: string;
    contactPerson: string | null;
    moderator: string | null;
    panelists: string | null;
    date: string | null;
    location: string | null;
    notes: string | null;
    planningStatus: string;
    currentStage?: number | null;
    checklist?: string | null;
    dataCollection: string | null;
    driveFolderUrl?: string | null;
    budget?: number | null;
    expectedAttendees?: number | null;
    actualAttendees?: number | null;
    photosUrl?: string | null;
    pressUrl?: string | null;
    presentationUrl?: string | null;
    declarationUrl?: string | null;
    dossierNotes?: string | null;
  };
}

export function PanelCard({ panel }: PanelCardProps) {
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showDossier, setShowDossier] = useState(false);
  const [isEditingDossier, setIsEditingDossier] = useState(false);

  // Dossier form state
  const [photosUrl, setPhotosUrl] = useState(panel.photosUrl || "");
  const [pressUrl, setPressUrl] = useState(panel.pressUrl || "");
  const [presentationUrl, setPresentationUrl] = useState(panel.presentationUrl || "");
  const [declarationUrl, setDeclarationUrl] = useState(panel.declarationUrl || "");
  const [dossierNotes, setDossierNotes] = useState(panel.dossierNotes || "");
  const [actualAttendees, setActualAttendees] = useState(panel.actualAttendees?.toString() || "");
  const [loading, setLoading] = useState(false);

  // Parse checklist
  let checklist: ChecklistItem[] = [];
  try {
    if (panel.checklist) {
      checklist = JSON.parse(panel.checklist);
    }
  } catch (e) {
    checklist = [];
  }

  const completedSteps = checklist.filter((i) => i.status === "COMPLETED").length;
  const progressPercent = Math.round((completedSteps / 6) * 100);

  const statusConfig: Record<string, { label: string; badge: string }> = {
    PLANNING: { label: "Planlama Aşamasında", badge: "bg-amber-50 text-amber-800 border-amber-200" },
    ORGANIZING: { label: "Organizasyon Sürüyor", badge: "bg-blue-50 text-blue-700 border-blue-200" },
    COMPLETED: { label: "Tamamlandı / Dosyalandı", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  };

  const currentStatus = statusConfig[panel.planningStatus] || statusConfig.PLANNING;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    await updatePanelStatusAction(panel.id, newStatus);
    setLoading(false);
  };

  const handleToggleChecklist = async (itemId: number, currentItemStatus: string) => {
    const nextStatus =
      currentItemStatus === "COMPLETED"
        ? "IN_PROGRESS"
        : currentItemStatus === "IN_PROGRESS"
        ? "PENDING"
        : "COMPLETED";

    setLoading(true);
    await toggleChecklistItemAction(panel.id, itemId, nextStatus);
    setLoading(false);
  };

  const handleSaveDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await savePanelDossierAction(panel.id, {
      photosUrl,
      pressUrl,
      presentationUrl,
      declarationUrl,
      dossierNotes,
      actualAttendees: actualAttendees ? parseInt(actualAttendees) : undefined,
    });
    setLoading(false);
    setIsEditingDossier(false);
    alert("Panel Dosyası başarıyla kaydedildi!");
  };

  const hasDossier = Boolean(
    panel.photosUrl || panel.pressUrl || panel.presentationUrl || panel.declarationUrl || panel.dossierNotes
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition p-5 space-y-4 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Üst Başlık, Kurum ve Durum */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-[#176C55] uppercase tracking-wider bg-[#176C55]/10 px-2.5 py-0.5 rounded-md">
                {panel.institution}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Aşama {panel.currentStage || 1}/6
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {panel.title}
            </h3>
          </div>

          {/* Aşama Seçici */}
          <select
            value={panel.planningStatus}
            disabled={loading}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none shrink-0 cursor-pointer ${currentStatus.badge}`}
          >
            <option value="PLANNING">Planlama Aşamasında</option>
            <option value="ORGANIZING">Organizasyon Sürüyor</option>
            <option value="COMPLETED">Tamamlandı / Dosyalandı</option>
          </select>
        </div>

        {/* HAZIRLIK SÜRECİ İLERLEME ÇUBUĞU */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#839B24]" />
              <span>Hazırlık Süreci İlerlemesi</span>
            </span>
            <span className="text-[#176C55] font-bold">
              %{progressPercent} ({completedSteps}/6 Aşama)
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#176C55] to-[#839B24] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 6 Adımlı Süreç Hapları */}
          <div className="grid grid-cols-6 gap-1 pt-1 text-[9px] font-bold text-center">
            {checklist.map((step) => {
              const isDone = step.status === "COMPLETED";
              const isCurrent = step.status === "IN_PROGRESS";
              return (
                <div
                  key={step.id}
                  title={`${step.title}: ${step.desc}`}
                  className={`py-1 px-0.5 rounded border truncate transition ${
                    isDone
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : isCurrent
                      ? "bg-blue-100 text-blue-800 border-blue-200 animate-pulse"
                      : "bg-white text-slate-400 border-slate-200"
                  }`}
                >
                  {step.id}. {step.title.split(" ")[0]}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tarih, Mekân, İrtibat ve Bütçe Şeridi */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/70">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800 truncate">{panel.date || "Tarih Belirleniyor"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{panel.location || "Panorama 1326"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {panel.actualAttendees
                ? `${panel.actualAttendees} Katıldı`
                : panel.expectedAttendees
                ? `Hedef: ${panel.expectedAttendees}`
                : "Hedef: 350 Kişi"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-semibold text-emerald-700">
              {panel.budget ? `₺${panel.budget.toLocaleString("tr-TR")}` : "Bütçe Etüt"}
            </span>
          </div>
        </div>

        {/* Moderatör ve Panelistler */}
        <div className="space-y-2 text-xs">
          {panel.moderator && (
            <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2">
              <span className="font-bold text-[#176C55] shrink-0 text-[11px] uppercase tracking-wider">
                Moderatör:
              </span>
              <span className="text-slate-800 font-semibold">{panel.moderator}</span>
            </div>
          )}

          {panel.panelists && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                Panelistler & Bildiri Sahipleri:
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line max-h-24 overflow-y-auto pr-1">
                {panel.panelists}
              </p>
            </div>
          )}

          {panel.notes && (
            <div className="text-[11px] text-slate-500 italic px-1">
              <strong>Not:</strong> {panel.notes}
            </div>
          )}
        </div>
      </div>

      {/* ALT EYLEMLER: HAZIRLIK AŞAMALARI VE PANEL DOSYASI */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Hazırlık Süreci Aç / Kapa Butonu */}
          <button
            type="button"
            onClick={() => setShowWorkflow(!showWorkflow)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#176C55]" />
            <span>Hazırlık Süreçleri ({completedSteps}/6)</span>
            {showWorkflow ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>

          {/* Panel Dosyası Aç / Kapa Butonu */}
          <button
            type="button"
            onClick={() => setShowDossier(!showDossier)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              hasDossier
                ? "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Panel Dosyası (Çıktılar & Medya)</span>
            {showDossier ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>
        </div>

        {/* 6 AŞAMALI HAZIRLIK SÜRECİ ÇEKMECESİ */}
        {showWorkflow && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 animate-in fade-in duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-800">
                Hazırlık & Organizasyon Aşamaları ({completedSteps}/6 Tamamlandı)
              </span>
              <span className="text-[10px] text-slate-500">
                (Aşamayı değiştirmek için kutuya tıklayın)
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((step) => {
                const isDone = step.status === "COMPLETED";
                const isCurrent = step.status === "IN_PROGRESS";

                return (
                  <div
                    key={step.id}
                    onClick={() => handleToggleChecklist(step.id, step.status)}
                    className={`p-2.5 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                      isDone
                        ? "bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/70"
                        : isCurrent
                        ? "bg-blue-50/80 border-blue-200 hover:bg-blue-100/70"
                        : "bg-white border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-bold ${
                            isDone ? "text-emerald-900 line-through opacity-80" : "text-slate-800"
                          }`}
                        >
                          {step.id}. {step.title}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded-md ${
                            isDone
                              ? "bg-emerald-100 text-emerald-800"
                              : isCurrent
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {isDone ? "Tamamlandı" : isCurrent ? "Sürüyor" : "Beklemede"} • {step.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PANEL DOSYASI ÇEKMECESİ (RESİMLER, BASIN, SUNUMLAR) */}
        {showDossier && (
          <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-200 space-y-4 animate-in fade-in duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-purple-700" />
                <span className="font-bold text-purple-900">
                  Panel Çıktı Dosyası (Etkinlik Arşivi)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingDossier(!isEditingDossier)}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingDossier ? "İptal" : "Dosyayı Düzenle / Link Ekle"}</span>
              </button>
            </div>

            {/* Dosya İçi Çıktı Rozetleri / Bağlantıları */}
            {!isEditingDossier ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* 1. Fotoğraflar */}
                  {panel.photosUrl ? (
                    <a
                      href={panel.photosUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-2xs transition flex flex-col items-center text-center gap-1"
                    >
                      <Camera className="w-5 h-5 text-purple-600" />
                      <span className="font-bold text-slate-800 text-[11px]">Fotoğraf Albümü</span>
                      <span className="text-[10px] text-purple-700 font-medium flex items-center gap-0.5">
                        İncele <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-white/60 border border-dashed border-slate-200 flex flex-col items-center text-center gap-1 text-slate-400">
                      <Camera className="w-5 h-5" />
                      <span className="font-medium text-[11px]">Fotoğraf Yok</span>
                    </div>
                  )}

                  {/* 2. Basına Yansımalar */}
                  {panel.pressUrl ? (
                    <a
                      href={panel.pressUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-2xs transition flex flex-col items-center text-center gap-1"
                    >
                      <Newspaper className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-slate-800 text-[11px]">Basın Yansımaları</span>
                      <span className="text-[10px] text-blue-700 font-medium flex items-center gap-0.5">
                        Küpürler <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-white/60 border border-dashed border-slate-200 flex flex-col items-center text-center gap-1 text-slate-400">
                      <Newspaper className="w-5 h-5" />
                      <span className="font-medium text-[11px]">Basın Bülteni Yok</span>
                    </div>
                  )}

                  {/* 3. Sunumlar */}
                  {panel.presentationUrl ? (
                    <a
                      href={panel.presentationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-2xs transition flex flex-col items-center text-center gap-1"
                    >
                      <Presentation className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-slate-800 text-[11px]">Panel Sunumları</span>
                      <span className="text-[10px] text-amber-700 font-medium flex items-center gap-0.5">
                        PPTX / PDF <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-white/60 border border-dashed border-slate-200 flex flex-col items-center text-center gap-1 text-slate-400">
                      <Presentation className="w-5 h-5" />
                      <span className="font-medium text-[11px]">Sunum Yok</span>
                    </div>
                  )}

                  {/* 4. Sonuç Bildirgesi */}
                  {panel.declarationUrl ? (
                    <a
                      href={panel.declarationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-2xs transition flex flex-col items-center text-center gap-1"
                    >
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-slate-800 text-[11px]">Sonuç Bildirisi</span>
                      <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                        Metin <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-white/60 border border-dashed border-slate-200 flex flex-col items-center text-center gap-1 text-slate-400">
                      <FileCheck className="w-5 h-5" />
                      <span className="font-medium text-[11px]">Bildiri Yok</span>
                    </div>
                  )}
                </div>

                {/* Dosya Özel Notu */}
                {panel.dossierNotes && (
                  <div className="p-3 bg-white rounded-xl border border-purple-100 text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-purple-900 block mb-0.5">Dosya Değerlendirme Notu:</strong>
                    {panel.dossierNotes}
                  </div>
                )}
              </div>
            ) : (
              /* Dosya Düzenleme Formu */
              <form onSubmit={handleSaveDossier} className="space-y-3 bg-white p-3.5 rounded-xl border border-purple-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      📸 Fotoğraf Albümü / Drive Linki:
                    </label>
                    <input
                      type="url"
                      value={photosUrl}
                      onChange={(e) => setPhotosUrl(e.target.value)}
                      placeholder="https://drive.google.com/... veya fotoğraf linki"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      📰 Basına Yansımalar / Medya Linki:
                    </label>
                    <input
                      type="url"
                      value={pressUrl}
                      onChange={(e) => setPressUrl(e.target.value)}
                      placeholder="https://... haber küpürleri veya bülten"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      📊 Sunumlar / PPTX / PDF Linki:
                    </label>
                    <input
                      type="url"
                      value={presentationUrl}
                      onChange={(e) => setPresentationUrl(e.target.value)}
                      placeholder="https://drive.google.com/... sunum dosyası"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      📜 Sonuç Bildirgesi / Rapor Linki:
                    </label>
                    <input
                      type="url"
                      value={declarationUrl}
                      onChange={(e) => setDeclarationUrl(e.target.value)}
                      placeholder="https://docs.google.com/... sonuç metni"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    📝 Panel Dosyası Açıklaması & Medya Notları:
                  </label>
                  <textarea
                    value={dossierNotes}
                    onChange={(e) => setDossierNotes(e.target.value)}
                    rows={2}
                    placeholder="Panel sonrası basılan bildiri kitabı, ulusal TV haberleri, YouTube canlı yayın linki ve etkinlik arşiv notları..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-600 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingDossier(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
                  >
                    {loading ? "Kaydediliyor..." : "Dosyayı Kaydet"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
