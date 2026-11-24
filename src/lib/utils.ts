export function formatCurrency(amount: number | null | undefined, currency: string = "EUR"): string {
  if (amount === null || amount === undefined) return "—";
  const symbol = currency === "EUR" ? "€" : currency === "TRY" ? "₺" : "$";
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + " " + symbol;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatShortDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export const CATEGORY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  INTERNATIONAL: {
    label: "Uluslararası",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  NATIONAL: {
    label: "Ulusal",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  CORPORATE: {
    label: "Kurumsal",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
  INTERNAL: {
    label: "Kurum İçi",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
};

export const PHASE_LABELS: Record<string, { label: string; badge: string }> = {
  IDEA: { label: "Fikir / Taslak", badge: "bg-slate-100 text-slate-700 border-slate-300" },
  PREPARATION: { label: "Hazırlık", badge: "bg-blue-100 text-blue-700 border-blue-300" },
  SUBMITTED: { label: "Başvuruldu", badge: "bg-indigo-100 text-indigo-700 border-indigo-300" },
  APPROVED: { label: "Kabul Edildi", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  ACTIVE: { label: "Devam Ediyor", badge: "bg-teal-100 text-teal-800 border-teal-300" },
  COMPLETED: { label: "Tamamlandı", badge: "bg-green-100 text-green-800 border-green-300" },
  ARCHIVED: { label: "Arşivlendi", badge: "bg-zinc-100 text-zinc-700 border-zinc-300" },
};

export const ROLE_LABELS: Record<string, string> = {
  SYSTEM_ADMIN: "Sistem Yöneticisi",
  MANAGER: "AR-GE Müdürü",
  STAFF: "Uzman / Personel",
  READONLY: "Salt Okunur / Denetçi",
};
