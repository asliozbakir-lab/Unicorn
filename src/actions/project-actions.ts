"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canCreateProject, canEditProject, canArchiveProject } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(3, "Proje adı en az 3 karakter olmalıdır."),
  code: z.string().min(3, "Proje kodu en az 3 karakter olmalıdır."),
  category: z.enum(["INTERNATIONAL", "NATIONAL", "CORPORATE", "INTERNAL"]),
  description: z.string().optional(),
  objectives: z.string().optional(),
  budgetAmount: z.coerce.number().min(0).optional(),
  currency: z.enum(["EUR", "TRY", "USD"]).default("EUR"),
  phase: z.enum(["IDEA", "PREPARATION", "SUBMITTED", "APPROVED", "ACTIVE", "COMPLETED", "ARCHIVED"]).default("PREPARATION"),
  coordinatorOrg: z.string().optional(),
  municipalUnit: z.string().optional(),
  responsibleUserId: z.string().optional(),
  fundingProgramId: z.string().optional(),
});

export async function createProjectAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!canCreateProject(user)) {
    return { error: "Proje oluşturma yetkiniz bulunmamaktadır." };
  }

  const rawData = {
    name: formData.get("name"),
    code: (formData.get("code") as string)?.toUpperCase().trim(),
    category: formData.get("category"),
    description: formData.get("description") || undefined,
    objectives: formData.get("objectives") || undefined,
    budgetAmount: formData.get("budgetAmount") || undefined,
    currency: formData.get("currency") || "EUR",
    phase: formData.get("phase") || "PREPARATION",
    coordinatorOrg: formData.get("coordinatorOrg") || undefined,
    municipalUnit: formData.get("municipalUnit") || undefined,
    responsibleUserId: formData.get("responsibleUserId") || undefined,
    fundingProgramId: formData.get("fundingProgramId") || undefined,
  };

  const parsed = projectSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const existing = await prisma.project.findUnique({
      where: { code: parsed.data.code },
    });
    if (existing) {
      return { error: "Bu proje kodu zaten kullanılıyor." };
    }

    const newProject = await prisma.project.create({
      data: {
        name: parsed.data.name,
        code: parsed.data.code,
        category: parsed.data.category,
        description: parsed.data.description,
        objectives: parsed.data.objectives,
        budgetAmount: parsed.data.budgetAmount,
        currency: parsed.data.currency,
        phase: parsed.data.phase,
        coordinatorOrg: parsed.data.coordinatorOrg,
        municipalUnit: parsed.data.municipalUnit,
        responsibleUserId: parsed.data.responsibleUserId || user!.id,
        fundingProgramId: parsed.data.fundingProgramId || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user!.id,
        action: "CREATE",
        entity: "Project",
        entityId: newProject.id,
        newValue: JSON.stringify(newProject),
      },
    });

    revalidatePath("/projeler");
    revalidatePath("/");
  } catch (err: any) {
    return { error: "Proje kaydedilirken hata oluştu: " + err.message };
  }

  redirect("/projeler");
}

export async function archiveProjectAction(id: string) {
  const user = await getCurrentUser();
  if (!canArchiveProject(user)) {
    return { error: "Proje arşivleme yetkiniz bulunmamaktadır." };
  }

  await prisma.project.update({
    where: { id },
    data: {
      isArchived: true,
      phase: "ARCHIVED",
      deletedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user!.id,
      action: "ARCHIVE",
      entity: "Project",
      entityId: id,
    },
  });

  revalidatePath("/projeler");
  revalidatePath("/");
  redirect("/projeler");
}
