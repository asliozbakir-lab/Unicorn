"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  User,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { updatePanelStatusAction, savePanelDataCollectionAction } from "@/actions/panel-actions";

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
    dataCollection: string | null;
  };
}

export function PanelCard({ panel }: PanelCardProps) {
  const [showDataCollection, setShowDataCollection] = useState(false);
  const [dataText, setDataText] = useState(panel.dataCollection || "");
  const [loading, setLoading] = useState(false);

  const statusConfig: Record<string, { label: string; badge: string }> = {
    PLANNING: { label: "Planlama Aşamasında", badge: "bg-slate-100 text-slate-700 border-slate-200" },
    ORGANIZING: { label: "Organizasyon Sürüyor", badge: "bg-blue-50 text-blue-700 border-blue-200" },
    COMPLETED: { label: "Tamamlandı / Veri Toplandı", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  };

  const currentStatus = statusConfig[panel.planningStatus] || statusConfig.PLANNING;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    await updatePanelStatusAction(panel.id, newStatus);
    setLoading(false);
  };

  const handleSaveData = async () => {
    setLoading(true);
    await savePanelDataCollectionAction(panel.id, dataText);
    setLoading(false);
    alert("Etkinlik sonrası veri ve rapor başarıyla kaydedildi!");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition p-5 space-y-4">
      {/* Üst Başlık ve Kurum */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-bold text-[#839B24] uppercase tracking-wider bg-[#839B24]/10 px-2 py-0.5 rounded">
            {panel.institution}
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
            {panel.title}
          </h3>
        </div>

        {/* Aşama Seçici */}
        <select
          value={panel.planningStatus}
          disabled={loading}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border focus:outline-none shrink-0 ${currentStatus.badge}`}
        >
          <option value="PLANNING">Planlama Aşamasında</option>
          <option value="ORGANIZING">Organizasyon Sürüyor</option>
          <option value="COMPLETED">Tamamlandı / Veri Toplandı</option>
        </select>
      </div>

      {/* Tarih, Mekân ve İrtibat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-800">{panel.date || "Tarih Belirleniyor"}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{panel.location || "Mekân Planlanıyor"}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">İrtibat: {panel.contactPerson || "Ar-Ge Birimi"}</span>
        </div>
      </div>

      {/* Moderatör ve Panelistler */}
      <div className="space-y-2 text-xs">
        {panel.moderator && (
          <div className="flex items-start gap-1.5">
            <span className="font-bold text-[#176C55] shrink-0">Moderatör:</span>
            <span className="text-slate-800">{panel.moderator}</span>
          </div>
        )}

        {panel.panelists && (
          <div className="flex items-start gap-1.5">
            <span className="font-bold text-slate-700 shrink-0">Panelistler:</span>
            <p className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line">
              {panel.panelists}
            </p>
          </div>
        )}

        {panel.notes && (
          <div className="pt-2 text-[11px] text-slate-500 italic">
            Not: {panel.notes}
          </div>
        )}
      </div>

      {/* Veri Toplama ve Sonuç Raporu Bölümü */}
      <div className="pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowDataCollection(!showDataCollection)}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#176C55] hover:text-[#125845] py-1 transition"
        >
          <span className="flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#839B24]" />
            <span>Organizasyon & Etkinlik Sonrası Veri Toplama</span>
            {panel.dataCollection && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white ml-1" />
            )}
          </span>
          {showDataCollection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDataCollection && (
          <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-3 animate-in fade-in duration-200">
            <label className="block text-[11px] font-bold text-emerald-900">
              Etkinlik Sonrası Veriler (Katılımcı Sayısı, Geri Bildirimler, Çıktı Raporu):
            </label>
            <textarea
              rows={3}
              value={dataText}
              onChange={(e) => setDataText(e.target.value)}
              placeholder="Örn: Panele 240 kişi katıldı. Bildiriler kitapçığı hazırlandı, YouTube canlı yayını 1.200 izlenmeye ulaştı..."
              className="w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-xs focus:outline-none focus:border-[#176C55]"
            />
            <div className="flex justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={handleSaveData}
                className="px-4 py-1.5 rounded-lg bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
              >
                {loading ? "Kaydediliyor..." : "Verileri Kaydet"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
