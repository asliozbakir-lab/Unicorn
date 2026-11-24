import { prisma } from "@/lib/prisma";
import { Coins, Layers, ArrowUpRight, Calendar } from "lucide-react";

export default async function FundingCallsPage() {
  const programs = await prisma.fundingProgram.findMany({
    include: {
      calls: true,
      subPrograms: true,
      projects: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hibe ve Fon Çağrıları</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Ufuk Avrupa (Horizon Europe), New European Bauhaus, Erasmus+ ve TÜBİTAK aktif fon programları ve çağrıları
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-[#176C55] bg-[#176C55]/10 px-2 py-0.5 rounded">
                  {prog.code || "PROGRAM"}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {prog.projects.length} Bağlı Proje
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900">{prog.name}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Sağlayıcı: <span className="font-semibold text-slate-700">{prog.provider || "Avrupa Birliği"}</span>
              </p>

              {prog.subPrograms.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Alt Kümeler:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {prog.subPrograms.map((sub) => (
                      <span key={sub.id} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {prog.calls.length} Aktif Çağrı
              </span>
              <span className="text-xs font-semibold text-[#176C55] flex items-center gap-1">
                <span>İncele</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
