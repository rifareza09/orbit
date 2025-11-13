import React from "react";
import { router } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function ProgramKerja() {
  const data = [
    {
      id: 1,
      nama: "Open Recruitment Anggota Baru",
      tanggal: "10 - 15 Oktober 2025",
      jenis: "Akademik",
      divisi: "Band",
    },
    {
      id: 2,
      nama: "Latihan Rutin Mingguan (Sesi 1-4)",
      tanggal: "Setiap Jumat, Okt 2025",
      jenis: "Akademik",
      divisi: "Band",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#F5F6FA] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">
            Program Kerja Tahunan
          </h1>
          <button
            onClick={() => router.visit("/program-kerja/tambah")}
            className="bg-[#0B132B] text-white px-5 py-2 rounded-lg hover:bg-[#1C2541] transition"
          >
            Tambah Program Kerja
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#0B132B] text-white">
              <tr>
                <th className="px-4 py-3">No.</th>
                <th className="px-4 py-3">Program Kerja</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Jenis</th>
                <th className="px-4 py-3">Divisi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.tanggal}</td>
                  <td className="px-4 py-3">{item.jenis}</td>
                  <td className="px-4 py-3">{item.divisi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
