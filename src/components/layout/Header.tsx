"use client";

import Link from "next/link";
import { Search, LogOut, ShieldCheck, Printer, Sparkles } from "lucide-react";
import { logoutAction } from "@/actions/auth-actions";
import { SessionUser } from "@/types";
import { CommandPalette } from "./CommandPalette";

interface HeaderProps {
  user: SessionUser;
}

export function Header({ user }: HeaderProps) {
  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <>
      <CommandPalette />
      <header className="h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 no-print">
        {/* Etkileşimli Hızlı Arama & Komut Paleti Tetikleyicisi */}
        <button
          type="button"
          onClick={triggerSearch}
          className="flex items-center justify-between gap-3 w-full max-w-md px-3.5 py-2 bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#0B4F3A]/40 rounded-xl text-xs text-slate-500 transition shadow-2xs group"
        >
          <span className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-[#0B4F3A] shrink-0 transition" />
            <span className="truncate">Proje, fon çağrısı, kardeş şehir veya belge ara...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[10px] font-semibold text-slate-400 shrink-0">
            Ctrl K
          </kbd>
        </button>

        {/* Sağ Aksiyonlar */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            href="/raporlar"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B4F3A]/10 hover:bg-[#0B4F3A] text-[#0B4F3A] hover:text-white text-xs font-bold border border-[#0B4F3A]/20 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Proje Çıktısı Al</span>
          </Link>

          <Link
            href="/ai-asistan"
            title="AI Proje Asistanı"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7A9A3B]" />
            <span>AI Asistan</span>
          </Link>

          {/* Kurumsal Rozet */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#0B4F3A] text-xs font-bold border border-[#0B4F3A]/15">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F3A]" />
            <span>Osmangazi Belediyesi</span>
          </div>

          {/* Kullanıcı ve Çıkış */}
          <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900">{user.name}</div>
              <div className="text-[10px] text-slate-500 font-medium">{user.roleLabel}</div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                title="Güvenli Çıkış"
                aria-label="Güvenli Çıkış"
                className="p-2 text-slate-400 hover:text-[#D61F26] hover:bg-rose-50 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </header>
    </>
  );
}
