"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Coins,
  FileCheck2,
  Globe2,
  CheckSquare,
  Users2,
  FileText,
  BarChart3,
  Bot,
  Settings,
  Building2,
  Landmark,
} from "lucide-react";
import { SessionUser } from "@/types";

interface SidebarProps {
  user: SessionUser;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Genel Bakış", href: "/", icon: LayoutDashboard },
    {
      label: "700. Yıl Panelleri",
      href: "/fethi-700-paneller",
      icon: Landmark,
      badge: "Fetih 1326",
    },
    {
      label: "Proje Yönetimi",
      href: "/projeler",
      icon: FolderKanban,
      subItems: [
        { label: "Tüm Projeler", href: "/projeler" },
        { label: "Uluslararası Projeler", href: "/projeler?kategori=INTERNATIONAL" },
        { label: "Ulusal Projeler", href: "/projeler?kategori=NATIONAL" },
        { label: "Kurumsal Projeler", href: "/projeler?kategori=CORPORATE" },
        { label: "Kurum İçi Projeler", href: "/projeler?kategori=INTERNAL" },
      ],
    },
    { label: "Hibe ve Fon Çağrıları", href: "/fon-cagrilari", icon: Coins, badge: "NEB/Horizon" },
    { label: "Başvuru Takibi", href: "/basvurular", icon: FileCheck2 },
    {
      label: "Uluslararası İlişkiler",
      href: "/uluslararasi",
      icon: Globe2,
      badge: "Kardeş Şehirler",
    },
    { label: "Görev ve İş Takibi", href: "/gorevler", icon: CheckSquare },
    { label: "Toplantı ve Faaliyetler", href: "/toplantilar", icon: Users2 },
    { label: "Belgeler", href: "/belgeler", icon: FileText },
    { label: "Raporlama", href: "/raporlar", icon: BarChart3 },
    { label: "AI Proje Asistanı", href: "/ai-asistan", icon: Bot, badge: "Beta" },
    { label: "Yönetim ve Ayarlar", href: "/ayarlar", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
      {/* Kurumsal Başlık */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#176C55] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#176C55]/20">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
            OSMANGAZİ AR-GE
          </h1>
          <p className="text-[11px] font-semibold text-[#839B24] uppercase tracking-wider">
            360 Dijital Portal
          </p>
        </div>
      </div>

      {/* Menü Linkleri */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <div key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "bg-[#176C55] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>

              {/* Alt Menüler (Proje Yönetimi açıkken) */}
              {item.subItems && isActive && (
                <div className="ml-7 mt-1 space-y-0.5 pl-2 border-l border-slate-200">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className="block px-2 py-1.5 text-[11px] text-slate-500 hover:text-[#176C55] rounded-md transition"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Aktif Kullanıcı Kartı */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#176C55]/10 text-[#176C55] font-bold text-xs flex items-center justify-center shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
            <p className="text-[10px] text-[#839B24] font-medium truncate">{user.title || user.roleLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
