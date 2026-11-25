"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createSisterCityAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  const cityName = formData.get("cityName") as string;
  const countryName = formData.get("countryName") as string;
  const countryCode = (formData.get("countryCode") as string) || null;
  const flagEmoji = (formData.get("flagEmoji") as string) || "🌐";
  const protocolDate = (formData.get("protocolDate") as string) || null;
  const scope = (formData.get("scope") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const logoUrl = (formData.get("logoUrl") as string) || null;

  if (!cityName || !countryName) {
    return { error: "Şehir adı ve ülke adı zorunludur." };
  }

  try {
    await prisma.sisterCity.create({
      data: {
        cityName,
        countryName,
        countryCode,
        flagEmoji,
        protocolDate,
        scope,
        notes,
        logoUrl,
        status: "ACTIVE",
      },
    });

    revalidatePath("/uluslararasi");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function createUnionAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const joinedYear = formData.get("joinedYear") ? parseInt(formData.get("joinedYear") as string) : null;

  if (!name) {
    return { error: "Birlik / Ağ adı zorunludur." };
  }

  try {
    await prisma.networkMembership.create({
      data: {
        name,
        description,
        joinedYear,
        status: "ACTIVE",
      },
    });

    revalidatePath("/uluslararasi");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
