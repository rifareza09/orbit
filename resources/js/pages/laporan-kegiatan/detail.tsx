import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { router, usePage } from "@inertiajs/react";
import { formatCurrency } from "@/utils/currency";

interface LaporanKegiatanItem {
  id: number;
  pengajuan_kegiatan_id: number;
  namaKegiatan: string;
  ketuaPelaksana: string;
  tempatPelaksanaan: string;
  tanggalPelaksanaan: string;
  jumlahPeserta: number;
  anggaranDisetujui: number;
  anggaranRealisasi: number;
  ringkasan: string;
  status: string;
  catatan_puskaka: string | null;
  reviewed_at: string | null;
  lpjFile: string | null;
  buktiPengeluaran: string[];
  dokumentasi: string[];
  createdAt: string;
  updatedAt: string;
}

export default function DetailLaporanKegiatan() {
  const { item } = usePage<{ item: LaporanKegiatanItem }>().props;
  const handleAjukan = () => {
    router.post(`/laporan-kegiatan/ajukan/${item.id}`, {}, {
      onSuccess: () => {
        router.visit('/laporan-kegiatan');
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#F5F6FA] min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0B132B]">Laporan Kegiatan</h1>
        </div>

        {/* KARTU DETAIL */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold">
            Detail Laporan Kegiatan
          </div>

          <div className="p-6 grid grid-cols-2 gap-x-10 gap-y-6">
            {/* Nama Kegiatan */}
            <div>
              <p className="font-bold text-sm text-gray-800">Nama Kegiatan</p>
              <p className="mt-1 text-gray-800">{item.namaKegiatan}</p>
            </div>

            {/* Ketua Pelaksana */}
            <div>
              <p className="font-bold text-sm text-gray-800">Ketua Pelaksana</p>
              <p className="mt-1 text-gray-800">{item.ketuaPelaksana}</p>
            </div>

            {/* Tempat Pelaksanaan */}
            <div>
              <p className="font-bold text-sm text-gray-800">Tempat Pelaksanaan</p>
              <p className="mt-1 text-gray-800">{item.tempatPelaksanaan}</p>
            </div>

            {/* Tanggal Pelaksanaan */}
            <div>
              <p className="font-bold text-sm text-gray-800">Tanggal Pelaksanaan</p>
              <p className="mt-1 text-gray-800">
                {item.tanggalPelaksanaan ?
                  new Date(item.tanggalPelaksanaan).toLocaleDateString('id-ID') : '-'}
              </p>
            </div>

            {/* Jumlah Peserta */}
            <div>
              <p className="font-bold text-sm text-gray-800">Jumlah Peserta</p>
              <p className="mt-1 text-gray-800">{item.jumlahPeserta} peserta</p>
            </div>

            {/* Anggaran Disetujui */}
            <div>
              <p className="font-bold text-sm text-gray-800">Anggaran Disetujui</p>
              <p className="mt-1 text-gray-800">{formatCurrency(item.anggaranDisetujui)}</p>
            </div>

            {/* Anggaran Realisasi */}
            <div>
              <p className="font-bold text-sm text-gray-800">Dana Digunakan</p>
              <p className="mt-1 text-gray-800">{formatCurrency(item.anggaranRealisasi)}</p>
            </div>

            {/* Status */}
            <div>
              <p className="font-bold text-sm text-gray-800">Status Laporan</p>
              <span className={`mt-1 inline-block text-xs font-medium px-3 py-1 rounded-full ${
                item.status === 'Belum Diajukan' ? 'bg-gray-200 text-gray-800' :
                item.status === 'Diajukan' ? 'bg-blue-200 text-blue-800' :
                item.status === 'Disetujui' ? 'bg-green-200 text-green-800' :
                'bg-red-200 text-red-800'
              }`}>
                {item.status}
              </span>
            </div>

            {/* Ringkasan */}
            <div className="col-span-2">
              <p className="font-bold text-sm text-gray-800">Ringkasan Kegiatan</p>
              <p className="mt-1 leading-relaxed text-gray-800">{item.ringkasan || 'Tidak ada ringkasan'}</p>
            </div>

            {/* LPJ File */}
            {item.lpjFile && (
              <div>
                <p className="font-bold text-sm text-gray-800">Laporan Pertanggung Jawaban (LPJ)</p>
                <a
                  href={`/laporan-kegiatan/download/${item.id}/lpj`}
                  className="mt-1 inline-block text-blue-600 hover:text-blue-800 underline"
                >
                  📄 Download LPJ
                </a>
              </div>
            )}

            {/* Bukti Pengeluaran */}
            {item.buktiPengeluaran && item.buktiPengeluaran.length > 0 && (
              <div>
                <p className="font-bold text-sm text-gray-800 mb-2">Bukti Pengeluaran</p>
                <div className="space-y-1">
                  {item.buktiPengeluaran.map((_, index) => (
                    <a
                      key={`bukti-${index}`}
                      href={`/laporan-kegiatan/download/${item.id}/bukti?index=${index}`}
                      className="block text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      📄 Bukti Pengeluaran {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Dokumentasi */}
            {item.dokumentasi && item.dokumentasi.length > 0 && (
              <div className="col-span-2">
                <p className="font-bold text-sm text-gray-800 mb-2">Dokumentasi Kegiatan</p>
                <div className="space-y-1">
                  {item.dokumentasi.map((_, index) => (
                    <a
                      key={`dok-${index}`}
                      href={`/laporan-kegiatan/download/${item.id}/dokumentasi?index=${index}`}
                      className="block text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      📄 Dokumentasi {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Tanggal Dibuat & Diupdate */}
            <div>
              <p className="font-bold text-sm text-gray-800">Dibuat</p>
              <p className="mt-1 text-gray-800 text-sm">{item.createdAt}</p>
            </div>

            <div>
              <p className="font-bold text-sm text-gray-800">Terakhir Diupdate</p>
              <p className="mt-1 text-gray-800 text-sm">{item.updatedAt}</p>
            </div>
          </div>
        </div>

        {/* CATATAN PUSKAKA */}
        {item.catatan_puskaka && (
          <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 overflow-hidden mt-6">
            <div className="bg-blue-100 text-blue-900 px-6 py-3 font-semibold border-b border-blue-200">
              Catatan dari Puskaka
            </div>
            <div className="p-6">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {item.catatan_puskaka}
              </p>
              {item.reviewed_at && (
                <p className="mt-3 text-xs text-gray-500">
                  Direview pada: {item.reviewed_at}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.visit('/laporan-kegiatan')}
            className="bg-gray-500 text-white px-8 py-2 rounded-lg shadow hover:bg-gray-600 transition"
          >
            Kembali
          </button>

          {item.status === 'Belum Diajukan' && (
            <button
              onClick={handleAjukan}
              className="bg-[#0B132B] text-white px-8 py-2 rounded-lg shadow hover:bg-[#1C2541] transition"
            >
              Ajukan
            </button>
          )}
        </div>

        <div className="text-center text-gray-500 text-sm mt-8">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
