"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Printer,
  FileText,
  Copy,
  Check,
  X,
  Building2,
  ScrollText,
} from "lucide-react";
import {
  downloadProjectSummaryDoc,
  type ExportProjectData,
} from "@/lib/export-utils";
import {
  formatCurrency,
  formatDate,
  CATEGORY_LABELS,
  PHASE_LABELS,
} from "@/lib/utils";

interface ProjectPrintButtonProps {
  project: ExportProjectData;
  compact?: boolean;
}

export function ProjectPrintButton({ project, compact = false }: ProjectPrintButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [template, setTemplate] = useState<"executive" | "official-memo">("executive");
  const [recipient, setRecipient] = useState("BAŞKANLIK MAKAMINA");
  const [docNumber, setDocNumber] = useState("E-88241502-010-2026");
  const [signerName, setSignerName] = useState("Serkan CEBECİ");
  const [signerTitle, setSignerTitle] = useState("Araştırma ve Geliştirme Müdürü");
  const [extraNote, setExtraNote] = useState("");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const todayFormatted = new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Native <dialog> light-dismiss fallback when closedby="any" unsupported
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

  const handlePrint = () => {
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
      // Fallback cleanup in case afterprint doesn't fire in some environments
      setTimeout(cleanup, 1200);
    }, 80);
  };

  const handleDownloadWord = () => {
    downloadProjectSummaryDoc(project, template, {
      recipient,
      docNumber,
      dateStr: todayFormatted,
      signerName,
      signerTitle,
      extraNote,
    });
  };

  const handleCopyText = () => {
    const cat = CATEGORY_LABELS[project.category]?.label || project.category;
    const ph = PHASE_LABELS[project.phase]?.label || project.phase;
    const text = [
      `OSMANGAZİ BELEDİYESİ AR-GE MÜDÜRLÜĞÜ — PROJE ÖZETİ`,
      `Proje: ${project.name} (${project.code})`,
      `Kategori / Aşama: ${cat} | ${ph}`,
      `Bütçe: ${formatCurrency(project.budgetAmount, project.currency)}`,
      `Fon Programı: ${project.fundingProgramName || "Belediye Öz Kaynak"}`,
      `Koordinatör / Birim: ${project.coordinatorOrg || project.municipalUnit || "Osmangazi Belediyesi"}`,
      `Sorumlu: ${project.responsibleUserName || "Atanmadı"}`,
      `Özet: ${project.description || "—"}`,
      project.objectives ? `Hedefler: ${project.objectives}` : null,
      extraNote ? `Not: ${extraNote}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const catLabel = CATEGORY_LABELS[project.category]?.label || project.category;
  const phaseLabel = PHASE_LABELS[project.phase]?.label || project.phase;
  const budgetStr = formatCurrency(project.budgetAmount, project.currency);

  const renderSheetContent = () => {
    if (template === "official-memo") {
      return (
        <div
          className="print-official-memo bg-white text-black p-8 sm:p-10 mx-auto max-w-[210mm] border border-slate-200 shadow-xs"
          style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "12pt", lineHeight: 1.15 }}
        >
          {/* Antet */}
          <div className="text-center font-bold leading-snug mb-6">
            <div>T.C.</div>
            <div>BURSA OSMANGAZİ BELEDİYE BAŞKANLIĞI</div>
            <div>Araştırma ve Geliştirme Müdürlüğü</div>
          </div>

          {/* Sayı / Tarih / Konu */}
          <div className="flex justify-between items-baseline mb-1">
            <div>
              <strong>Sayı</strong> : {docNumber}
            </div>
            <div>{todayFormatted}</div>
          </div>
          <div className="mb-6">
            <strong>Konu</strong> : {project.name} ({project.code}) Projesi Bilgi Notu
          </div>

          {/* Muhatap */}
          <div className="text-center font-bold uppercase my-6">{recipient}</div>

          {/* Metin (Gövde) */}
          <div className="space-y-3 text-justify">
            <p style={{ textIndent: "1.25cm" }}>
              Müdürlüğümüz tarafından yürütülen ve {catLabel.toLowerCase()} proje portföyümüz kapsamında yer alan &ldquo;
              {project.name}&rdquo; başlıklı proje şu anda &ldquo;{phaseLabel}&rdquo; aşamasındadır.{" "}
              {project.fundingProgramName
                ? `Proje ${project.fundingProgramName} (${project.fundingProgramProvider || "İlgili Fon Kuruluşu"}) programı çerçevesinde değerlendirilmektedir.`
                : ""}
            </p>
            <p style={{ textIndent: "1.25cm" }}>
              {project.description ||
                "Proje kapsamında kentsel inovasyon, sürdürülebilir şehircilik ve kurumsal kapasite gelişimine yönelik teknik faaliyetler sürdürülmektedir."}
            </p>
            <p style={{ textIndent: "1.25cm" }}>
              Toplam proje bütçesi {budgetStr} olarak öngörülmüş olup proje sorumluluğu{" "}
              {project.responsibleUserName || "Ar-Ge Personeli"}
              {project.municipalUnit ? ` ve ilgili birim (${project.municipalUnit})` : ""} koordinasyonunda yürütülmektedir.
              {extraNote ? ` ${extraNote}` : ""}
            </p>
          </div>

          {/* Künye Tablosu */}
          <table className="w-full border-collapse my-5 text-[10pt]">
            <tbody>
              <tr>
                <th className="border border-slate-400 bg-slate-100 p-1.5 text-left w-1/3">Proje Kodu</th>
                <td className="border border-slate-400 p-1.5">{project.code}</td>
              </tr>
              <tr>
                <th className="border border-slate-400 bg-slate-100 p-1.5 text-left">Kategori / Aşama</th>
                <td className="border border-slate-400 p-1.5">
                  {catLabel} — {phaseLabel}
                </td>
              </tr>
              <tr>
                <th className="border border-slate-400 bg-slate-100 p-1.5 text-left">Bütçe / Fon Kaynağı</th>
                <td className="border border-slate-400 p-1.5">
                  {budgetStr} {project.fundingProgramName ? `(${project.fundingProgramName})` : ""}
                </td>
              </tr>
              <tr>
                <th className="border border-slate-400 bg-slate-100 p-1.5 text-left">Koordinatör / Birim</th>
                <td className="border border-slate-400 p-1.5">
                  {project.coordinatorOrg || project.municipalUnit || "Osmangazi Belediyesi"}
                </td>
              </tr>
              <tr>
                <th className="border border-slate-400 bg-slate-100 p-1.5 text-left">Dış Ortak / İş Paketi</th>
                <td className="border border-slate-400 p-1.5">
                  {project.partnerships.length} Kurum / {project.tasksCount} İş Paketi
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mt-4" style={{ textIndent: "1.25cm" }}>
            Bilgilerinize arz ederim.
          </p>

          {/* İmza Bloğu */}
          <div className="mt-8 flex justify-end">
            <div className="text-center min-w-[200px]">
              <div className="font-bold">{signerName}</div>
              <div>{signerTitle}</div>
            </div>
          </div>

          {/* Alt İletişim Bilgisi */}
          <div className="mt-12 pt-2 border-t border-black text-[9pt] leading-snug">
            <div className="font-bold">Osmangazi Belediye Başkanlığı — Araştırma ve Geliştirme Müdürlüğü</div>
            <div>Santral Garaj Mah. Ulubatlı Hasan Blv. No:10 Osmangazi / BURSA • arge@osmangazi.bel.tr</div>
          </div>
        </div>
      );
    }

    // 1. Kurumsal Proje Künyesi (Renkli A4)
    return (
      <div className="bg-white text-slate-900 p-8 mx-auto max-w-[210mm] border border-slate-200 shadow-xs space-y-5">
        {/* Üst Kurumsal Antet */}
        <div className="flex items-center justify-between border-b-2 border-[#0B4F3A] pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/brand/osmangazi-logo.png"
              alt="Osmangazi Belediyesi"
              className="w-12 h-12 object-contain"
            />
            <div>
              <div className="text-[11px] font-bold text-[#0B4F3A] uppercase tracking-wider">
                Osmangazi Belediyesi • Araştırma ve Geliştirme Müdürlüğü
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight mt-0.5">
                {project.name}
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                Kod: <strong className="font-mono text-slate-700">{project.code}</strong> • Tarih: {todayFormatted}
              </div>
            </div>
          </div>
        </div>

        {/* 4'lü Özet Şerit */}
        <div className="grid grid-cols-4 gap-3 print-avoid-break">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Kategori</div>
            <div className="text-xs font-bold text-[#0B4F3A] mt-1">{catLabel}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Aşama</div>
            <div className="text-xs font-bold text-slate-900 mt-1">{phaseLabel}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Proje Bütçesi</div>
            <div className="text-xs font-bold text-[#0B4F3A] mt-1">{budgetStr}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Proje Sorumlusu</div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate">
              {project.responsibleUserName || "Atanmadı"}
            </div>
          </div>
        </div>

        {/* Özet */}
        <div className="space-y-1.5 print-avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B4F3A] border-l-4 border-[#7A9A3B] pl-2.5">
            Proje Özeti ve Kapsam
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            {project.description || "Açıklama girilmemiştir."}
          </p>
        </div>

        {project.objectives && (
          <div className="space-y-1.5 print-avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B4F3A] border-l-4 border-[#7A9A3B] pl-2.5">
              Temel Hedefler ve Çıktılar
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">{project.objectives}</p>
          </div>
        )}

        {/* Kurumsal Detaylar */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200 print-avoid-break">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Fon Kaynağı</span>
            <span className="font-semibold text-slate-800">
              {project.fundingProgramName || "Belediye Öz Kaynak"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Koordinatör / Birim</span>
            <span className="font-semibold text-slate-800">
              {project.coordinatorOrg || project.municipalUnit || "Osmangazi Belediyesi"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Başlangıç / Bitiş</span>
            <span className="font-semibold text-slate-800">
              {formatDate(project.startDate)} — {formatDate(project.endDate)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">İş Paketi / Görev</span>
            <span className="font-semibold text-slate-800">{project.tasksCount} Aktif Görev</span>
          </div>
        </div>

        {/* Ortaklar Tablosu */}
        <div className="space-y-2 print-avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B4F3A] border-l-4 border-[#7A9A3B] pl-2.5">
            Konsorsiyum Ortakları ({project.partnerships.length})
          </h3>
          {project.partnerships.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Kayıtlı dış konsorsiyum ortağı bulunmamaktadır.</p>
          ) : (
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[#0B4F3A] text-white">
                  <th className="p-2 text-left w-8">#</th>
                  <th className="p-2 text-left">Kurum</th>
                  <th className="p-2 text-left">Ülke</th>
                  <th className="p-2 text-left">Rol</th>
                </tr>
              </thead>
              <tbody>
                {project.partnerships.map((p, idx) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="p-2 text-slate-500">{idx + 1}</td>
                    <td className="p-2 font-semibold text-slate-900">{p.organizationName}</td>
                    <td className="p-2 text-slate-600">{p.countryName}</td>
                    <td className="p-2 text-slate-600">{p.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {extraNote && (
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 print-avoid-break">
            <strong className="text-amber-900">Yönetici Notu:</strong> {extraNote}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          title="Proje Özeti Çıktısı Al (PDF / Word)"
          aria-label="Proje Özeti Çıktısı Al"
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#0B4F3A] text-slate-500 hover:text-white transition"
        >
          <Printer className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B4F3A] hover:bg-[#083c2c] text-white text-xs font-bold shadow-xs transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Çıktı Al / Özet İndir</span>
        </button>
      )}

      {/* Yazdırma Portalı: yalnızca yazdırma sırasında görünür */}
      {mounted &&
        isPrinting &&
        createPortal(
          <div id="print-sheet-portal" className="hidden print:block">
            {renderSheetContent()}
          </div>,
          document.body
        )}

      {/* Native <dialog> Proje Özeti Çıktı Stüdyosu */}
      <dialog
        ref={dialogRef}
        {...({ closedby: "any" } as any)}
        aria-labelledby={`print-dialog-title-${project.id}`}
        className="m-auto bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col p-0 overflow-hidden no-print"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B4F3A] text-white flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h1 id={`print-dialog-title-${project.id}`} className="text-sm sm:text-base font-bold text-slate-900">
                Proje Özeti Çıktı &amp; Dışa Aktarma Stüdyosu
              </h1>
              <p className="text-xs text-slate-500">
                {project.code} — A4 PDF yazdırma, Word (.doc) ve Resmî Makam Bilgi Notu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Kapat"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Şablon Seçici & Resmî Yazı Ayarları */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTemplate("executive")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  template === "executive"
                    ? "bg-white text-[#0B4F3A] shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>1. Kurumsal Proje Künyesi (A4)</span>
              </button>
              <button
                type="button"
                onClick={() => setTemplate("official-memo")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  template === "official-memo"
                    ? "bg-white text-[#0B4F3A] shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>2. Resmî Makam Bilgi Notu (Kılavuz Uyumlu)</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Kopyalandı" : "Metni Kopyala"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadWord}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#0B4F3A]/30 bg-emerald-50 hover:bg-emerald-100 text-[#0B4F3A] text-xs font-bold transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Word (.doc) İndir</span>
              </button>

              <button
                type="button"
                autoFocus
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B4F3A] hover:bg-[#083c2c] text-white text-xs font-bold shadow-xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Yazdır / PDF Kaydet</span>
              </button>
            </div>
          </div>

          {template === "official-memo" ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Muhatap Makam</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Evrak Sayısı</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">İmzalayan Ad SOYAD</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Unvan</label>
                <input
                  type="text"
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <input
                type="text"
                value={extraNote}
                onChange={(e) => setExtraNote(e.target.value)}
                placeholder="İsteğe bağlı: Çıktıya eklenecek yönetici notu veya toplantı tarihi yazabilirsiniz..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700"
              />
            </div>
          )}
        </div>

        {/* Canlı A4 Önizleme Alanı */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/70">
          {renderSheetContent()}
        </div>
      </dialog>
    </>
  );
}
