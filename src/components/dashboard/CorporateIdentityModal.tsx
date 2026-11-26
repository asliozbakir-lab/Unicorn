"use client";

import { useState } from "react";
import { BookOpen, X, ExternalLink, Palette, Type, Shield, Check, Copy, Award, Landmark, FileText } from "lucide-react";

export function CorporateIdentityModal({ 
  municipalDriveUrl = "https://drive.google.com/drive/folders/1Dx_A_Js8YTeMFok6OZOqWbf4fMWjdA2e",
  municipalPdfUrl = "https://drive.google.com/file/d/1oOHkZ6hmFGsWQK4HXxoZEfQhmirCsbX1/view"
}: { 
  municipalDriveUrl?: string;
  municipalPdfUrl?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"belediye" | "fetih700">("belediye");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // 1. Osmangazi Belediyesi Resmî Kurumsal Renkleri
  const municipalColors = [
    { name: "Osmangazi Koyu Yeşili", hex: "#176C55", rgb: "23, 108, 85", role: "Ana Kurumsal Renk (Primary)", pantone: "Pantone 7727 C" },
    { name: "Osmangazi Zeytin Yeşili", hex: "#839B24", rgb: "131, 155, 36", role: "İkincil / Vurgu Rengi", pantone: "Pantone 377 C" },
    { name: "Asalet Koyu Lacivert", hex: "#1A1A2E", rgb: "26, 26, 46", role: "Metin & Derinlik (Dark)", pantone: "Pantone 533 C" },
    { name: "Kurumsal Yumuşak Zemin", hex: "#F7F9F8", rgb: "247, 249, 248", role: "Fon & Arka Plan (Surface)", pantone: "Cool Gray 1 C" },
  ];

  // 2. Bursa'nın Fethi 700. Yıl Özel Renkleri
  const fetih700Colors = [
    { name: "Fetih 700 Altın / Varak", hex: "#C5A059", rgb: "197, 160, 89", role: "700. Yıl Varak Vurgu", pantone: "Pantone 465 C" },
    { name: "Sancak Yeşili", hex: "#124B3B", rgb: "18, 75, 59", role: "700. Yıl Ana Zemin", pantone: "Pantone 343 C" },
    { name: "Bursa İpeği Beyazı", hex: "#FAF8F5", rgb: "250, 248, 245", role: "Katalog & Sahne Fonu", pantone: "Warm Gray 1 C" },
    { name: "Kubbe Kurşunu Grisi", hex: "#4A5568", rgb: "74, 85, 104", role: "Kitapçık & Tipografi", pantone: "Pantone 7540 C" },
  ];

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const currentColors = activeTab === "belediye" ? municipalColors : fetih700Colors;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
      >
        <BookOpen className="w-3.5 h-3.5 text-[#176C55]" />
        <span>Kurumsal Kimlik Kılavuzlarını İncele</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-white to-amber-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white transition ${
                  activeTab === "belediye" ? "bg-[#176C55]" : "bg-[#C5A059]"
                }`}>
                  {activeTab === "belediye" ? <Landmark className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Kurumsal Kimlik ve Marka Kılavuzları
                  </h3>
                  <p className="text-xs text-slate-500">
                    Osmangazi Belediyesi Resmî Kılavuzu & 700. Yıl Özel Tasarım Standartları
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="px-5 pt-3 pb-0 bg-slate-50 border-b border-slate-200/80 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("belediye")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 -mb-[1px] ${
                  activeTab === "belediye"
                    ? "bg-white text-[#176C55] border-[#176C55] shadow-xs"
                    : "text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/60"
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>1. Osmangazi Belediyesi Kurumsal Kimlik</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("fetih700")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 -mb-[1px] ${
                  activeTab === "fetih700"
                    ? "bg-white text-[#C5A059] border-[#C5A059] shadow-xs"
                    : "text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/60"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>2. 700. Yıl Özel Kurumsal Kimlik</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
              {/* Tab Info Banner */}
              <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                activeTab === "belediye"
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                  : "bg-amber-50/70 border-amber-200 text-amber-900"
              }`}>
                <div>
                  <div className="font-bold">
                    {activeTab === "belediye"
                      ? "🏛️ Osmangazi Belediyesi Genel Kurumsal Kimlik Kitabı"
                      : "⚔️ Bursa'nın Fethi 700. Yıl Özel Etkinlik Kimliği"}
                  </div>
                  <div className="text-[11px] opacity-85 mt-0.5">
                    {activeTab === "belediye"
                      ? "Resmî evraklar, müdürlük antetleri, belediye tabelaları, araç giydirme, kartvizit ve kurumsal materyaller."
                      : "700. Yıl panelleri, sempozyum afişleri, hatıra kitapları, sahne dekorları ve davetiyeler."}
                  </div>
                </div>
              </div>

              {/* 1. Renk Standartları */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Palette className={`w-4 h-4 ${activeTab === "belediye" ? "text-[#176C55]" : "text-[#C5A059]"}`} />
                  <span>Resmî Renk Paleti (Tıklayarak Kodu Kopyalayın)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentColors.map((c) => (
                    <div
                      key={c.hex}
                      onClick={() => handleCopy(c.hex)}
                      className="p-3 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-[#176C55]/40 transition flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg shrink-0 border border-black/10 shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 truncate">{c.name}</div>
                        <div className="text-[10px] text-slate-500">{c.role}</div>
                        <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                          {c.hex} • {c.pantone}
                        </div>
                      </div>
                      <div className="text-slate-400 group-hover:text-[#176C55] transition">
                        {copiedColor === c.hex ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Tipografi Standartları */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#839B24]" />
                  <span>Tipografi ve Yazı Karakterleri</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-[#176C55] uppercase tracking-wider block">
                      Başlık Font Ailesi
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-1 font-sans">
                      {activeTab === "belediye" ? "Segoe UI / Arial / Montserrat" : "Cinzel / Playfair / Trajan"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {activeTab === "belediye"
                        ? "Müdürlük ve belediye duyurularında semi-bold ve bold okunaklı modern karakterler."
                        : "700. Yıl tarihi temasına uygun tırnaklı (serif) prestijli kurumsal başlıklar."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-[#839B24] uppercase tracking-wider block">
                      Gövde & Metin Font Ailesi
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-1 font-sans">
                      {activeTab === "belediye" ? "Inter / Roboto / System UI" : "Garamond / Times New Roman / Inter"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Resmî yazışmalarda Cumhurbaşkanlığı Kılavuzuna uygun Times New Roman (12 pt), dijitalde okunaklı sans-serif.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Logo ve Kullanım Kuralları */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Logo ve Güvenli Alan Standartları</span>
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <li>
                    {activeTab === "belediye"
                      ? "Osmangazi Belediyesi logosu asla deforme edilemez, yatay veya dikey oranları değiştirilemez."
                      : "700. Yıl amblemi her panel ve etkinlik materyalinde Osmangazi Belediyesi logosuyla birlikte dengeli kullanılır."}
                  </li>
                  <li>Açık renkli zeminlerde tam renkli kurumsal logo, koyu zeminlerde negatif beyaz versiyonu uygulanır.</li>
                  <li>Logonun çevresinde amblem yüksekliğinin en az 1/3'ü kadar nefes alma alanı (güvenli alan) korunur.</li>
                  <li>Ortak çalışmalarda diğer kamu/oda logolarıyla hiyerarşik sıralama kurallarına riayet edilir.</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer with Direct PDF & Drive Links */}
            <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
              <div className="flex flex-wrap items-center gap-2">
                {activeTab === "belediye" ? (
                  <>
                    <a
                      href={municipalPdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold shadow-xs transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Rehber PDF'ini Aç (67 MB) ↗</span>
                    </a>
                    <a
                      href={municipalDriveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Drive Klasörünü Aç ↗</span>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="https://drive.google.com/file/d/1poV9KXVYYinSwVKCJ6_GKnOb2QNGkKOQ/view"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C5A059] hover:bg-[#b08d48] text-white text-xs font-semibold shadow-xs transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>700. Yıl Kitapçık PDF'ini Aç ↗</span>
                    </a>
                    <a
                      href="https://drive.google.com/drive/folders/17113jZ-vMzb9WjXZeg7FlrGgblQ9xxzl"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Drive Logo Klasörü ↗</span>
                    </a>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
