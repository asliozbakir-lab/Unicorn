import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from "iron-session";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { SessionUser, UserRole } from "@/types";

export interface SessionData {
  user?: SessionUser;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.AUTH_SECRET || "osmangazi-arge-360-guclu-gizli-anahtar-en-az-32-karakter",
  cookieName: "osmangazi_arge360_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 saat
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session.user || null;
}

export async function authenticate(email: string, passwordPlain: string): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { role: true },
  });

  if (!user || !user.isActive || user.isArchived) {
    return { success: false, error: "Geçersiz e-posta veya şifre." };
  }

  const isPasswordValid = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isPasswordValid) {
    return { success: false, error: "Geçersiz e-posta veya şifre." };
  }

  const sessionUser: SessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    title: user.title,
    department: user.department,
    role: user.role.name as UserRole,
    roleLabel: user.role.label,
  };

  const session = await getSession();
  session.user = sessionUser;
  session.isLoggedIn = true;
  await session.save();

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "LOGIN",
      entity: "User",
      entityId: user.id,
    },
  });

  return { success: true, user: sessionUser };
}

export async function logout(): Promise<void> {
  const session = await getSession();
  if (session.user) {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "LOGOUT",
        entity: "User",
        entityId: session.user.id,
      },
    });
  }
  session.destroy();
}
