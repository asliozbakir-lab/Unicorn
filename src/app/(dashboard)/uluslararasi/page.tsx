import { prisma } from "@/lib/prisma";
import { Globe2, Building2, MapPin, Award, Building, Calendar, HeartHandshake } from "lucide-react";
import { NewSisterCityModal } from "@/components/international/NewSisterCityModal";
import { NewUnionModal } from "@/components/international/NewUnionModal";
import { SisterCityCard } from "@/components/international/SisterCityCard";

function getUnionLogo(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes("eurocities")) return "/logos/birlikler/eurocities.jpg";
  if (n.includes("uclg")) return "/logos/birlikler/uclg_mewa.png";
  if (n.includes("tarihi kentler birliği") && !n.includes("dünya")) return "/logos/birlikler/tarihi_kentler_birligi.jpg";
  if (n.includes("dünya tarihi kentler") || n.includes("lhc")) return "/logos/birlikler/lhc_historical_cities.png";
  if (n.includes("civitas")) return "/logos/birlikler/civitas.png";
  if (n.includes("marmara belediyeler") || n.includes("mbb")) return "/logos/birlikler/marmara_belediyeler_birligi.jpg";
  if (n.includes("türkiye belediyeler") || n.includes("tbb")) return "/logos/birlikler/turkiye_belediyeler_birligi.jpg";
  if (n.includes("sağlıklı kentler")) return "/logos/birlikler/saglikli_kentler_birligi.jpg";
  if (n.includes("enerji kentleri")) return "/logos/birlikler/enerji_kentleri_birligi.jpg";
  if (n.includes("çevreci belediyeler")) return "/logos/birlikler/cevreci_belediyeler_birligi.png";
  if (n.includes("mayors for peace") || n.includes("barış")) return "/logos/birlikler/mayors_for_peace.png";
  if (n.includes("türk dünyası") || n.includes("tdbb")) return "/logos/birlikler/tdbb.jpg";
  if (n.includes("kültürlerarası") || n.includes("icc")) return "/logos/birlikler/icc_coe.png";
  if (n.includes("panorama") || n.includes("ipc")) return "/logos/birlikler/ipc_panorama.png";
  if (n.includes("tarihi kentler") || n.includes("eahtr")) return "/logos/birlikler/eahtr.png";
  if (n.includes("bebka")) return "/logos/birlikler/bebka.jpg";
  return null;
}

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
            <SisterCityCard key={city.id} city={city} />
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
          {unions.map((net) => {
            const logo = getUnionLogo(net.name);
            return (
              <div key={net.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#176C55]/40 hover:bg-white transition flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    {logo ? (
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                        <img src={logo} alt={net.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#176C55]/10 text-[#176C55] flex items-center justify-center font-bold shrink-0">
                        <Award className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{net.name}</div>
                      {net.joinedYear && (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                          Üyelik: {net.joinedYear}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-3">{net.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-[#839B24] font-semibold">Aktif Temsil</span>
                  <span className="text-slate-400">Ar-Ge Müdürlüğü</span>
                </div>
              </div>
            );
          })}
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
