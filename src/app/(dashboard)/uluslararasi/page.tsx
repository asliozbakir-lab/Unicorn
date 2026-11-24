import { prisma } from "@/lib/prisma";
import { Globe2, Building2, MapPin, Award } from "lucide-react";

export default async function InternationalRelationsPage() {
  const [countries, organizations, networks] = await Promise.all([
    prisma.country.findMany({
      include: { organizations: true },
      orderBy: { name: "asc" },
    }),
    prisma.organization.findMany({
      include: { country: true },
      orderBy: { name: "asc" },
    }),
    prisma.networkMembership.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Uluslararası İlişkiler & Ağlar</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Osmangazi Belediyesi'nin 35 partner ülkesi, 174 konsorsiyum ortağı ve üye olduğu küresel şehir ağları
        </p>
      </div>

      {/* ŞEHİR AĞLARI */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-[#176C55]" />
          <h2 className="text-base font-bold text-slate-900">Üye Olunan Uluslararası Şehir Ağları</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {networks.map((net) => (
            <div key={net.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-900">{net.name}</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{net.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 35 PARTNER ÜLKE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Partner Ülkeler ({countries.length})</h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
            ISO-3166 Standardı
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {countries.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition flex items-center gap-2.5"
            >
              <span className="text-xl">{c.flagEmoji || "🌐"}</span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">{c.name}</div>
                <div className="text-[10px] font-mono text-slate-400">{c.code}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRESTİJLİ PARTNER KURUMLAR (ÜNİVERSİTELER & BELEDİYELER) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-bold text-slate-900">Seçkin Partner Kuruluşlar</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {organizations.map((org) => (
            <div key={org.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 truncate">{org.name}</span>
                <span className="text-base shrink-0">{org.country.flagEmoji}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {org.city ? `${org.city}, ` : ""}{org.country.name} • <span className="font-medium text-[#176C55]">{org.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
