"use client";

import { useState } from "react";
import { Clock, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
import { updateTaskStatusAction } from "@/actions/task-actions";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    priority: string;
    status: string;
    dueDate: string | Date | null;
    project: { code: string; name: string } | null;
    assignedUser: { name: string; title: string | null } | null;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  const [loading, setLoading] = useState(false);

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "DONE";

  const priorityConfig: Record<string, { label: string; badge: string }> = {
    URGENT: { label: "Acil", badge: "bg-red-50 text-red-700 border-red-200" },
    HIGH: { label: "Yüksek", badge: "bg-amber-50 text-amber-700 border-amber-200" },
    MEDIUM: { label: "Orta", badge: "bg-blue-50 text-blue-700 border-blue-200" },
    LOW: { label: "Düşük", badge: "bg-slate-50 text-slate-600 border-slate-200" },
  };

  const pConf = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    await updateTaskStatusAction(task.id, newStatus);
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-3">
      {/* Üst Kısım: Öncelik ve Proje Kodu */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${pConf.badge}`}>
          {pConf.label}
        </span>
        {task.project && (
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            {task.project.code}
          </span>
        )}
      </div>

      {/* Başlık ve Açıklama */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
            {task.description}
          </p>
        )}
      </div>

      {/* Tarih ve Sorumlu */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
        {task.dueDate ? (
          <div
            className={`flex items-center gap-1 font-medium ${
              isOverdue ? "text-red-600 font-bold" : "text-slate-500"
            }`}
          >
            {isOverdue ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            <span>{formatShortDate(task.dueDate)}</span>
            {isOverdue && <span className="text-[10px] bg-red-100 px-1 rounded">Gecikti</span>}
          </div>
        ) : (
          <span className="text-slate-400 text-[10px]">Terminsiz</span>
        )}

        <div className="text-slate-700 font-semibold truncate max-w-[100px]">
          {task.assignedUser?.name || "Atanmadı"}
        </div>
      </div>

      {/* Durum Değiştirme Aksiyonu */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <select
          value={task.status}
          disabled={loading}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-[#176C55]"
        >
          <option value="TODO">Yapılacak</option>
          <option value="IN_PROGRESS">Devam Ediyor</option>
          <option value="REVIEW">İncelemede</option>
          <option value="DONE">Tamamlandı</option>
        </select>

        {task.status !== "DONE" && (
          <button
            type="button"
            title="Tamamlandı olarak işaretle"
            disabled={loading}
            onClick={() => handleStatusChange("DONE")}
            className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
