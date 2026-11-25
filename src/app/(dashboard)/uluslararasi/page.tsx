import { prisma } from "@/lib/prisma";
import { Globe2, Building2, MapPin, Award, Building, Calendar, HeartHandshake } from "lucide-react";
import { NewSisterCityModal } from "@/components/international/NewSisterCityModal";
import { NewUnionModal } from "@/components/international/NewUnionModal";

export default async function InternationalRelationsPage() {
  const [sisterCities, unions, countries, organizations] = await Promise.all([
    prisma.sisterCity.findMany({
      orderBy: { cityName: "asc" },
    }),
    prisma.networkMembership.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.country.findMany({
      include: { organizations: true },
      orderBy: { name: "asc" },
    }),
    prisma.organization.findMany({
      include: { country: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Üst Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Uluslararası İlişkiler, Kardeş Şehirler ve Ağlar
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Osmangazi Belediyesi'nin kardeş şehirleri, üye olduğu uluslararası birlikler, 35 partner ülke ve 174 konsorsiyum ortağı
        </p>
      </div>

      {/* METRİK ŞERİDİ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Kardeş Şehirler</div>
            <div className="text-lg font-bold text-slate-900">{sisterCities.length} Şehir</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Üye Birlikler</div>
            <div className="text-lg font-bold text-slate-900">{unions.length} Birlik / Ağ</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Partner Ülkeler</div>
            <div className="text-lg font-bold text-slate-900">{countries.length} Ülke</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Ortak Kurumlar</div>
            <div className="text-lg font-bold text-slate-900">{organizations.length}+ Kuruluş</div>
          </div>
        </div>
      </div>

      {/* 1. BÖLÜM: KARDEŞ ŞEHİRLERİMİZ */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-rose-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Kardeş Şehirlerimiz ({sisterCities.length})</h2>
              <p className="text-xs text-slate-500">Resmî protokol ve meclis kararıyla kurulan kardeş şehir iş birlikleri</p>
            </div>
          </div>
          <NewSisterCityModal />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sisterCities.map((city) => (
            <div
              key={city.id}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{city.flagEmoji || "🌐"}</span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{city.cityName}</h3>
                      <p className="text-[11px] text-slate-500">{city.countryName}</p>
                    </div>
                  </div>
                  {city.protocolDate && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                      Protokol: {city.protocolDate}
                    </span>
                  )}
                </div>

                {city.scope && (
                  <div className="text-xs text-[#176C55] font-medium bg-[#176C55]/5 p-2 rounded-lg border border-[#176C55]/10 mt-2">
                    <span className="font-bold block text-[10px] uppercase text-[#176C55]">İş Birliği Alanı:</span>
                    {city.scope}
                  </div>
                )}

                {city.notes && (
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {city.notes}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Aktif İlişki
                </span>
                {city.logoUrl && (
                  <a
                    href={city.logoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#176C55] hover:underline font-medium text-[10px]"
                  >
                    Resmî Arma Görseli ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BÖLÜM: ÜYESİ OLUNAN BİRLİKLER VE AĞLAR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#176C55]" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Üyesi Olunan Birlikler ve Uluslararası Ağlar ({unions.length})</h2>
              <p className="text-xs text-slate-500">Eurocities, UCLG-MEWA, UNESCO, MBB ve küresel şehir platformları</p>
            </div>
          </div>
          <NewUnionModal />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {unions.map((net) => (
            <div key={net.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-xs font-bold text-slate-900">{net.name}</div>
                  {net.joinedYear && (
                    <span className="text-[10px] font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      Üyelik: {net.joinedYear}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{net.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                <span className="text-[#839B24] font-semibold">Aktif Temsil</span>
                <span className="text-slate-400">Ar-Ge Müdürlüğü</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. BÖLÜM: 35 PARTNER ÜLKE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Partner Ülkeler ({countries.length})</h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
            35 Ülke Ağı
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

      {/* 4. BÖLÜM: SEÇKİN PARTNER KURULUŞLAR (ÜNİVERSİTELER & BELEDİYELER) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-bold text-slate-900">Seçkin Konsorsiyum Ortakları</h2>
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
