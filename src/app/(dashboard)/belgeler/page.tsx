import { prisma } from "@/lib/prisma";
import {
  FileText,
  HardDrive,
  FileSpreadsheet,
  FileCheck2,
  FolderOpen,
  ExternalLink,
  ShieldCheck,
  Search,
} from "lucide-react";
import { NewDriveDocModal } from "@/components/documents/NewDriveDocModal";
import { DocumentCard } from "@/components/documents/DocumentCard";

interface DocumentsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const resolvedParams = await searchParams;
  const categoryFilter = typeof resolvedParams.kategori === "string" ? resolvedParams.kategori : undefined;

  const whereClause: any = {};
  if (categoryFilter) {
    whereClause.category = categoryFilter;
  }

  const [documents, totalCount, driveCount, contractCount, reportCount] = await Promise.all([
    prisma.document.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    }),
    prisma.document.count(),
    prisma.document.count({ where: { category: "GOOGLE_DRIVE" } }),
    prisma.document.count({ where: { category: "CONTRACT" } }),
    prisma.document.count({ where: { category: "REPORT" } }),
  ]);

  return (
    <div className="space-y-8">
      {/* Üst Başlık & Butonlar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#176C55] uppercase tracking-wider bg-[#176C55]/10 px-2 py-0.5 rounded flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" />
              Google Drive Workspace
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Bulut Belge & Sözleşme Arşivi
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Belge ve Doküman Yönetimi
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ar-Ge Müdürlüğü Google Drive e-tabloları, sözleşmeleri, teknik raporları ve 700. yıl dokümanları
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://drive.google.com/drive/folders/1NbO_5Ph8nUrtMpI0t4auipVjippJk3EY"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-[#176C55] text-xs font-semibold shadow-xs transition"
          >
            <FolderOpen className="w-4 h-4 text-emerald-600" />
            <span>Ar-Ge Drive Klasörünü Aç ↗</span>
          </a>
          <NewDriveDocModal />
        </div>
      </div>

      {/* METRİK ŞERİDİ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#176C55] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Toplam Belge</div>
            <div className="text-lg font-bold text-slate-900">{totalCount} Kayıt</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Google Drive</div>
            <div className="text-lg font-bold text-slate-900">{driveCount} Bağlantı</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Sözleşmeler & GA</div>
            <div className="text-lg font-bold text-slate-900">{contractCount} Dosya</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Raporlar & Denetim</div>
            <div className="text-lg font-bold text-slate-900">{reportCount} Rapor</div>
          </div>
        </div>
      </div>

      {/* KATEGORİ FİLTRE TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <a
          href="/belgeler"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            !categoryFilter
              ? "bg-[#176C55] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tüm Belgeler ({totalCount})
        </a>
        <a
          href="/belgeler?kategori=GOOGLE_DRIVE"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            categoryFilter === "GOOGLE_DRIVE"
              ? "bg-[#176C55] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          Google Drive Belgeleri ({driveCount})
        </a>
        <a
          href="/belgeler?kategori=CONTRACT"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            categoryFilter === "CONTRACT"
              ? "bg-[#176C55] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Hibe Sözleşmeleri ({contractCount})
        </a>
        <a
          href="/belgeler?kategori=REPORT"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            categoryFilter === "REPORT"
              ? "bg-[#176C55] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Teknik Raporlar & Denetim ({reportCount})
        </a>
      </div>

      {/* BELGELER LİSTESİ / IZGARA */}
      {documents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80">
          <HardDrive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Bu kategoride henüz belge bulunmuyor</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            "Drive Belgesi Bağla" butonuna tıklayarak Google Drive veya Doküman bağlantısı ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
