"use client";

import { Search, Bell, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { logoutAction } from "@/actions/auth-actions";
import { SessionUser } from "@/types";

interface HeaderProps {
  user: SessionUser;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Arama Alanı */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Proje, çağrı, ortak veya ülke ara..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#176C55] focus:bg-white transition"
          />
        </div>
      </div>

      {/* Sağ Aksiyonlar */}
      <div className="flex items-center gap-4">
        {/* Kurumsal Rozet */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#176C55]/10 text-[#176C55] text-xs font-semibold border border-[#176C55]/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Osmangazi Belediyesi</span>
        </div>

        {/* Bildirim İkonu */}
        <button
          type="button"
          title="Bildirimler"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#839B24] ring-2 ring-white" />
        </button>

        {/* Kullanıcı ve Çıkış */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-900">{user.name}</div>
            <div className="text-[10px] text-slate-500 font-medium">{user.roleLabel}</div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              title="Güvenli Çıkış"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
