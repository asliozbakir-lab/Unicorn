import { formatCurrency, formatDate, CATEGORY_LABELS, PHASE_LABELS } from "@/lib/utils";

export interface ExportProjectData {
  id: string;
  code: string;
  name: string;
  category: string;
  phase: string;
  budgetAmount: number | null;
  currency: string;
  coordinatorOrg: string | null;
  municipalUnit: string | null;
  description: string | null;
  objectives: string | null;
  startDate: string | null;
  endDate: string | null;
  responsibleUserName: string | null;
  responsibleUserTitle: string | null;
  fundingProgramName: string | null;
  fundingProgramProvider: string | null;
  partnerships: {
    organizationName: string;
    countryName: string;
    type: string;
    role: string;
  }[];
  tasksCount: number;
}

export interface OfficialMemoOptions {
  recipient: string;
  docNumber: string;
  dateStr: string;
  signerName: string;
  signerTitle: string;
  extraNote?: string;
}

function esc(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function triggerBlobDownload(content: string, mimeType: string, filename: string) {
  const blob = new Blob(["\uFEFF" + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadProjectSummaryDoc(
  project: ExportProjectData,
  template: "executive" | "official-memo",
  options: OfficialMemoOptions
) {
  const catLabel = CATEGORY_LABELS[project.category]?.label || project.category;
  const phaseLabel = PHASE_LABELS[project.phase]?.label || project.phase;
  const budgetStr = formatCurrency(project.budgetAmount, project.currency);

  const partnersRows = project.partnerships.length
    ? project.partnerships
        .map(
          (p, i) => `
      <tr>
        <td style="border:1px solid #cbd5e1;padding:6px 8px;">${i + 1}</td>
        <td style="border:1px solid #cbd5e1;padding:6px 8px;">${esc(p.organizationName)}</td>
        <td style="border:1px solid #cbd5e1;padding:6px 8px;">${esc(p.countryName)}</td>
        <td style="border:1px solid #cbd5e1;padding:6px 8px;">${esc(p.role)}</td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="4" style="border:1px solid #cbd5e1;padding:6px 8px;text-align:center;color:#64748b;">Kayıtlı dış konsorsiyum ortağı bulunmamaktadır.</td></tr>`;

  let bodyHtml = "";

  if (template === "official-memo") {
    // T.C. Cumhurbaşkanlığı Resmî Yazışma Kurallarına Tam Uyumlu Şablon
    const subjectLine = `${esc(project.name)} (${esc(project.code)}) Projesi Bilgi Notu`;
    const bodyParagraph1 = `Müdürlüğümüz tarafından yürütülen ve ${esc(catLabel.toLowerCase())} proje portföyümüz kapsamında yer alan "${esc(project.name)}" başlıklı proje şu anda "${esc(phaseLabel)}" aşamasındadır. ${project.fundingProgramName ? `Proje ${esc(project.fundingProgramName)} (${esc(project.fundingProgramProvider || "İlgili Fon Kuruluşu")}) programı çerçevesinde değerlendirilmektedir.` : ""}`;
    const bodyParagraph2 = project.description
      ? esc(project.description)
      : "Proje kapsamında kentsel inovasyon, sürdürülebilir şehircilik ve kurumsal kapasite gelişimine yönelik teknik faaliyetler sürdürülmektedir.";
    const bodyParagraph3 = `Toplam proje bütçesi ${esc(budgetStr)} olarak öngörülmüş olup proje sorumluluğu ${esc(project.responsibleUserName || "Ar-Ge Personeli")}${project.municipalUnit ? ` ve ilgili birim (${esc(project.municipalUnit)})` : ""} koordinasyonunda yürütülmektedir.${options.extraNote ? " " + esc(options.extraNote) : ""}`;

    bodyHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" lang="tr">
<head>
<meta charset="utf-8" />
<title>${subjectLine}</title>
<style>
@page { size: A4 portrait; margin: 2.5cm 2.5cm 2.5cm 2.5cm; }
body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.15; color: #000000; }
.header { text-align: center; font-weight: bold; font-size: 12pt; line-height: 1.25; margin-bottom: 18pt; }
.meta-table { width: 100%; border-collapse: collapse; margin-bottom: 18pt; }
.recipient { text-align: center; font-weight: bold; text-transform: uppercase; margin: 18pt 0 18pt 0; }
.prose { text-align: justify; text-indent: 1.25cm; margin-bottom: 10pt; }
.closing { text-align: justify; text-indent: 1.25cm; margin-top: 12pt; margin-bottom: 24pt; }
.sig-wrap { width: 100%; margin-top: 18pt; }
.sig-box { float: right; text-align: center; width: 220pt; }
.footer-info { clear: both; margin-top: 42pt; border-top: 1px solid #000000; padding-top: 6pt; font-size: 9pt; line-height: 1.25; }
table.summary { width: 100%; border-collapse: collapse; font-size: 10pt; margin: 12pt 0; }
table.summary th { background: #f1f5f9; border: 1px solid #94a3b8; padding: 5px 7px; text-align: left; }
table.summary td { border: 1px solid #94a3b8; padding: 5px 7px; }
</style>
</head>
<body>
  <div class="header">
    T.C.<br/>
    BURSA OSMANGAZİ BELEDİYE BAŞKANLIĞI<br/>
    Araştırma ve Geliştirme Müdürlüğü
  </div>

  <table class="meta-table">
    <tr>
      <td style="text-align:left;vertical-align:top;"><strong>Sayı</strong> : ${esc(options.docNumber)}</td>
      <td style="text-align:right;vertical-align:top;">${esc(options.dateStr)}</td>
    </tr>
    <tr>
      <td colspan="2" style="text-align:left;padding-top:3pt;"><strong>Konu</strong> : ${subjectLine}</td>
    </tr>
  </table>

  <div class="recipient">${esc(options.recipient)}</div>

  <p class="prose">${bodyParagraph1}</p>
  <p class="prose">${bodyParagraph2}</p>
  <p class="prose">${bodyParagraph3}</p>

  <table class="summary">
    <tr><th style="width:32%;">Proje Kodu</th><td>${esc(project.code)}</td></tr>
    <tr><th>Kategori / Aşama</th><td>${esc(catLabel)} — ${esc(phaseLabel)}</td></tr>
    <tr><th>Bütçe / Fon Kaynağı</th><td>${esc(budgetStr)} ${project.fundingProgramName ? `(${esc(project.fundingProgramName)})` : ""}</td></tr>
    <tr><th>Koordinatör / Birim</th><td>${esc(project.coordinatorOrg || project.municipalUnit || "Osmangazi Belediyesi")}</td></tr>
    <tr><th>Dış Ortak / Görev</th><td>${project.partnerships.length} Kurum / ${project.tasksCount} İş Paketi</td></tr>
  </table>

  <p class="closing">Bilgilerinize arz ederim.</p>

  <div class="sig-wrap">
    <div class="sig-box">
      <strong>${esc(options.signerName)}</strong><br/>
      ${esc(options.signerTitle)}
    </div>
  </div>

  <div class="footer-info">
    <strong>Osmangazi Belediye Başkanlığı — Araştırma ve Geliştirme Müdürlüğü</strong><br/>
    Santral Garaj Mah. Ulubatlı Hasan Blv. No:10 Osmangazi / BURSA • E-posta: arge@osmangazi.bel.tr • Web: www.osmangazi.bel.tr
  </div>
</body>
</html>`;
  } else {
    // Kurumsal Proje Künyesi (Yönetici Özeti)
    bodyHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" lang="tr">
<head>
<meta charset="utf-8" />
<title>${esc(project.name)} - Kurumsal Proje Özeti</title>
<style>
@page { size: A4 portrait; margin: 1.8cm; }
body { font-family: "Segoe UI", Arial, sans-serif; font-size: 10.5pt; color: #14201B; line-height: 1.45; }
.banner { border-bottom: 3px solid #0B4F3A; padding-bottom: 10pt; margin-bottom: 14pt; }
.brand { color: #0B4F3A; font-size: 11pt; font-weight: bold; letter-spacing: 0.5px; }
h1 { font-size: 16pt; color: #0B4F3A; margin: 4pt 0 2pt 0; }
.meta { font-size: 9.5pt; color: #475569; }
.kpi-table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
.kpi-table td { border: 1px solid #cbd5e1; padding: 8pt; width: 25%; background: #f8fafc; }
.kpi-label { font-size: 8pt; text-transform: uppercase; color: #64748b; font-weight: bold; }
.kpi-val { font-size: 11pt; color: #0B4F3A; font-weight: bold; margin-top: 2pt; }
.sec-title { font-size: 11pt; font-weight: bold; color: #0B4F3A; border-left: 4px solid #7A9A3B; padding-left: 8pt; margin: 14pt 0 6pt 0; }
table.partners { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
table.partners th { background: #0B4F3A; color: #ffffff; padding: 6px 8px; text-align: left; }
</style>
</head>
<body>
  <div class="banner">
    <div class="brand">OSMANGAZİ BELEDİYESİ • ARAŞTIRMA VE GELİŞTİRME MÜDÜRLÜĞÜ</div>
    <h1>${esc(project.name)}</h1>
    <div class="meta">Proje Kodu: <strong>${esc(project.code)}</strong> • Rapor Tarihi: ${esc(options.dateStr)}</div>
  </div>

  <table class="kpi-table">
    <tr>
      <td><div class="kpi-label">Kategori</div><div class="kpi-val">${esc(catLabel)}</div></td>
      <td><div class="kpi-label">Mevcut Aşama</div><div class="kpi-val">${esc(phaseLabel)}</div></td>
      <td><div class="kpi-label">Proje Bütçesi</div><div class="kpi-val">${esc(budgetStr)}</div></td>
      <td><div class="kpi-label">Sorumlu</div><div class="kpi-val">${esc(project.responsibleUserName || "Atanmadı")}</div></td>
    </tr>
  </table>

  <div class="sec-title">Proje Özeti ve Kapsam</div>
  <p>${esc(project.description || "Açıklama girilmemiştir.")}</p>

  ${
    project.objectives
      ? `<div class="sec-title">Temel Hedefler ve Beklenen Çıktılar</div><p>${esc(project.objectives)}</p>`
      : ""
  }

  <div class="sec-title">Kurumsal ve Mali Bilgiler</div>
  <p>
    <strong>Fon Programı:</strong> ${esc(project.fundingProgramName || "Belediye Öz Kaynak")}<br/>
    <strong>Koordinatör Kurum:</strong> ${esc(project.coordinatorOrg || "Osmangazi Belediyesi")}<br/>
    <strong>İlgili Belediye Birimi:</strong> ${esc(project.municipalUnit || "Araştırma ve Geliştirme Müdürlüğü")}<br/>
    <strong>Tarih Aralığı:</strong> ${esc(formatDate(project.startDate))} — ${esc(formatDate(project.endDate))}
  </p>

  <div class="sec-title">Konsorsiyum ve Ortak Kurumlar (${project.partnerships.length})</div>
  <table class="partners">
    <thead>
      <tr>
        <th style="width:36px;">#</th>
        <th>Kurum Adı</th>
        <th>Ülke</th>
        <th>Rol</th>
      </tr>
    </thead>
    <tbody>${partnersRows}</tbody>
  </table>

  ${options.extraNote ? `<div class="sec-title">Yönetici Notu</div><p>${esc(options.extraNote)}</p>` : ""}
</body>
</html>`;
  }

  const safeCode = project.code.replace(/[^A-Za-z0-9_-]/g, "_");
  const suffix = template === "official-memo" ? "Resmi_Bilgi_Notu" : "Proje_Ozeti";
  triggerBlobDownload(bodyHtml, "application/msword;charset=utf-8", `${safeCode}_${suffix}.doc`);
}

export function downloadPortfolioDoc(projects: ExportProjectData[], filterLabel: string) {
  const dateStr = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const eurTotal = projects
    .filter((p) => p.currency === "EUR" && p.budgetAmount)
    .reduce((acc, p) => acc + (p.budgetAmount || 0), 0);
  const tryTotal = projects
    .filter((p) => p.currency === "TRY" && p.budgetAmount)
    .reduce((acc, p) => acc + (p.budgetAmount || 0), 0);

  const rows = projects
    .map((p, idx) => {
      const cat = CATEGORY_LABELS[p.category]?.label || p.category;
      const ph = PHASE_LABELS[p.phase]?.label || p.phase;
      return `
      <tr>
        <td style="border:1px solid #cbd5e1;padding:6px;">${idx + 1}</td>
        <td style="border:1px solid #cbd5e1;padding:6px;font-family:monospace;">${esc(p.code)}</td>
        <td style="border:1px solid #cbd5e1;padding:6px;"><strong>${esc(p.name)}</strong><br/><span style="font-size:8.5pt;color:#475569;">${esc((p.description || "").slice(0, 140))}</span></td>
        <td style="border:1px solid #cbd5e1;padding:6px;">${esc(cat)}</td>
        <td style="border:1px solid #cbd5e1;padding:6px;">${esc(ph)}</td>
        <td style="border:1px solid #cbd5e1;padding:6px;text-align:right;">${esc(formatCurrency(p.budgetAmount, p.currency))}</td>
        <td style="border:1px solid #cbd5e1;padding:6px;">${esc(p.responsibleUserName || "—")}</td>
      </tr>`;
    })
    .join("");

  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" lang="tr">
<head>
<meta charset="utf-8" />
<title>Osmangazi Ar-Ge Proje Portföy Özeti</title>
<style>
@page { size: A4 portrait; margin: 1.8cm; }
body { font-family: "Segoe UI", Arial, sans-serif; font-size: 10pt; color: #14201B; }
h1 { color: #0B4F3A; font-size: 15pt; margin: 0 0 4pt 0; }
.sub { color: #475569; font-size: 9.5pt; border-bottom: 2px solid #0B4F3A; padding-bottom: 8pt; margin-bottom: 12pt; }
table.main { width: 100%; border-collapse: collapse; font-size: 9pt; }
table.main th { background: #0B4F3A; color: #ffffff; padding: 6px; text-align: left; }
</style>
</head>
<body>
  <h1>OSMANGAZİ BELEDİYESİ AR-GE MÜDÜRLÜĞÜ — PROJE ÖZETİ RAPORU</h1>
  <div class="sub">Kapsam: <strong>${esc(filterLabel)}</strong> • Toplam: <strong>${projects.length} Proje</strong> • EUR Bütçe: <strong>${esc(formatCurrency(eurTotal, "EUR"))}</strong> • TRY Bütçe: <strong>${esc(formatCurrency(tryTotal, "TRY"))}</strong> • Tarih: ${esc(dateStr)}</div>
  <table class="main">
    <thead>
      <tr>
        <th style="width:28px;">#</th>
        <th style="width:95px;">Kod</th>
        <th>Proje Adı ve Özeti</th>
        <th style="width:80px;">Kategori</th>
        <th style="width:75px;">Aşama</th>
        <th style="width:85px;">Bütçe</th>
        <th style="width:90px;">Sorumlu</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

  triggerBlobDownload(html, "application/msword;charset=utf-8", `Osmangazi_ArGe_Proje_Raporu_${Date.now().toString().slice(-6)}.doc`);
}

export function downloadPortfolioCsv(projects: ExportProjectData[]) {
  const headers = [
    "Proje Kodu",
    "Proje Adı",
    "Kategori",
    "Aşama",
    "Bütçe",
    "Para Birimi",
    "Fon Programı",
    "Koordinatör / Birim",
    "Sorumlu Personel",
    "Açıklama",
  ];

  const escapeCsv = (val: string | number | null | undefined) => {
    const s = String(val ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ");
    return `"${s}"`;
  };

  const lines = [
    headers.map(escapeCsv).join(";"),
    ...projects.map((p) =>
      [
        p.code,
        p.name,
        CATEGORY_LABELS[p.category]?.label || p.category,
        PHASE_LABELS[p.phase]?.label || p.phase,
        p.budgetAmount ?? 0,
        p.currency,
        p.fundingProgramName || "Öz Kaynak",
        p.coordinatorOrg || p.municipalUnit || "Osmangazi Belediyesi",
        p.responsibleUserName || "",
        p.description || "",
      ]
        .map(escapeCsv)
        .join(";")
    ),
  ];

  triggerBlobDownload(lines.join("\r\n"), "text/csv;charset=utf-8", `Osmangazi_ArGe_Projeler_${Date.now().toString().slice(-6)}.csv`);
}
