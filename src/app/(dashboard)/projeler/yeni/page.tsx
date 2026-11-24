import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canCreateProject } from "@/lib/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewProjectForm } from "@/components/projects/NewProjectForm";

export default async function NewProjectPage() {
  const user = await getCurrentUser();
  if (!canCreateProject(user)) {
    redirect("/projeler");
  }

  const [users, fundingPrograms] = await Promise.all([
    prisma.user.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.fundingProgram.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Geri Dönüş ve Başlık */}
      <div>
        <Link
          href="/projeler"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#176C55] transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Proje Listesine Dön</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Yeni Proje Kaydı</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Osmangazi Belediyesi Ar-Ge Müdürlüğü portföyüne yeni bir proje veya hibe çalışması ekleyin.
        </p>
      </div>

      {/* Form Kartı */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <NewProjectForm
          users={users.map((u) => ({ id: u.id, name: u.name, title: u.title }))}
          fundingPrograms={fundingPrograms.map((fp) => ({ id: fp.id, name: fp.name }))}
          defaultUserId={user?.id}
        />
      </div>
    </div>
  );
}
