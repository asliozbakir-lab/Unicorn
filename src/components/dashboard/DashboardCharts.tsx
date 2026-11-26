"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface ChartsProps {
  categoryData: { name: string; count: number; color: string }[];
  phaseData: { name: string; count: number }[];
}

export function DashboardCharts({ categoryData, phaseData }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Kategori Dağılımı */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm osmangazi-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Proje Kategorileri Dağılımı</h3>
            <p className="text-xs text-slate-500">4 ana stratejik alandaki proje portföyü</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0B4F3A]/10 text-[#0B4F3A]">
            Canlı Veritabanı
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="count"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value} Proje`, "Toplam"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Proje Aşamaları Çubuk Grafiği */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm osmangazi-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Uygulama Aşamaları</h3>
            <p className="text-xs text-slate-500">Hazırlık, başvuru, aktif ve tamamlanan projeler</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#7A9A3B]/15 text-[#7A9A3B]">
            Durum Analizi
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={phaseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                formatter={(value: any) => [`${value} Proje`, "Sayı"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="count" fill="#0B4F3A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
