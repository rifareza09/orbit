import React from "react";
import { router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { formatCurrency } from "@/utils/currency";

interface PengajuanKegiatan {
  id: number;
  nama_kegiatan: string;
  ketua_pelaksana: string;
  tempat_pelaksanaan: string;
  tanggal_pelaksanaan: string;
  total_anggaran: number;
  status: string;
}

export default function PengajuanKegiatan() {
  const { pengajuan } = usePage<{
    pengajuan: PengajuanKegiatan[];
  }>().props;

  return (
    <DashboardLayout>
      {/* === KONTEN UTAMA === */}
      <div className="p-8">
        {/* HEADER + TOMBOL */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">Pengajuan Kegiatan</h1>
          <button
            onClick={() => router.visit('/pengajuan-kegiatan/buatProposal')}
            className="bg-[#0B132B] text-white px-6 py-2 rounded-md hover:bg-[#1C2541] transition"
          >
            Buat Proposal Kegiatan
          </button>
        </div>

        {/* === TABEL === */}
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#0B132B] text-white">
              <tr>
                <th className="px-4 py-3 w-[5%]">No.</th>
                <th className="px-4 py-3 w-[25%]">Nama Kegiatan</th>
                <th className="px-4 py-3 w-[20%]">Ketua Pelaksana</th>
                <th className="px-4 py-3 w-[15%]">Tempat Pelaksanaan</th>
                <th className="px-4 py-3 w-[12%]">Tanggal Pelaksanaan</th>
                <th className="px-4 py-3 w-[13%]">Anggaran Dana</th>
                <th className="px-4 py-3 w-[10%]">Status</th>
                <th className="px-4 py-3 w-[10%] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pengajuan.length > 0 ? (
                pengajuan.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{index + 1}.</td>
                    <td className="px-4 py-3">{item.nama_kegiatan}</td>
                    <td className="px-4 py-3">{item.ketua_pelaksana}</td>
                    <td className="px-4 py-3">{item.tempat_pelaksanaan}</td>
                    <td className="px-4 py-3">{new Date(item.tanggal_pelaksanaan).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3">{formatCurrency(item.total_anggaran)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'Belum Diajukan' ? 'bg-gray-200 text-gray-800' :
                        item.status === 'Diajukan' ? 'bg-blue-200 text-blue-800' :
                        item.status === 'Disetujui' ? 'bg-green-200 text-green-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => router.visit(`/pengajuan-kegiatan/detail/${item.id}`)}
                        className="text-blue-600 cursor-pointer underline hover:text-blue-800"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Belum ada pengajuan kegiatan.
                    <button
                      onClick={() => router.visit('/pengajuan-kegiatan/buatProposal')}
                      className="text-blue-600 underline ml-1"
                    >
                      Buat proposal baru
                    </button>
                  </td>
                </tr>
              )}
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
