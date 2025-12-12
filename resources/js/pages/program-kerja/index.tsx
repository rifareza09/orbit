import React from "react";
import { router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";

type Program = {
  id: number;
  program_kerja: string;
  kegiatan: string;
  deskripsi_kegiatan: string;
  jenis_kegiatan: string;
  estimasi_anggaran: string;
  status?: string;
};

export default function ProgramKerja() {

  const { programs = [] } = usePage().props as Partial<{ programs: Program[] }>;


  return (
    <DashboardLayout>
      <div className="p-8 bg-[#F5F6FA] min-h-screen">
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

        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full text-sm text-left border-collapse ">
            <thead className="bg-[#0B132B] text-white">
              <tr>
                <th className="px-4 py-3">No.</th>
                <th className="px-4 py-3">Program Kerja</th>
                <th className="px-4 py-3">Kegiatan</th>
                <th className="px-4 py-3">Deskripsi Kegiatan</th>
                <th className="px-4 py-3">Jenis Kegiatan</th>
                <th className="px-4 py-3">Estimasi Anggaran</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Status Detail</th>
              </tr>
            </thead>

            <tbody>
              {programs.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.program_kerja}</td>
                  <td className="px-4 py-3">{item.kegiatan}</td>
                  <td className="px-4 py-3">{item.deskripsi_kegiatan}</td>
                  <td className="px-4 py-3">{item.jenis_kegiatan}</td>
                  <td className="px-4 py-3">{item.estimasi_anggaran}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                      item.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                      item.status === 'Direview' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'Diajukan' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {item.status ?? 'Belum Diajukan'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      onClick={() => router.visit(`/program-kerja/detail/${item.id}`)}
                      className="text-blue-600 cursor-pointer underline"
                    >
                      detail
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
