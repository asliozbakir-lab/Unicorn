"use client";

import { useState } from "react";
import { loginAction } from "@/actions/auth-actions";
import { Shield, Sparkles, Building2, UserCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Osmangazi360!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch {
      // Next.js redirect fırlatır, yakalamak gerekmez
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#176C55] text-white shadow-xl shadow-[#176C55]/20 mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          OSMANGAZİ AR-GE 360
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Osmangazi Belediyesi Araştırma ve Geliştirme Müdürlüğü Dijital Yönetim Portalı
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Kurumsal E-Posta
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ad.soyad@osmangazi.bel.tr"
                className="mt-1 block w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-[#176C55] focus:ring-1 focus:ring-[#176C55]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Şifre
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-[#176C55] focus:ring-1 focus:ring-[#176C55]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#176C55] hover:bg-[#125845] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#176C55] transition disabled:opacity-50"
            >
              {loading ? "Giriş yapılıyor..." : "Sisteme Giriş Yap"}
            </button>
          </form>

          {/* Hızlı Demo Hesapları */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#839B24]" />
              Hızlı Demo Girişi (Tek Tıkla Doldur)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin("serkan.cebeci@osmangazi.bel.tr")}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
              >
                <div className="font-semibold text-slate-800">Serkan Cebeci</div>
                <div className="text-slate-500 text-[10px]">AR-GE Müdürü</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("asli.okten@osmangazi.bel.tr")}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
              >
                <div className="font-semibold text-slate-800">Aslı Ökten</div>
                <div className="text-slate-500 text-[10px]">Tasarım Mühendisi</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@osmangazi.bel.tr")}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
              >
                <div className="font-semibold text-slate-800">Yönetici</div>
                <div className="text-slate-500 text-[10px]">Sistem Admin</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("denetim@osmangazi.bel.tr")}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
              >
                <div className="font-semibold text-slate-800">Denetçi</div>
                <div className="text-slate-500 text-[10px]">Salt Okunur</div>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Varsayılan Şifre: <code className="text-slate-600 font-mono">Osmangazi360!</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
