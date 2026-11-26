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
  const budget = formData.get("budget") ? parseFloat(formData.get("budget") as string) : null;
  const expectedAttendees = formData.get("expectedAttendees") ? parseInt(formData.get("expectedAttendees") as string) : null;

  if (!title || !institution) {
    return { error: "Panel başlığı ve kurum zorunludur." };
  }

  const defaultChecklist = [
    { id: 1, title: "Konsept & Oda Mutabakatı", desc: "İlgili kurumla tema ve çerçeve mutabakatı.", status: "COMPLETED", date: "Ocak 2026" },
    { id: 2, title: "Moderatör & Panelist Davetleri", desc: "Konuşmacı onay süreci ve davetiyeler.", status: "IN_PROGRESS", date: "Şubat 2026" },
    { id: 3, title: "Mekân & Lojistik Tahsisi", desc: "Panorama 1326 veya Ördekli KM tahsisi.", status: "PENDING", date: "Tarih bekliyor" },
    { id: 4, title: "Tasarım, Afiş & Tanıtım", desc: "Kurumsal afiş ve basın bülteni hazırlığı.", status: "PENDING", date: "Tarih bekliyor" },
    { id: 5, title: "Panel Oturum İcrası", desc: "Canlı oturum yönetimi ve kayıt masası.", status: "PENDING", date: "Tarih bekliyor" },
    { id: 6, title: "Bildiri Kitabı & Veri Toplama", desc: "Sonuç raporu ve bildiri arşivi.", status: "PENDING", date: "Tarih bekliyor" },
  ];

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
        budget,
        expectedAttendees,
        currentStage: 2,
        planningStatus: "PLANNING",
        driveFolderUrl: "https://drive.google.com/drive/folders/1vvySBW1HF5jV8hRdgmmXwmbzqMzXaFGA",
        checklist: JSON.stringify(defaultChecklist),
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

export async function toggleChecklistItemAction(panelId: string, itemId: number, newStatus: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Yetkisiz işlem." };

  try {
    const panel = await prisma.conquestPanel.findUnique({ where: { id: panelId } });
    if (!panel) return { error: "Panel bulunamadı." };

    let checklist: any[] = [];
    if (panel.checklist) {
      try {
        checklist = JSON.parse(panel.checklist);
      } catch (e) {
        checklist = [];
      }
    }

    checklist = checklist.map((item) => {
      if (item.id === itemId) {
        return { ...item, status: newStatus };
      }
      return item;
    });

    const completedCount = checklist.filter((i) => i.status === "COMPLETED").length;
    const currentStage = Math.min(6, Math.max(1, completedCount + 1));
    const planningStatus = completedCount === 6 ? "COMPLETED" : completedCount >= 2 ? "ORGANIZING" : "PLANNING";

    await prisma.conquestPanel.update({
      where: { id: panelId },
      data: {
        checklist: JSON.stringify(checklist),
        currentStage,
        planningStatus,
      },
    });

    revalidatePath("/fethi-700-paneller");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function savePanelDossierAction(
  panelId: string,
  dossier: {
    photosUrl?: string;
    pressUrl?: string;
    presentationUrl?: string;
    declarationUrl?: string;
    dossierNotes?: string;
    actualAttendees?: number;
    dataCollection?: string;
  }
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Yetkisiz işlem." };

  try {
    await prisma.conquestPanel.update({
      where: { id: panelId },
      data: {
        photosUrl: dossier.photosUrl || null,
        pressUrl: dossier.pressUrl || null,
        presentationUrl: dossier.presentationUrl || null,
        declarationUrl: dossier.declarationUrl || null,
        dossierNotes: dossier.dossierNotes || null,
        actualAttendees: dossier.actualAttendees || undefined,
        dataCollection: dossier.dataCollection || undefined,
        currentStage: 6,
        planningStatus: "COMPLETED",
      },
    });

    revalidatePath("/fethi-700-paneller");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
