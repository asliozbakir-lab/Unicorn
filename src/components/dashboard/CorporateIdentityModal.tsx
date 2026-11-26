"use client";

import { useState } from "react";
import { BookOpen, X, ExternalLink, Palette, Type, Shield, Check, Copy } from "lucide-react";

export function CorporateIdentityModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colors = [
    { name: "Osmangazi Koyu Yeşili", hex: "#176C55", rgb: "23, 108, 85", role: "Ana Kurumsal Renk (Primary)" },
    { name: "Zeytin Yeşili / Fetih", hex: "#839B24", rgb: "131, 155, 36", role: "Vurgu Rengi (Secondary)" },
    { name: "Asalet Koyu Lacivert", hex: "#1A1A2E", rgb: "26, 26, 46", role: "Metin & Derinlik (Dark)" },
    { name: "Kurumsal Yumuşak Zemin", hex: "#F7F9F8", rgb: "247, 249, 248", role: "Fon & Arka Plan (Surface)" },
  ];

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
      >
        <BookOpen className="w-3.5 h-3.5 text-[#176C55]" />
        <span>Kurumsal Kimlik Kılavuzunu İncele</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#176C55] text-white flex items-center justify-center font-bold">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Osmangazi Belediyesi Kurumsal Kimlik Kılavuzu
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ar-Ge Müdürlüğü & 700. Yıl Resmî Tasarım ve Marka Standartları
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

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
              {/* 1. Renk Standartları */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#176C55]" />
                  <span>Resmî Kurumsal Renk Paleti (Tıklayarak Kopyalayın)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {colors.map((c) => (
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
                        <div className="text-[10px] text-slate-400">{c.role}</div>
                        <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                          {c.hex} • RGB({c.rgb})
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
                      Segoe UI / Arial / Impact
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Afişlerde, sempozyum başlıklarında ve sunumlarda bold/semi-bold ağırlıklar kullanılır.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-[#839B24] uppercase tracking-wider block">
                      Gövde & Metin Font Ailesi
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-1 font-sans">
                      Inter / Roboto / System UI
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Resmî yazışmalarda Times New Roman (12 pt), dijital portallarda okunaklı sans-serif.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Logo ve Amblem Kullanım Kuralları */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Amblem ve Logo Güvenlik Kuralları</span>
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <li>Osmangazi Belediyesi ve Ar-Ge 360 logosunun oranları (en/boy) asla deforme edilemez.</li>
                  <li>Açık renkli zeminlerde tam renkli amblem, koyu zeminlerde negatif beyaz versiyon tercih edilir.</li>
                  <li>Logonun çevresinde amblem yüksekliğinin en az 1/3'ü kadar boşluk (güvenli alan) bırakılmalıdır.</li>
                  <li>Resmî yazışma ve uluslararası konsorsiyum ortaklıklarında T.C. Cumhurbaşkanlığı Resmî Yazışma Kılavuzuna uygun antet kullanılır.</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <a
                href="https://drive.google.com/drive/folders/17113jZ-vMzb9WjXZeg7FlrGgblQ9xxzl"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold shadow-xs transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Drive Kurumsal Kimlik Klasörünü Aç ↗</span>
              </a>

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
