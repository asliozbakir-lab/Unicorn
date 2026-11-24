import { SessionUser, UserRole } from "@/types";

export function canCreateProject(user: SessionUser | null): boolean {
  if (!user) return false;
  return ["SYSTEM_ADMIN", "MANAGER", "STAFF"].includes(user.role);
}

export function canEditProject(user: SessionUser | null): boolean {
  if (!user) return false;
  return ["SYSTEM_ADMIN", "MANAGER", "STAFF"].includes(user.role);
}

export function canArchiveProject(user: SessionUser | null): boolean {
  if (!user) return false;
  return ["SYSTEM_ADMIN", "MANAGER"].includes(user.role);
}

export function canManageUsers(user: SessionUser | null): boolean {
  if (!user) return false;
  return user.role === "SYSTEM_ADMIN";
}

export function canViewAuditLogs(user: SessionUser | null): boolean {
  if (!user) return false;
  return ["SYSTEM_ADMIN", "MANAGER"].includes(user.role);
}

export function isReadOnly(user: SessionUser | null): boolean {
  if (!user) return true;
  return user.role === "READONLY";
}
