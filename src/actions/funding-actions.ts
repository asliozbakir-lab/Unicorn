"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type TriageStatus = "NEW" | "SHORTLISTED" | "DEFERRED" | "DISMISSED" | "APPLIED";
export type QualityGate = "G0" | "G1" | "G2" | "G3" | "G4" | "G5";

export async function triageFundingCallAction(input: {
  callId: string;
  status: TriageStatus;
  reason?: string | null;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Oturumunuz sona ermiş. Lütfen tekrar giriş yapın." };
  }

  const existing = await prisma.fundingCall.findUnique({
    where: { id: input.callId },
  });

  if (!existing) {
    return { error: "İlgili fon çağrısı bulunamadı." };
  }

  const updated = await prisma.fundingCall.update({
    where: { id: input.callId },
    data: {
      triageStatus: input.status,
      triageReason: input.status === "NEW" ? null : (input.reason ?? existing.triageReason),
      triageBy: user.name,
      triageAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "UPDATE",
      entity: "FundingCall",
      entityId: input.callId,
      oldValue: JSON.stringify({ triageStatus: existing.triageStatus, triageReason: existing.triageReason }),
      newValue: JSON.stringify({ triageStatus: updated.triageStatus, triageReason: updated.triageReason }),
    },
  });

  revalidatePath("/fon-cagrilari");
  revalidatePath("/");

  return { success: true, call: updated };
}

export async function updateCallGateAction(input: {
  callId: string;
  qualityGate: QualityGate;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Yetkisiz işlem." };
  }

  const updated = await prisma.fundingCall.update({
    where: { id: input.callId },
    data: {
      qualityGate: input.qualityGate,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "UPDATE",
      entity: "FundingCall",
      entityId: input.callId,
      newValue: JSON.stringify({ qualityGate: input.qualityGate }),
    },
  });

  revalidatePath("/fon-cagrilari");
  return { success: true, call: updated };
}

export async function convertCallToProjectAction(callId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Bu işlem için oturum açmalısınız." };
  }

  const call = await prisma.fundingCall.findUnique({
    where: { id: callId },
    include: { fundingProgram: true },
  });

  if (!call) {
    return { error: "Fon çağrısı bulunamadı." };
  }

  const prefix = call.callCode
    ? call.callCode.replace(/[^A-Za-z0-9]/g, "").slice(0, 8).toUpperCase()
    : "CAGRI";
  const uniqueCode = `OGZ-${prefix}-${Date.now().toString().slice(-4)}`;

  const newProject = await prisma.project.create({
    data: {
      code: uniqueCode,
      name: call.title,
      category: call.track === "HAT_C" ? "NATIONAL" : "INTERNATIONAL",
      phase: "PREPARATION",
      description: call.notes?.slice(0, 600) || `${call.fundingProgram.name} çağrısı kapsamında başlatılan Ar-Ge projesi.`,
      objectives: call.eligibility ? `Hedef Rol: ${call.eligibility} • Bütçe: ${call.budgetInfo || "Belirtilmedi"}` : undefined,
      fundingProgramId: call.fundingProgramId,
      responsibleUserId: user.id,
      municipalUnit: "Araştırma ve Geliştirme Müdürlüğü",
      startDate: new Date(),
      endDate: call.deadline || undefined,
    },
  });

  await prisma.application.create({
    data: {
      projectId: newProject.id,
      fundingCallId: call.id,
      type: "PROJECT_CALL",
      applicantRole: "PARTNER",
      status: "PREPARING",
      notes: `Hibe Radarından dönüştürüldü (${user.name}).`,
    },
  });

  await prisma.fundingCall.update({
    where: { id: call.id },
    data: {
      triageStatus: "APPLIED",
      triageBy: user.name,
      triageAt: new Date(),
      qualityGate: "G4",
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "CREATE",
      entity: "Project",
      entityId: newProject.id,
      newValue: JSON.stringify({ fromCallId: call.id, code: uniqueCode }),
    },
  });

  revalidatePath("/fon-cagrilari");
  revalidatePath("/projeler");
  revalidatePath("/basvurular");
  revalidatePath("/");

  return { success: true, projectId: newProject.id, projectCode: newProject.code };
}
