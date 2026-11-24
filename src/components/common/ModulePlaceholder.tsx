import Link from "next/link";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  sprint: string;
}

export function ModulePlaceholder({ title, description, sprint }: ModulePlaceholderProps) {
  return (
    <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-[#176C55]/10 text-[#176C55] flex items-center justify-center mx-auto">
        <Sparkles className="w-7 h-7 text-[#839B24]" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto">{description}</p>

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
        <Clock className="w-3.5 h-3.5" />
        <span>Planlanan Teslim: {sprint}</span>
      </div>

      <div className="pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard'a Geri Dön</span>
        </Link>
      </div>
    </div>
  );
}
