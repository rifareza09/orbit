import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
     
      {/* === KONTEN UTAMA === */}
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-[#0B132B]">
            <p className="text-gray-500">Total Kegiatan</p>
            <h2 className="text-2xl font-semibold text-[#0B132B] mt-2">12</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-[#007BFF]">
            <p className="text-gray-500">Sedang Direview</p>
            <h2 className="text-2xl font-semibold text-[#0B132B] mt-2">3</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-[#FFC107]">
            <p className="text-gray-500">Disetujui</p>
            <h2 className="text-2xl font-semibold text-[#0B132B] mt-2">6</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-[#28A745]">
            <p className="text-gray-500">Selesai</p>
            <h2 className="text-2xl font-semibold text-[#0B132B] mt-2">3</h2>
          </div>
        </div>

        {/* Ringkasan Aktivitas */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-[#0B132B] mb-4">
            Statistik Kegiatan
          </h2>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-600">
              Belum ada aktivitas terbaru nyong. Silakan tambahkan kegiatan baru di menu sebelah kiri.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
