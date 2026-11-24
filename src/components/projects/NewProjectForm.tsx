"use client";

import { useState } from "react";
import Link from "next/link";
import { createProjectAction } from "@/actions/project-actions";

interface NewProjectFormProps {
  users: { id: string; name: string; title: string | null }[];
  fundingPrograms: { id: string; name: string }[];
  defaultUserId?: string;
}

export function NewProjectForm({ users, fundingPrograms, defaultUserId }: NewProjectFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createProjectAction(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch {
      // redirect
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Proje Adı */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Proje Adı *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Örn: Sürdürülebilir Kentsel Gıda Politikaları"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#176C55] focus:bg-white transition"
          />
        </div>

        {/* Proje Kodu */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Proje Kodu *
          </label>
          <input
            type="text"
            name="code"
            required
            placeholder="Örn: OGZ-INT-FOODPOLICY"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono placeholder-slate-400 focus:outline-none focus:border-[#176C55] focus:bg-white transition"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Kategori *
          </label>
          <select
            name="category"
            required
            defaultValue="INTERNATIONAL"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
          >
            <option value="INTERNATIONAL">Uluslararası Projeler</option>
            <option value="NATIONAL">Ulusal Projeler</option>
            <option value="CORPORATE">Kurumsal Projeler</option>
            <option value="INTERNAL">Kurum İçi Projeler</option>
          </select>
        </div>

        {/* Aşama */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Uygulama Aşaması
          </label>
          <select
            name="phase"
            defaultValue="PREPARATION"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
          >
            <option value="IDEA">Fikir / Taslak</option>
            <option value="PREPARATION">Hazırlık Aşamasında</option>
            <option value="SUBMITTED">Başvuruldu (Sonuç Bekleniyor)</option>
            <option value="APPROVED">Kabul Edildi</option>
            <option value="ACTIVE">Aktif (Uygulamada)</option>
            <option value="COMPLETED">Tamamlandı</option>
          </select>
        </div>

        {/* Sorumlu Personel */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Sorumlu Personel
          </label>
          <select
            name="responsibleUserId"
            defaultValue={defaultUserId}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.title || "Personel"})
              </option>
            ))}
          </select>
        </div>

        {/* Bütçe */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Bütçe Tutarı
          </label>
          <input
            type="number"
            step="0.01"
            name="budgetAmount"
            placeholder="150000"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#176C55] focus:bg-white transition"
          />
        </div>

        {/* Para Birimi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Para Birimi
          </label>
          <select
            name="currency"
            defaultValue="EUR"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
          >
            <option value="EUR">Euro (€)</option>
            <option value="TRY">Türk Lirası (₺)</option>
            <option value="USD">Amerikan Doları ($)</option>
          </select>
        </div>

        {/* Fon Programı */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Fon Programı
          </label>
          <select
            name="fundingProgramId"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#176C55] focus:bg-white transition"
          >
            <option value="">Seçiniz (Varsa)</option>
            {fundingPrograms.map((fp) => (
              <option key={fp.id} value={fp.id}>
                {fp.name}
              </option>
            ))}
          </select>
        </div>

        {/* İlgili Birim / Koordinatör Kurum */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Koordinatör Kurum / İlgili Birim
          </label>
          <input
            type="text"
            name="coordinatorOrg"
            placeholder="Örn: TU Delft veya Fen İşleri M."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#176C55] focus:bg-white transition"
          />
        </div>

        {/* Açıklama */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Proje Açıklaması
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Projenin amacı, kentsel katkısı ve temel hedefleri..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#176C55] focus:bg-white transition"
          />
        </div>
      </div>

      {/* Aksiyon Butonları */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <Link
          href="/projeler"
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          Vazgeç
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Projeyi Kaydet"}
        </button>
      </div>
    </form>
  );
}
