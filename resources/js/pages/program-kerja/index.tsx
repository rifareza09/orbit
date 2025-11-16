import React from "react";
import { router } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function ProgramKerja() {
  const data = [
    {
      id: 1,
      programKerja: "Pengembangan Minat dan Bakat",
      kegiatan: "Open Recruitment Anggota Baru",
        deskripsiKegiatan:
            "Kegiatan perekrutan anggota baru untuk memperkuat tim UKM Musik.",
        jenisKegiatan: "Non-Akademik",
        estimasiKegiatan: "Rp. 3.000.000",
        status: "Diajukan",
        detail: "detail"
    },
    {

    }
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
                <th className="px-4 py-3 hidden-coll">Status Detail</th>


              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.programKerja}</td>
                  <td className="px-4 py-3">{item.kegiatan}</td>
                  <td className="px-4 py-3">{item.deskripsiKegiatan}</td>
                  <td className="px-4 py-3">{item.jenisKegiatan}</td>
                  <td className="px-4 py-3">{item.estimasiKegiatan}</td>
                <td className="px-4 py-3">{item.status}</td>
                    <td className="px-4 py-3"><span onClick={() => router.visit('/program-kerja/detail')} className="text-blue-600  cursor-pointer underline">{item.detail}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {}
        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
