"use client";

import { useState } from "react";
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
  Landmark,
  Compass,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import { SessionUser } from "@/types";

interface SidebarProps {
  user: SessionUser;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  subItems?: { label: string; href: string }[];
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navGroups: { title: string; items: NavItem[] }[] = [
    {
      title: "Yönetim & Vizyon",
      items: [
        { label: "Genel Bakış", href: "/", icon: LayoutDashboard },
        { label: "700. Yıl Panelleri", href: "/fethi-700-paneller", icon: Landmark, badge: "Fetih 1326" },
      ],
    },
    {
      title: "Proje & Fon Radarı",
      items: [
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
        { label: "Hibe & Fon Radarı", href: "/fon-cagrilari", icon: Coins, badge: "Triage" },
        { label: "Başvuru Takibi", href: "/basvurular", icon: FileCheck2 },
        { label: "Rapor & Çıktı Merkezi", href: "/raporlar", icon: BarChart3, badge: "A4/Word" },
      ],
    },
    {
      title: "Kurumsal & Diplomasi",
      items: [
        { label: "Uluslararası İlişkiler", href: "/uluslararasi", icon: Globe2, badge: "31 Şehir" },
        { label: "Strateji & Kalite", href: "/strateji", icon: Compass, badge: "13 Klasör" },
        { label: "Belgeler", href: "/belgeler", icon: FileText },
      ],
    },
    {
      title: "Operasyon",
      items: [
        { label: "Görev ve İş Takibi", href: "/gorevler", icon: CheckSquare },
        { label: "Toplantı ve Faaliyetler", href: "/toplantilar", icon: Users2 },
        { label: "AI Proje Asistanı", href: "/ai-asistan", icon: Bot, badge: "Beta" },
        { label: "Yönetim ve Ayarlar", href: "/ayarlar", icon: Settings },
      ],
    },
  ];

  const renderSidebarInner = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Kurumsal Başlık & Logo */}
      <div className={`p-4 border-b border-slate-100 flex items-center ${collapsed && !isMobile ? "justify-center" : "justify-between"} gap-2.5 bg-gradient-to-b from-white to-slate-50/40`}>
        <Link href="/" className="flex items-center gap-3 min-w-0" onClick={() => setMobileOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src="/brand/osmangazi-logo.png"
              alt="Osmangazi Belediyesi Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold text-[#0B4F3A] tracking-tight leading-tight truncate">
                  OSMANGAZİ AR-GE
                </h1>
                <span className="w-2 h-2 rounded-full bg-[#D61F26] shrink-0" title="Bursa'nın Kalbi" />
              </div>
              <p className="text-[10px] font-bold text-[#7A9A3B] uppercase tracking-wider truncate">
                360 Dijital Portal
              </p>
            </div>
          )}
        </Link>

        {isMobile ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Menüyü Kapat"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
            aria-label={collapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
            className="hidden lg:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-[#0B4F3A] hover:bg-[#0B4F3A]/10 transition shrink-0"
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Gruplanmış Menü Linkleri */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {(!collapsed || isMobile) && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {group.title}
              </div>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    title={collapsed && !isMobile ? item.label : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center ${collapsed && !isMobile ? "justify-center px-2" : "justify-between px-3"} py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? "bg-[#0B4F3A] text-white shadow-sm shadow-[#0B4F3A]/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-[#0B4F3A]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                      {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                    </div>
                    {item.badge && (!collapsed || isMobile) && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>

                  {/* Alt Menüler */}
                  {item.subItems && isActive && (!collapsed || isMobile) && (
                    <div className="ml-6 mt-1 space-y-0.5 pl-2.5 border-l-2 border-[#7A9A3B]/40">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-2 py-1.5 text-[11px] font-medium text-slate-500 hover:text-[#0B4F3A] rounded-md transition"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Aktif Kullanıcı Kartı */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70">
        <div className={`p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center ${collapsed && !isMobile ? "justify-center" : "gap-3"}`}>
          <div className="w-8 h-8 rounded-full bg-[#0B4F3A] text-white font-bold text-xs flex items-center justify-center shrink-0">
            {user.name.charAt(0)}
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[11px] text-[#7A9A3B] font-semibold truncate">{user.title || user.roleLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobil Menü Tetikleyici (Header'da sağlanan yerleşime alternatif sabit buton) */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Menüyü Aç"
        className="lg:hidden fixed bottom-5 right-5 z-30 p-3.5 rounded-full bg-[#0B4F3A] text-white shadow-lg shadow-[#0B4F3A]/30 no-print"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobil Çekmece */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex no-print">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white border-r border-slate-200 h-full z-10 shadow-2xl">
            {renderSidebarInner(true)}
          </aside>
        </div>
      )}

      {/* Masaüstü Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-slate-200 shrink-0 min-h-screen transition-[width] duration-200 no-print ${
          collapsed ? "w-[74px]" : "w-64"
        }`}
      >
        {renderSidebarInner(false)}
      </aside>
    </>
  );
}
