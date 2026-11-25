"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(3, "Görev başlığı en az 3 karakter olmalıdır."),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "CANCELLED"]).default("TODO"),
  dueDate: z.string().optional(),
  projectId: z.string().optional(),
  assignedUserId: z.string().optional(),
});

export async function createTaskAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Oturum açmanız gerekmektedir." };
  }

  const rawData = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    priority: (formData.get("priority") as "LOW" | "MEDIUM" | "HIGH" | "URGENT") || "MEDIUM",
    status: (formData.get("status") as any) || "TODO",
    dueDate: (formData.get("dueDate") as string) || undefined,
    projectId: (formData.get("projectId") as string) || undefined,
    assignedUserId: (formData.get("assignedUserId") as string) || undefined,
  };

  const parsed = taskSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        priority: parsed.data.priority,
        status: parsed.data.status,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
        projectId: parsed.data.projectId || null,
        assignedUserId: parsed.data.assignedUserId || user.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE",
        entity: "Task",
        entityId: task.id,
      },
    });

    revalidatePath("/gorevler");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: "Görev kaydedilirken hata: " + err.message };
  }
}

export async function updateTaskStatusAction(taskId: string, newStatus: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Yetkisiz erişim" };

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        completedAt: newStatus === "DONE" ? new Date() : null,
      },
    });

    revalidatePath("/gorevler");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
