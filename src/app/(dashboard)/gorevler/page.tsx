import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CheckSquare, ListTodo, PlayCircle, Eye, CheckCircle2 } from "lucide-react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { NewTaskModal } from "@/components/tasks/NewTaskModal";

export default async function TasksPage() {
  const user = await getCurrentUser();

  const [tasks, projects, users] = await Promise.all([
    prisma.task.findMany({
      include: {
        project: true,
        assignedUser: true,
      },
      orderBy: { createdAt: "desc" },
    }),
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

  // Eğer henüz hiç görev yoksa ilk başlangıç görevlerini oluşturalım
  if (tasks.length === 0 && projects.length > 0 && users.length > 0) {
    const foodTrails = projects.find((p) => p.code.includes("FOODTRAILS")) || projects[0];
    const romangal = projects.find((p) => p.code.includes("ROMANGAL")) || projects[0];
    const cbs360 = projects.find((p) => p.code.includes("CBS360")) || projects[0];

    await prisma.task.createMany({
      data: [
        {
          title: "Food Trails Konsorsiyum Raporu Teslimi",
          description: "İtalya ve İngiltere ortaklarıyla yapılan çalışma grubu çıktılarının raporlanması.",
          priority: "URGENT",
          status: "IN_PROGRESS",
          projectId: foodTrails.id,
          assignedUserId: users.find((u) => u.name.includes("Aslı"))?.id || users[0].id,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
        {
          title: "Romangal Fabrikası Sözlü Tarih Kayıtları Kurgusu",
          description: "Eski ipek fabrikası işçileriyle yapılan röportajların podcast formatına getirilmesi.",
          priority: "HIGH",
          status: "TODO",
          projectId: romangal.id,
          assignedUserId: users.find((u) => u.name.includes("Ece"))?.id || users[0].id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          title: "CBS 360 Lidar Ölçümleme Veri Doğrulaması",
          description: "1700 km yol ağındaki 2 cm hata payı toleranslarının yazılımda test edilmesi.",
          priority: "MEDIUM",
          status: "REVIEW",
          projectId: cbs360.id,
          assignedUserId: users.find((u) => u.name.includes("Serkan"))?.id || users[0].id,
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
        {
          title: "Basketbol Sahaları Zemin Grafik Çizimleri",
          description: "Park Bahçeler Müdürlüğü için renk ve zemin şablonlarının vektörel teslimi.",
          priority: "MEDIUM",
          status: "DONE",
          projectId: romangal.id,
          assignedUserId: users.find((u) => u.name.includes("Aslı"))?.id || users[0].id,
          completedAt: new Date(),
        },
      ],
    });
  }

  // Yeniden güncel görevleri alalım
  const allTasks = await prisma.task.findMany({
    include: {
      project: true,
      assignedUser: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const columns = [
    {
      id: "TODO",
      title: "Yapılacaklar",
      icon: ListTodo,
      color: "text-slate-700 bg-slate-100",
      tasks: allTasks.filter((t) => t.status === "TODO"),
    },
    {
      id: "IN_PROGRESS",
      title: "Devam Edenler",
      icon: PlayCircle,
      color: "text-blue-700 bg-blue-100",
      tasks: allTasks.filter((t) => t.status === "IN_PROGRESS"),
    },
    {
      id: "REVIEW",
      title: "İnceleme / Kontrol",
      icon: Eye,
      color: "text-amber-700 bg-amber-100",
      tasks: allTasks.filter((t) => t.status === "REVIEW"),
    },
    {
      id: "DONE",
      title: "Tamamlananlar",
      icon: CheckCircle2,
      color: "text-emerald-700 bg-emerald-100",
      tasks: allTasks.filter((t) => t.status === "DONE"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Yeni Görev Modalı */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Görev ve İş Takibi</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ar-Ge Müdürlüğü personel iş paketleri, terminler ve durum takip panosu
          </p>
        </div>

        <NewTaskModal projects={projects} users={users} defaultUserId={user?.id} />
      </div>

      {/* KANBAN PANOSU (4 SÜTUN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const Icon = col.icon;
          return (
            <div
              key={col.id}
              className="bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col min-h-[500px]"
            >
              {/* Sütun Başlığı */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${col.color}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold text-slate-800">{col.title}</span>
                </div>
                <span className="text-xs font-bold text-slate-500 px-2 py-0.5 bg-white rounded-full border border-slate-200">
                  {col.tasks.length}
                </span>
              </div>

              {/* Kartlar */}
              <div className="space-y-3 flex-1">
                {col.tasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                    Görev bulunmuyor
                  </div>
                ) : (
                  col.tasks.map((task) => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
