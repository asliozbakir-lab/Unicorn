"use client";

import { useState } from "react";
import { Plus, X, HardDrive, FileSpreadsheet, FileText, Presentation, Folder, Link as LinkIcon } from "lucide-react";
import { createDocumentAction } from "@/actions/document-actions";

export function NewDriveDocModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createDocumentAction(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold shadow-xs transition"
      >
        <Plus className="w-4 h-4" />
        <HardDrive className="w-4 h-4 text-emerald-200" />
        <span>Drive Belgesi Bağla</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#176C55] text-white flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Google Drive Belgesi Bağla</h3>
                  <p className="text-xs text-slate-500">Google Drive, Docs, Sheets veya Drive Klasörü Entegrasyonu</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Belge Başlığı *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Örn: 700. Yıl Panelleri Planlama Tablosu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Google Drive / Docs URL'si *
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    name="driveUrl"
                    required
                    placeholder="https://docs.google.com/spreadsheets/d/... veya drive.google.com/..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Drive'dan "Bağlantıyı Al" (Get Link) diyerek kopyaladığınız bağlantıyı yapıştırın.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Belge Türü
                  </label>
                  <select
                    name="type"
                    defaultValue="GOOGLE_SHEET"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  >
                    <option value="GOOGLE_SHEET">📊 Google E-Tablo (Sheets)</option>
                    <option value="GOOGLE_DOC">📄 Google Doküman (Docs)</option>
                    <option value="GOOGLE_SLIDES">📑 Google Slayt (Slides)</option>
                    <option value="GOOGLE_DRIVE_FOLDER">📁 Google Drive Klasörü</option>
                    <option value="CONTRACT">⚖️ Hibe Sözleşmesi / GA</option>
                    <option value="REPORT">📈 Teknik Rapor / Analiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <select
                    name="category"
                    defaultValue="CONQUEST_700"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  >
                    <option value="CONQUEST_700">🏛️ 700. Yıl & Fetih Panelleri</option>
                    <option value="INTERNATIONAL">🌐 Dış İlişkiler & Kardeş Şehirler</option>
                    <option value="GRANTS_PROJECTS">💡 Ar-Ge Projeleri & Fonlar</option>
                    <option value="CORPORATE_PUBLIC">🏢 Kurumsal Yönetim & Tanıtım</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Versiyon
                  </label>
                  <input
                    type="text"
                    name="version"
                    defaultValue="v1.0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Erişim İzni Durumu
                  </label>
                  <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium">
                    ✓ Google Workspace Entegre
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Açıklama / Kapsam Notu
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Belgenin içeriği, ilgili çalışma grubu veya revizyon notu..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#176C55] hover:bg-[#125845] text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
                >
                  {loading ? "Bağlanıyor..." : "Drive Belgesini Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
