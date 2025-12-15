import React from "react";
import { router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { formatCurrency } from "@/utils/currency";

interface PengajuanKegiatan {
  id: number;
  nama_kegiatan: string;
  ketua_pelaksana: string;
  tempat_pelaksanaan: string;
  jumlah_peserta: number;
  tanggal_pelaksanaan: string;
  dana_digunakan: number;
  status: string;
  hasLaporan: boolean;
  laporanStatus?: string;
  laporanId?: number;
}

export default function LaporanKegiatan() {
  const { pengajuan } = usePage<{
    pengajuan: PengajuanKegiatan[];
  }>().props;

  // Debug data
  console.log('Pengajuan data:', pengajuan);

  return (
    <DashboardLayout>
      {/* === KONTEN UTAMA === */}
      <div className="p-8">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">Laporan Kegiatan</h1>
        </div>

        {/* === TABEL === */}
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#0B132B] text-white">
              <tr>
                <th className="px-4 py-3 w-[4%]">No.</th>
                <th className="px-4 py-3 w-[18%]">Program Kerja</th>
                <th className="px-4 py-3 w-[15%]">Kegiatan</th>
                <th className="px-4 py-3 w-[12%]">Tanggal Pelaksanaan</th>
                <th className="px-4 py-3 w-[10%]">Jumlah Peserta</th>
                <th className="px-4 py-3 w-[13%]">Dana Digunakan</th>
                <th className="px-4 py-3 w-[10%]">Status</th>
                <th className="px-4 py-3 w-[8%] text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {pengajuan.length > 0 ? (
                pengajuan.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.nama_kegiatan}</td>
                    <td className="px-4 py-3">{item.ketua_pelaksana}</td>
                    <td className="px-4 py-3">
                      {new Date(item.tanggal_pelaksanaan).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-center">{item.jumlah_peserta} Peserta</td>
                    <td className="px-4 py-3">{formatCurrency(item.dana_digunakan)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        !item.hasLaporan ? 'bg-gray-200 text-gray-800' :
                        item.laporanStatus === 'Belum Diajukan' ? 'bg-gray-200 text-gray-800' :
                        item.laporanStatus === 'Diajukan' ? 'bg-blue-200 text-blue-800' :
                        item.laporanStatus === 'Disetujui' ? 'bg-green-200 text-green-800' :
                        item.laporanStatus === 'Selesai' ? 'bg-purple-200 text-purple-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {!item.hasLaporan ? 'Belum Diajukan' : item.laporanStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!item.hasLaporan ? (
                        <button
                          onClick={() => {
                            console.log('Klik Buat - Item:', item);
                            router.visit(`/laporan-kegiatan/buatlaporanKegiatan/${item.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Buat
                        </button>
                      ) : item.laporanStatus === 'Direvisi' ? (
                        <button
                          onClick={() => {
                            console.log('Klik Revisi - Item:', item);
                            router.visit(`/laporan-kegiatan/edit/${item.laporanId}`);
                          }}
                          className="text-orange-600 hover:text-orange-800 underline font-semibold"
                        >
                          Revisi
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            console.log('Klik Detail - Item:', item);
                            router.visit(`/laporan-kegiatan/detail/${item.laporanId}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Belum ada kegiatan yang dapat dibuat laporannya.
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
