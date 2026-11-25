"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const meetingSchema = z.object({
  title: z.string().min(3, "Toplantı başlığı en az 3 karakter olmalıdır."),
  type: z.enum(["ONLINE", "IN_PERSON", "HYBRID"]).default("ONLINE"),
  date: z.string().min(1, "Toplantı tarihi zorunludur."),
  projectId: z.string().optional(),
  agenda: z.string().optional(),
  decisions: z.string().optional(),
  minutes: z.string().optional(),
  participantIds: z.array(z.string()).optional(),
});

export async function createMeetingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Oturum açmanız gerekmektedir." };
  }

  const rawData = {
    title: formData.get("title") as string,
    type: (formData.get("type") as "ONLINE" | "IN_PERSON" | "HYBRID") || "ONLINE",
    date: formData.get("date") as string,
    projectId: (formData.get("projectId") as string) || undefined,
    agenda: (formData.get("agenda") as string) || undefined,
    decisions: (formData.get("decisions") as string) || undefined,
    minutes: (formData.get("minutes") as string) || undefined,
    participantIds: formData.getAll("participantIds") as string[],
  };

  const parsed = meetingSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const meeting = await prisma.meeting.create({
      data: {
        title: parsed.data.title,
        type: parsed.data.type,
        date: new Date(parsed.data.date),
        projectId: parsed.data.projectId || null,
        agenda: parsed.data.agenda,
        decisions: parsed.data.decisions,
        minutes: parsed.data.minutes,
        participants: {
          create: (parsed.data.participantIds && parsed.data.participantIds.length > 0)
            ? parsed.data.participantIds.map((userId) => ({ userId }))
            : [{ userId: user.id }],
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE",
        entity: "Meeting",
        entityId: meeting.id,
      },
    });

    revalidatePath("/toplantilar");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: "Toplantı kaydedilirken hata oluştu: " + err.message };
  }
}
