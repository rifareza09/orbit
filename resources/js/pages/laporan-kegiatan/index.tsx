import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function LaporanKegiatan() {
  return (
    <DashboardLayout>
      {/* === KONTEN UTAMA === */}
      <div className="p-8">
        {/* HEADER + TOMBOL */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">
            Laporan Kegiatan
          </h1>
        </div>

        {/* === TABEL === */}
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#0B132B] text-white">
              <tr>
                <th className="px-4 py-3 w-[5%]"></th>
                <th className="px-4 py-3 w-[25%]"></th>
                <th className="px-4 py-3 w-[25%]"></th>
                <th className="px-4 py-3 w-[10%]"></th>
                <th className="px-4 py-3 w-[15%]"></th>
                <th className="px-4 py-3 w-[15%]"></th>
                <th className="px-4 py-3 w-[10%]"></th>
              </tr>
            </thead>
            <tbody>
              {/* Baris kosong tapi tetap ada nomor urut */}
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-3">{i + 1}.</td>
                  <td className="px-4 py-3">&nbsp;</td>
                  <td className="px-4 py-3">&nbsp;</td>
                  <td className="px-4 py-3">&nbsp;</td>
                  <td className="px-4 py-3">&nbsp;</td>
                  <td className="px-4 py-3">&nbsp;</td>
                  <td className="px-4 py-3">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
