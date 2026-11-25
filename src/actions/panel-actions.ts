"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPanelAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  const title = formData.get("title") as string;
  const institution = formData.get("institution") as string;
  const contactPerson = (formData.get("contactPerson") as string) || null;
  const moderator = (formData.get("moderator") as string) || null;
  const panelists = (formData.get("panelists") as string) || null;
  const date = (formData.get("date") as string) || null;
  const location = (formData.get("location") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  if (!title || !institution) {
    return { error: "Panel başlığı ve kurum zorunludur." };
  }

  try {
    await prisma.conquestPanel.create({
      data: {
        title,
        institution,
        contactPerson,
        moderator,
        panelists,
        date,
        location,
        notes,
        planningStatus: "PLANNING",
      },
    });

    revalidatePath("/fethi-700-paneller");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updatePanelStatusAction(panelId: string, planningStatus: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Yetkisiz işlem." };

  try {
    await prisma.conquestPanel.update({
      where: { id: panelId },
      data: { planningStatus },
    });

    revalidatePath("/fethi-700-paneller");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function savePanelDataCollectionAction(panelId: string, dataCollection: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Yetkisiz işlem." };

  try {
    await prisma.conquestPanel.update({
      where: { id: panelId },
      data: {
        dataCollection,
        planningStatus: "COMPLETED",
      },
    });

    revalidatePath("/fethi-700-paneller");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
