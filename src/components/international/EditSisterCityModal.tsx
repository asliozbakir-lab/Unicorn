"use client";

import { useState } from "react";
import { Edit2, X } from "lucide-react";
import { updateSisterCityAction } from "@/actions/international-actions";

interface EditSisterCityModalProps {
  city: {
    id: string;
    cityName: string;
    countryName: string;
    countryCode: string | null;
    flagEmoji: string | null;
    protocolDate: string | null;
    scope: string | null;
    notes: string | null;
    logoUrl: string | null;
  };
}

export function EditSisterCityModal({ city }: EditSisterCityModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await updateSisterCityAction(city.id, formData);

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
        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#176C55] hover:bg-slate-50 transition"
        title="Kardeş Şehir Bilgilerini Düzenle"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Kardeş Şehir Düzenle</h3>
                <p className="text-xs text-slate-500">{city.cityName} ({city.countryName})</p>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Şehir Adı *
                  </label>
                  <input
                    type="text"
                    name="cityName"
                    defaultValue={city.cityName}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ülke Adı *
                  </label>
                  <input
                    type="text"
                    name="countryName"
                    defaultValue={city.countryName}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Bayrak (Emoji)
                  </label>
                  <input
                    type="text"
                    name="flagEmoji"
                    defaultValue={city.flagEmoji || "🌐"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Protokol Yılı / Tarihi
                  </label>
                  <input
                    type="text"
                    name="protocolDate"
                    defaultValue={city.protocolDate || ""}
                    placeholder="Örn: 2022"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Logo / Arma URL veya Yolu
                </label>
                <input
                  type="text"
                  name="logoUrl"
                  defaultValue={city.logoUrl || ""}
                  placeholder="/logos/cities/susa.svg veya https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  İş Birliği Alanı
                </label>
                <input
                  type="text"
                  name="scope"
                  defaultValue={city.scope || ""}
                  placeholder="Örn: Kültür, Tarihi Miras ve Gençlik"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Açıklama / Notlar
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={city.notes || ""}
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
                  {loading ? "Kaydediliyor..." : "Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
