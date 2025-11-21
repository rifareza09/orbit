import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { router } from "@inertiajs/react";

export default function LaporanKegiatan() {
  const dummyData = [
    {
      id: 1,
      nama: "Open Recruitment Divisi",
      ketua: "Rafli Dika",
      tempat: "Aula Kampus",
      tanggal: "12 Jan 2025",
      peserta: 45,
      status: "Belum Diajukan",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-10">

        {/* === HEADER + BUTTON === */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">
            Laporan Kegiatan
          </h1>

        </div>

        {/* === TABEL === */}
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#0B132B] text-white">
              <tr>
                <th className="px-4 py-3">No.</th>
                <th className="px-4 py-3">Nama Kegiatan</th>
                <th className="px-4 py-3">Ketua Pelaksana</th>
                <th className="px-4 py-3">Tempat Pelaksanaan</th>
                <th className="px-4 py-3">Tanggal Pelaksanaan</th>
                <th className="px-4 py-3">Jumlah Peserta</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center"></th>
              </tr>
            </thead>

            <tbody>
              {dummyData.map((row, index) => (
                <tr key={row.id} className="border-b">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{row.nama}</td>
                  <td className="px-4 py-3">{row.ketua}</td>
                  <td className="px-4 py-3">{row.tempat}</td>
                  <td className="px-4 py-3">{row.tanggal}</td>
                  <td className="px-4 py-3">{row.peserta}</td>

                  {/* STATUS BADGE */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        row.status === "Belum Diajukan"
                          ? "bg-yellow-100 text-yellow-700"
                          : row.status === "Sudah Diajukan"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* DETAIL BUTTON */}
                  <td className="px-4 py-3 text-center">
                    <span
                      onClick={() =>
                        router.visit(`/laporan-kegiatan/buatLaporanKegiatan`)
                      }
                      className="text-blue-600 cursor-pointer underline"
                    >
                      Detail
                    </span>
                  </td>
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
