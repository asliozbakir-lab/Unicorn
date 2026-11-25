import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Users2, Video, MapPin, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { NewMeetingModal } from "@/components/meetings/NewMeetingModal";

interface MeetingsPageProps {
  searchParams: Promise<{
    tur?: string;
  }>;
}

export default async function MeetingsPage({ searchParams }: MeetingsPageProps) {
  const user = await getCurrentUser();
  const { tur } = await searchParams;

  const [existingCount, projects, users] = await Promise.all([
    prisma.meeting.count(),
    prisma.project.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, title: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Eğer veritabanında henüz toplantı yoksa sunumdaki gerçek toplantılardan tohumlayalım
  if (existingCount === 0 && projects.length > 0) {
    const foodTrails = projects.find((p) => p.code.includes("FOODTRAILS")) || projects[0];
    const civitas = projects.find((p) => p.code.includes("CIVITAS")) || projects[0];
    const bebka = projects.find((p) => p.code.includes("SEHRINGOZLERI")) || projects[0];

    await prisma.meeting.createMany({
      data: [
        {
          title: "Food Trails Konsorsiyum Aylık Eşgüdüm Toplantısı",
          type: "ONLINE",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          projectId: foodTrails.id,
          agenda: "Milano, Birmingham ve Varşova ortaklarıyla gıda konseyleri deneyim paylaşımı.",
          decisions: "Osmangazi gıda politikası taslak yol haritası bir sonraki oturuma sunulacak.",
        },
        {
          title: "CIVITAS Mobility Hub Floransa Teknik Çalıştayı",
          type: "IN_PERSON",
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          projectId: civitas.id,
          agenda: "Floransa Belediyesi ile kentsel hareketlilik ve aktarma merkezleri saha incelemesi.",
          decisions: "Osmangazi aktarma merkezi simülasyon modeli için veri setleri paylaşıldı.",
        },
        {
          title: "BEBKA Şehrin Gözleri Projesi İzleme ve Değerlendirme Oturumu",
          type: "ONLINE",
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          projectId: bebka.id,
          agenda: "1. Dönem ara raporu ve finansal gerçekleşmelerin değerlendirilmesi.",
          decisions: "BEBKA uzmanları tarafından ara hakediş onaylandı.",
        },
      ],
    });
  }

  const whereClause: any = {};
  if (tur && ["ONLINE", "IN_PERSON", "HYBRID"].includes(tur)) {
    whereClause.type = tur;
  }

  const meetings = await prisma.meeting.findMany({
    where: whereClause,
    include: {
      project: true,
      participants: { include: { user: true } },
    },
    orderBy: { date: "desc" },
  });

  const onlineCount = await prisma.meeting.count({ where: { type: "ONLINE" } });
  const inPersonCount = await prisma.meeting.count({ where: { type: "IN_PERSON" } });

  const typeTabs = [
    { key: "", label: "Tüm Toplantılar" },
    { key: "ONLINE", label: "Çevrim İçi (Online)" },
    { key: "IN_PERSON", label: "Yüz Yüze" },
  ];

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Yeni Toplantı Ekle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Toplantı ve Faaliyetler</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Uluslararası konsorsiyum oturumları, çalıştaylar, tutanaklar ve alınan kararlar
          </p>
        </div>

        <NewMeetingModal projects={projects} users={users} defaultUserId={user?.id} />
      </div>

      {/* METRİK ŞERİDİ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#176C55]/10 text-[#176C55] flex items-center justify-center font-bold">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Kayıtlı Toplantı</div>
            <div className="text-lg font-bold text-slate-900">{meetings.length} Toplantı</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Çevrim İçi (Sunum: 425)</div>
            <div className="text-lg font-bold text-blue-700">{onlineCount} Aktif Oturum</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Yüz Yüze (Sunum: 38)</div>
            <div className="text-lg font-bold text-amber-700">{inPersonCount} Saha Çalıştayı</div>
          </div>
        </div>
      </div>

      {/* LİSTE */}
      <div className="space-y-4">
        {meetings.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
            <Users2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800">Toplantı Bulunamadı</h3>
            <p className="text-xs text-slate-500 mt-1">Bu filtreye uygun kayıtlı toplantı yok.</p>
          </div>
        ) : (
          meetings.map((m) => {
            const isOnline = m.type === "ONLINE";
            return (
              <div
                key={m.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                        isOnline
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {isOnline ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      <span>{isOnline ? "Çevrim İçi (Online)" : "Yüz Yüze"}</span>
                    </span>

                    {m.project && (
                      <span className="text-[10px] font-mono font-bold text-[#176C55] bg-[#176C55]/10 px-2 py-0.5 rounded">
                        {m.project.code}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(m.date)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                  {m.project && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      İlgili Proje: <span className="font-semibold text-slate-700">{m.project.name}</span>
                    </p>
                  )}
                </div>

                {m.agenda && (
                  <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600">
                    <span className="font-bold text-slate-700 block mb-0.5">Gündem:</span>
                    {m.agenda}
                  </div>
                )}

                {m.decisions && (
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900">
                    <span className="font-bold text-emerald-800 flex items-center gap-1 mb-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Alınan Kararlar:
                    </span>
                    {m.decisions}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
