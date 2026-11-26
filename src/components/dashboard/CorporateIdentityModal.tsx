"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, X, ExternalLink, Palette, Type, Shield, Check, Copy, Award, Landmark, FileText } from "lucide-react";

export function CorporateIdentityModal({
  municipalDriveUrl = "https://drive.google.com/drive/folders/1Dx_A_Js8YTeMFok6OZOqWbf4fMWjdA2e",
  municipalPdfUrl = "https://drive.google.com/file/d/1oOHkZ6hmFGsWQK4HXxoZEfQhmirCsbX1/view",
}: {
  municipalDriveUrl?: string;
  municipalPdfUrl?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeTab, setActiveTab] = useState<"belediye" | "fetih700">("belediye");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // 1. Osmangazi Belediyesi Resmî Kurumsal Renkleri (2026 Kılavuz ve Logo Standartları)
  const municipalColors = [
    { name: "Osmangazi Koyu Zümrüt", hex: "#0B4F3A", rgb: "11, 79, 58", role: "Ana Kurumsal Renk (Primary)", pantone: "Pantone 3435 C" },
    { name: "Çınar Yaprağı Yeşili", hex: "#7A9A3B", rgb: "122, 154, 59", role: "İkincil / Amblem Yeşili", pantone: "Pantone 377 C" },
    { name: "Bursa'nın Kalbi Kırmızısı", hex: "#D61F26", rgb: "214, 31, 38", role: "Vurgu / Kalp Simgesi", pantone: "Pantone 185 C" },
    { name: "Kurumsal Lacivert", hex: "#1A1A2E", rgb: "26, 26, 46", role: "Metin & Derinlik (Dark)", pantone: "Pantone 533 C" },
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

  useEffect(() => {
    const dialog = dialogRef.current;
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

  const currentColors = activeTab === "belediye" ? municipalColors : fetih700Colors;

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition"
      >
        <BookOpen className="w-3.5 h-3.5 text-[#0B4F3A]" />
        <span>Kurumsal Kimlik Kılavuzlarını İncele</span>
      </button>

      <dialog
        ref={dialogRef}
        {...({ closedby: "any" } as any)}
        aria-labelledby="corp-identity-title"
        className="m-auto bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col p-0 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-white to-amber-50">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white transition ${
                activeTab === "belediye" ? "bg-[#0B4F3A]" : "bg-[#C5A059]"
              }`}
            >
              {activeTab === "belediye" ? <Landmark className="w-5 h-5" /> : <Award className="w-5 h-5" />}
            </div>
            <div>
              <h1 id="corp-identity-title" className="text-base font-bold text-slate-900">
                Kurumsal Kimlik ve Marka Kılavuzları
              </h1>
              <p className="text-xs text-slate-500">
                Osmangazi Belediyesi Resmî Kılavuzu &amp; 700. Yıl Özel Tasarım Standartları
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Kapat"
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
                ? "bg-white text-[#0B4F3A] border-[#0B4F3A] shadow-xs"
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 flex-1">
          {/* Tab Info Banner + Logo Önizleme */}
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-4 ${
              activeTab === "belediye"
                ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                : "bg-amber-50/70 border-amber-200 text-amber-900"
            }`}
          >
            <div>
              <div className="font-bold">
                {activeTab === "belediye"
                  ? "Osmangazi Belediyesi Genel Kurumsal Kimlik Kitabı"
                  : "Bursa'nın Fethi 700. Yıl Özel Etkinlik Kimliği"}
              </div>
              <div className="text-[11px] opacity-85 mt-0.5">
                {activeTab === "belediye"
                  ? "Resmî evraklar, müdürlük antetleri, belediye tabelaları, araç giydirme, kartvizit ve kurumsal materyaller."
                  : "700. Yıl panelleri, sempozyum afişleri, hatıra kitapları, sahne dekorları ve davetiyeler."}
              </div>
            </div>
            {activeTab === "belediye" && (
              <div className="w-16 h-16 rounded-xl bg-white border border-emerald-200 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src="/brand/osmangazi-logo.png"
                  alt="Osmangazi Belediyesi Resmî Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* 1. Renk Standartları */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Palette className={`w-4 h-4 ${activeTab === "belediye" ? "text-[#0B4F3A]" : "text-[#C5A059]"}`} />
              <span>Resmî Renk Paleti (Tıklayarak Kodu Kopyalayın)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentColors.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => handleCopy(c.hex)}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-[#0B4F3A]/40 transition flex items-center gap-3 cursor-pointer group text-left"
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
                  <div className="text-slate-400 group-hover:text-[#0B4F3A] transition">
                    {copiedColor === c.hex ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Tipografi Standartları */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-[#7A9A3B]" />
              <span>Tipografi ve Yazı Karakterleri</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-[#0B4F3A] uppercase tracking-wider block">
                  Başlık &amp; Portal Font Ailesi
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1 font-sans">
                  Plus Jakarta Sans / Montserrat
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {activeTab === "belediye"
                    ? "Dijital panellerde ve belediye duyurularında keskin, okunaklı Türkçe uyumlu geometrik sans-serif."
                    : "700. Yıl tarihi temasına uygun tırnaklı (Newsreader / Cinzel) prestijli kurumsal başlıklar."}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-[#7A9A3B] uppercase tracking-wider block">
                  Resmî Yazışma &amp; Evrak Fontu
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1 font-serif">
                  Times New Roman (12 pt) / Newsreader
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  T.C. Cumhurbaşkanlığı Resmî Yazışma Kılavuzuna tam uyumlu Times New Roman (12 pt, 2,5 cm kenar boşluğu).
                </p>
              </div>
            </div>
          </div>

          {/* 3. Logo ve Kullanım Kuralları */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Logo ve Güvenli Alan Standartları</span>
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <li>
                {activeTab === "belediye"
                  ? "1987 Çınar Yaprağı amblemi ve Osmangazi Belediyesi logosu asla deforme edilemez."
                  : "700. Yıl amblemi her panel ve etkinlik materyalinde Osmangazi Belediyesi logosuyla birlikte dengeli kullanılır."}
              </li>
              <li>Açık renkli zeminlerde tam renkli kurumsal logo, koyu zeminlerde negatif beyaz versiyonu uygulanır.</li>
              <li>Logonun çevresinde amblem yüksekliğinin en az 1/3&apos;ü kadar güvenli boşluk alanı korunur.</li>
              <li>Proje özeti ve resmî bilgi notu çıktılarında sayfa düzeni kılavuz kurallarına otomatik uyarlanır.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div className="flex flex-wrap items-center gap-2">
            {activeTab === "belediye" ? (
              <>
                <a
                  href={municipalPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B4F3A] hover:bg-[#083c2c] text-white text-xs font-semibold shadow-xs transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Rehber PDF&apos;ini Aç (67 MB) ↗</span>
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
                  <span>700. Yıl Kitapçık PDF&apos;ini Aç ↗</span>
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
            autoFocus
            onClick={() => dialogRef.current?.close()}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Kapat
          </button>
        </div>
      </dialog>
    </>
  );
}
