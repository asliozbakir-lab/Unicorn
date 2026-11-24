"use client";

import { useState } from "react";
import { Archive } from "lucide-react";
import { archiveProjectAction } from "@/actions/project-actions";

export function ArchiveProjectButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);

  const handleArchive = async () => {
    if (!confirm("Bu projeyi arşivlemek istediğinize emin misiniz?")) return;
    setLoading(true);
    try {
      await archiveProjectAction(projectId);
    } catch {
      // redirect
    }
  };

  return (
    <button
      type="button"
      onClick={handleArchive}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
    >
      <Archive className="w-3.5 h-3.5" />
      <span>{loading ? "Arşivleniyor..." : "Projeyi Arşivle"}</span>
    </button>
  );
}
