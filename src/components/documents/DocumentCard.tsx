"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Presentation,
  Folder,
  ExternalLink,
  Trash2,
  HardDrive,
  Eye,
  X,
  FileCheck2,
} from "lucide-react";
import { deleteDocumentAction } from "@/actions/document-actions";

interface DocumentProps {
  doc: {
    id: string;
    name: string;
    type: string;
    category: string;
    filePath: string;
    driveUrl: string | null;
    description: string | null;
    version: string;
    uploadedBy: string | null;
    createdAt: Date;
  };
}

export function DocumentCard({ doc }: DocumentProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getDocIcon = (type: string) => {
    switch (type) {
      case "GOOGLE_SHEET":
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case "GOOGLE_DOC":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "GOOGLE_SLIDES":
        return <Presentation className="w-5 h-5 text-amber-600" />;
      case "GOOGLE_DRIVE_FOLDER":
        return <Folder className="w-5 h-5 text-indigo-600" />;
      case "CONTRACT":
        return <FileCheck2 className="w-5 h-5 text-purple-600" />;
      default:
        return <HardDrive className="w-5 h-5 text-[#176C55]" />;
    }
  };

  const getDocBadge = (type: string) => {
    switch (type) {
      case "GOOGLE_SHEET":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">E-Tablo</span>;
      case "GOOGLE_DOC":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">Doküman</span>;
      case "GOOGLE_SLIDES":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">Slayt</span>;
      case "GOOGLE_DRIVE_FOLDER":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">Drive Klasörü</span>;
      case "CONTRACT":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">Sözleşme</span>;
      case "REPORT":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">Rapor / PDF</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">Belge</span>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "CONQUEST_700":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">700. Yıl</span>;
      case "INTERNATIONAL":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">Dış İlişkiler</span>;
      case "GRANTS_PROJECTS":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#176C55] border border-emerald-200">Ar-Ge & Hibe</span>;
      case "CORPORATE_PUBLIC":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">Kurumsal</span>;
      default:
        return null;
    }
  };

  const handleDelete = async () => {
    if (!confirm(`"${doc.name}" belgesini portal arşivinden silmek istediğinize emin misiniz?`)) return;
    setDeleting(true);
    await deleteDocumentAction(doc.id);
  };

  const driveUrl = doc.driveUrl || doc.filePath;

  return (
    <>
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:shadow-md transition flex flex-col justify-between space-y-4">
        <div>
          {/* Üst satır: İkon, rozet ve versiyon */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {getDocIcon(doc.type)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {doc.name}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  {getCategoryBadge(doc.category)}
                  {getDocBadge(doc.type)}
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200">
                    {doc.version}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Açıklama */}
          {doc.description && (
            <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
              {doc.description}
            </p>
          )}
        </div>

        {/* Alt bilgi ve Eylemler */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-[11px] text-slate-400">
            {doc.uploadedBy ? (
              <span>Yükleyen: <strong className="text-slate-600">{doc.uploadedBy}</strong></span>
            ) : (
              <span>Sistem Arşivi</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Önizleme butonu */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition flex items-center gap-1 text-[11px] font-medium"
              title="Portaldan İncele"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Göz At</span>
            </button>

            {/* Google Drive'da Aç butonu */}
            <a
              href={driveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-[#176C55] hover:bg-[#125845] text-white font-medium flex items-center gap-1 text-[11px] shadow-xs transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Drive'da Aç</span>
            </a>

            {/* Sil butonu */}
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Kaldır"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Önizleme / Detay Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  {getDocIcon(doc.type)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                  <p className="text-[11px] text-slate-500">{doc.description || "Google Drive Bağlantısı"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Drive'da Tam Ekran Aç</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={driveUrl}
                className="w-full h-full border-0"
                title={doc.name}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
