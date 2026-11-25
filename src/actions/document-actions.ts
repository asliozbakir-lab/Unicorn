"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createDocumentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  const name = formData.get("name") as string;
  const type = (formData.get("type") as string) || "GOOGLE_DOC";
  const category = (formData.get("category") as string) || "GOOGLE_DRIVE";
  const driveUrl = formData.get("driveUrl") as string;
  const description = (formData.get("description") as string) || null;
  const version = (formData.get("version") as string) || "v1.0";
  const projectId = (formData.get("projectId") as string) || null;

  if (!name || !driveUrl) {
    return { error: "Belge adı ve Google Drive bağlantı URL'si zorunludur." };
  }

  try {
    await prisma.document.create({
      data: {
        name,
        type,
        category,
        filePath: driveUrl,
        driveUrl,
        description,
        version,
        uploadedBy: user.name,
        projectId: projectId ? projectId : null,
      },
    });

    revalidatePath("/belgeler");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteDocumentAction(id: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  try {
    await prisma.document.delete({
      where: { id },
    });

    revalidatePath("/belgeler");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
