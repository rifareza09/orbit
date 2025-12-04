import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { usePage } from "@inertiajs/react";

type DashboardProps = {
  stats?: {
    total: number;
    review: number;
    approved: number;
    done: number;
  };
};

export default function DashboardPage() {
  const { stats } = usePage<DashboardProps>().props;
  const kpis = {
    total: stats?.total ?? 12,
    review: stats?.review ?? 3,
    approved: stats?.approved ?? 6,
    done: stats?.done ?? 3,
  };
  return (
    <DashboardLayout>
      {/* Header banner */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">Halo, UKM Smarakaryadhwani!</h1>
        </div>

        {/* Status timeline */}
        <div className="bg-[#0B132B] text-white rounded-2xl p-6">
          <div className="font-medium">Status Kegiatan</div>
          <div className="text-xs text-white/80 mb-4">Latihan dan Kepemimpinan</div>
          <div className="flex items-center justify-between">
            {[
              { label: "Diajukan", active: true },
              { label: "Direview", active: true },
              { label: "Disetujui", active: false },
              { label: "Dilaksanakan", active: false },
              { label: "Selesai", active: false },
            ].map((step, idx, arr) => (
              <div key={step.label} className="flex items-center w-full">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.active ? "border-yellow-400" : "border-white/40"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${step.active ? "bg-yellow-400" : "bg-white/30"}`} />
                </div>
                <div className="ml-2 text-xs">{step.label}</div>
                {idx < arr.length - 1 && (
                  <div className="flex-1 h-px bg-white/30 mx-3" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[
            { title: "Total Kegiatan", value: kpis.total, color: "#0B132B" },
            { title: "Sedang Direview", value: kpis.review, color: "#1C2541" },
            { title: "Disetujui", value: kpis.approved, color: "#5BC0BE" },
            { title: "Selesai", value: kpis.done, color: "#3A506B" },
          ].map((k) => (
            <div key={k.title} className="bg-white rounded-2xl shadow p-6 border border-gray-200">
              <p className="text-gray-500">{k.title}</p>
              <h2 className="text-2xl font-semibold text-[#0B132B] mt-2">{k.value}</h2>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-[#0B132B] font-medium mb-2">Statistik Kegiatan</h3>
            <div className="aspect-video rounded-xl bg-gray-50 border grid place-items-center text-gray-400">
              {/* Placeholder pie chart */}
              <span>Grafik Pie (Belum Diajukan, Perlu Direview, Disetujui, Selesai)</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-[#0B132B] font-medium mb-2">Aktivitas Terakhir</h3>
            <div className="aspect-video rounded-xl bg-gray-50 border grid place-items-center text-gray-400">
              <span>Ruang untuk widget lain / tabel ringkas</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
