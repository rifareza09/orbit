import React from "react";
import { router } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function PengajuanKegiatan() {
  const data = [
    {
      id: 1,
      nama: "Open Recruitment Anggota Baru",
      program: "Pengembangan Minat Bakat",
      jenis: "Non-Akademik",
      tanggal: "2 November 2025",
      penanggung: "Rifa Reza Pahlevi",
      anggaran: "Rp. 3.000.000",
    },
  ];

  return (
    <DashboardLayout>
      {/* === KONTEN UTAMA === */}
      <div className="p-8">
        {/* HEADER + TOMBOL */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">Kegiatan</h1>
        </div>

        {/* === TABEL === */}
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#0B132B] text-white">
              <tr>
                <th className="px-4 py-3 w-[5%]">No.</th>
                <th className="px-4 py-3 w-[25%]">Nama Kegiatan</th>
                <th className="px-4 py-3 w-[25%]">Program</th>
                <th className="px-4 py-3 w-[10%]">Jenis</th>
                <th className="px-4 py-3 w-[15%]">Tanggal Pelaksanaan</th>
                <th className="px-4 py-3 w-[15%]">Penanggung Jawab</th>
                <th className="px-4 py-3 w-[10%]">Anggaran Dana</th>
                <th className="px-4 py-3 w-[10%]">Buat Proposal Kegiatan</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{index + 1}.</td>
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.program}</td>
                  <td className="px-4 py-3">{item.jenis}</td>
                  <td className="px-4 py-3">{item.tanggal}</td>
                  <td className="px-4 py-3">{item.penanggung}</td>
                  <td className="px-4 py-3">{item.anggaran}</td>
                  <td className="px-4 py-3"><span onClick={() => router.visit('/pengajuan-kegiatan/detail')} className="text-blue-600  cursor-pointer underline">Buat</span></td>
                </tr>
              ))}

              {/* Baris kosong untuk sisa tabel */}
              {Array.from({ length: 10 - data.length }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-3">{i + data.length + 1}.</td>
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
