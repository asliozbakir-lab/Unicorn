"use client";

import { useState } from "react";
import { Plus, X, Landmark, Users, Calendar } from "lucide-react";
import { createPanelAction } from "@/actions/panel-actions";

export function NewPanelModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createPanelAction(formData);

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
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#839B24] hover:bg-[#6f841f] text-white text-xs font-semibold shadow-sm transition"
      >
        <Plus className="w-4 h-4" />
        <span>Yeni Panel Ekle</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Yeni 700. Yıl Paneli Kaydı</h3>
                <p className="text-xs text-slate-500">Bursa'nın Fethi 700. Yıl Anma Etkinlikleri Kapsamında</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
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
                  Panel Başlığı *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Örn: Geçmiş ve Gelecek Bağlamında Bursa’da Sağlık"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    İlgili Oda / Kurum *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    required
                    placeholder="Örn: Bursa Tabip Odası"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    İrtibat Kişisi / Sorumlu
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    placeholder="Örn: Sevcan Hanım"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tarih / Dönem
                  </label>
                  <input
                    type="text"
                    name="date"
                    placeholder="Örn: 20.11.2026 veya Ekim 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mekân / Konum
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Örn: Panorama 1326 Bursa Fetih Müzesi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Moderatör
                </label>
                <input
                  type="text"
                  name="moderator"
                  placeholder="Örn: Prof. Dr. Alparslan TÜRKKAN"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Panelistler
                </label>
                <textarea
                  name="panelists"
                  rows={2}
                  placeholder="Panelist isimleri, unvanları ve kurumları..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Notlar / Planlama Detayları
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Teknik ihtiyaçlar, yayın planı, katılımcı hedefi..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#839B24] hover:bg-[#6f841f] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
                >
                  {loading ? "Kaydediliyor..." : "Paneli Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
