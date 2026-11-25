"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Calendar, MapPin, ExternalLink, Shield } from "lucide-react";
import { EditSisterCityModal } from "./EditSisterCityModal";
import { deleteSisterCityAction } from "@/actions/international-actions";

interface SisterCityProps {
  city: {
    id: string;
    cityName: string;
    countryName: string;
    countryCode: string | null;
    flagEmoji: string | null;
    protocolDate: string | null;
    scope: string | null;
    notes: string | null;
    logoUrl: string | null;
  };
}

export function SisterCityCard({ city }: SisterCityProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`"${city.cityName}" kardeş şehir kaydını silmek istediğinize emin misiniz?`)) return;
    setDeleting(true);
    await deleteSisterCityAction(city.id);
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group">
      <div>
        {/* Üst Kısım: Logo ve Başlık */}
        <div className="flex items-start gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[#176C55]/30 transition">
            {city.logoUrl ? (
              <img
                src={city.logoUrl}
                alt={`${city.cityName} Arması`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-3xl">{city.flagEmoji || "🏛️"}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base shrink-0">{city.flagEmoji || "🌐"}</span>
              <h3 className="text-sm font-bold text-slate-900 truncate tracking-tight">
                {city.cityName}
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{city.countryName}</span>
            </p>
            {city.protocolDate && (
              <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Protokol: {city.protocolDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* İş Birliği Alanı */}
        {city.scope && (
          <div className="text-xs text-[#176C55] font-medium bg-[#176C55]/5 p-2.5 rounded-xl border border-[#176C55]/10 mt-3">
            <span className="font-bold block text-[10px] uppercase text-[#176C55] tracking-wider mb-0.5">
              İş Birliği Alanı
            </span>
            {city.scope}
          </div>
        )}

        {/* Notlar */}
        {city.notes && (
          <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed line-clamp-3">
            {city.notes}
          </p>
        )}
      </div>

      {/* Alt Eylemler & Durum */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Aktif Protokol
        </span>

        <div className="flex items-center gap-1">
          <EditSisterCityModal city={city} />
          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Kaldır"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
