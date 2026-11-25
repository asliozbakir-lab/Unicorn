"use client";

import { useState } from "react";
import { Plus, X, Video, Users, Calendar } from "lucide-react";
import { createMeetingAction } from "@/actions/meeting-actions";

interface NewMeetingModalProps {
  projects: { id: string; name: string; code: string }[];
  users: { id: string; name: string; title: string | null }[];
  defaultUserId?: string;
}

export function NewMeetingModal({ projects, users, defaultUserId }: NewMeetingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createMeetingAction(formData);

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
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold shadow-sm transition"
      >
        <Plus className="w-4 h-4" />
        <span>Yeni Toplantı Kaydı</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Yeni Toplantı & Faaliyet Kaydı</h3>
                <p className="text-xs text-slate-500">Uluslararası konsorsiyum, ulusal veya kurum içi toplantı tutanağı</p>
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
                  Toplantı Başlığı *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Örn: Food Trails Milano Çalışma Grubu Online Toplantısı"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Toplantı Türü
                  </label>
                  <select
                    name="type"
                    defaultValue="ONLINE"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  >
                    <option value="ONLINE">Çevrim İçi (Zoom/Teams)</option>
                    <option value="IN_PERSON">Yüz Yüze</option>
                    <option value="HYBRID">Hibrit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tarih ve Saat *
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    required
                    defaultValue={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  İlgili Proje
                </label>
                <select
                  name="projectId"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                >
                  <option value="">Seçiniz (Varsa)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Toplantı Gündemi
                </label>
                <textarea
                  name="agenda"
                  rows={2}
                  placeholder="Gündem maddeleri..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alınan Kararlar & Aksiyonlar
                </label>
                <textarea
                  name="decisions"
                  rows={2}
                  placeholder="Toplantıda mutabık kalınan kararlar..."
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
                  className="px-5 py-2 rounded-xl bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
                >
                  {loading ? "Kaydediliyor..." : "Toplantıyı Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
