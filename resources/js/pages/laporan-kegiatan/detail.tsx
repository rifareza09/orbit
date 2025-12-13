import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { router, usePage } from "@inertiajs/react";
import { formatCurrency } from "@/utils/currency";
import { FileText, Image as ImageIcon } from "lucide-react";

interface LaporanKegiatanItem {
  id: number;
  pengajuan_kegiatan_id: number;
  namaKegiatan: string;
  ketuaPelaksana: string;
  tempatPelaksanaan: string;
  tanggalPelaksanaan: string;
  jumlahPeserta: number;
  estimasiAnggaran: number;
  anggaranRealisasi: number;
  ringkasan: string;
  catatan: string | null;
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
      <div className="p-10 bg-[#F5F6FA] min-h-screen">
        {/* Header */}
        <h1 className="text-2xl font-bold text-[#0B132B] mb-6">Laporan Kegiatan</h1>

        {/* KARTU DETAIL */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold">
            Detail Laporan
          </div>

          <div className="p-8">
            {/* Grid 2 Kolom */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 mb-8">
              {/* Kolom Kiri */}
              <div>
                <p className="text-sm font-semibold text-gray-700">Program Kerja</p>
                <p className="mt-2 text-gray-900">{item.namaKegiatan}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Kegiatan</p>
                <p className="mt-2 text-gray-900">{item.namaKegiatan}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Deskripsi Kegiatan</p>
                <p className="mt-2 text-gray-900">{item.ringkasan || 'Tidak ada deskripsi'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Jenis Kegiatan</p>
                <p className="mt-2 text-gray-900">Kegiatan Reguler Tahunan</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Estimasi Anggaran</p>
                <p className="mt-2 text-gray-900">{formatCurrency(item.estimasiAnggaran)}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Ketua Pelaksana</p>
                <p className="mt-2 text-gray-900">{item.ketuaPelaksana}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Tempat Pelaksanaan</p>
                <p className="mt-2 text-gray-900">{item.tempatPelaksanaan}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Tanggal Pelaksanaan</p>
                <p className="mt-2 text-gray-900">
                  {item.tanggalPelaksanaan ?
                    new Date(item.tanggalPelaksanaan).toLocaleDateString('id-ID') : '-'}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Jumlah Peserta</p>
                <p className="mt-2 text-gray-900">{item.jumlahPeserta} orang</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Dana Digunakan</p>
                <p className="mt-2 text-gray-900">{formatCurrency(item.anggaranRealisasi)}</p>
              </div>
            </div>

            {/* Ringkasan Kegiatan */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Ringkasan Kegiatan</p>
              <p className="text-gray-900 leading-relaxed whitespace-pre-line">
                {item.ringkasan || 'Tidak ada ringkasan'}
              </p>
            </div>

            {/* Catatan Tambahan */}
            {item.catatan && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Catatan Tambahan</p>
                <p className="text-gray-900 leading-relaxed whitespace-pre-line">
                  {item.catatan}
                </p>
              </div>
            )}

            {/* Laporan Pertanggung Jawaban */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Laporan Pertanggung Jawaban</p>
              {item.lpjFile ? (
                <a
                  href={`/storage/${item.lpjFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  <FileText className="h-6 w-6" />
                </a>
              ) : (
                <span className="text-gray-500">Tidak ada file</span>
              )}
            </div>

            {/* Bukti Pengeluaran */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Bukti Pengeluaran</p>
              <div className="flex gap-4">
                {item.buktiPengeluaran && item.buktiPengeluaran.length > 0 ? (
                  item.buktiPengeluaran.map((file, idx) => (
                    <a
                      key={idx}
                      href={`/storage/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={file}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 p-2 border border-gray-300 rounded"
                    >
                      <FileText className="h-6 w-6" />
                    </a>
                  ))
                ) : (
                  <span className="text-gray-500">Tidak ada file</span>
                )}
              </div>
            </div>

            {/* Dokumentasi Kegiatan */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Dokumentasi Kegiatan</p>
              <div className="flex gap-3 flex-wrap">
                {item.dokumentasi && item.dokumentasi.length > 0 ? (
                  item.dokumentasi.map((file, idx) => (
                    <a
                      key={idx}
                      href={`/storage/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={file}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 p-2 border border-gray-300 rounded"
                    >
                      <ImageIcon className="h-6 w-6" />
                    </a>
                  ))
                ) : (
                  <span className="text-gray-500">Tidak ada dokumentasi</span>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-700 mb-2">Status</p>
              <span className={`inline-block text-sm font-medium px-4 py-2 rounded-full ${
                item.status === 'Belum Diajukan' ? 'bg-gray-200 text-gray-800' :
                item.status === 'Diajukan' ? 'bg-blue-200 text-blue-800' :
                item.status === 'Disetujui' ? 'bg-green-200 text-green-800' :
                'bg-red-200 text-red-800'
              }`}>
                {item.status}
              </span>
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
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-8 py-2 rounded-lg shadow hover:bg-gray-600 transition font-semibold"
          >
            Kembali
          </button>

          {item.status === 'Belum Diajukan' && (
            <>
              <button
                onClick={() => router.visit(`/laporan-kegiatan/edit/${item.id}`)}
                className="bg-blue-500 text-white px-8 py-2 rounded-lg shadow hover:bg-blue-600 transition font-semibold"
              >
                Edit
              </button>
              <button
                onClick={handleAjukan}
                className="bg-[#0B132B] text-white px-8 py-2 rounded-lg shadow hover:bg-[#1C2541] transition font-semibold"
              >
                Ajukan
              </button>
            </>
          )}
        </div>

        <div className="text-center text-gray-500 text-sm mt-12">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
