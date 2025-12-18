import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useForm, usePage, router } from "@inertiajs/react";
import { FileText, Image as ImageIcon } from "lucide-react";
import { formatCurrency } from "@/utils/currency";

interface LaporanEvaluasi {
  id: number;
  nama_kegiatan: string;
  ormawa: string;
  ketua_pelaksana: string;
  tempat_pelaksanaan: string;
  jumlah_peserta: number;
  tanggal_pelaksanaan: string;
  anggaran_disetujui: number;
  anggaran_realisasi: number;
  ringkasan: string;
  status: string;
  catatan_puskaka: string | null;
  reviewed_at: string | null;
  lpj_file: string | null;
  bukti_pengeluaran: string[] | null;
  dokumentasi: string[] | null;
  created_at: string;
}

export default function EvaluasiLaporanDetail() {
  const { laporan, flash } = usePage<{ laporan: LaporanEvaluasi; flash?: any }>().props;
  const [isLoading, setIsLoading] = useState(false);

  const { data, setData } = useForm({
    status: laporan.status,
    catatan_puskaka: laporan.catatan_puskaka || '',
  });

  const handleApprove = () => {
    setIsLoading(true);
    router.post(`/evaluasi-laporan/${laporan.id}/update-status`, {
      status: 'Disetujui',
      catatan_puskaka: data.catatan_puskaka,
    });
  };

  const handleReject = () => {
    setIsLoading(true);
    router.post(`/evaluasi-laporan/${laporan.id}/update-status`, {
      status: 'Ditolak',
      catatan_puskaka: data.catatan_puskaka,
    });
  };

  const handleReview = () => {
    setIsLoading(true);
    router.post(`/evaluasi-laporan/${laporan.id}/update-status`, {
      status: 'Direvisi',
      catatan_puskaka: data.catatan_puskaka,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-10 bg-[#F5F6FA] min-h-screen">
        {/* Header */}
        <h1 className="text-2xl font-bold text-[#0B132B] mb-6">Evaluasi Laporan Kegiatan</h1>

        {/* Success Message */}
        {flash?.success && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-6">
            {flash.success}
          </div>
        )}

        {/* KARTU DETAIL */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold">
            Detail Laporan ({laporan.ormawa})
          </div>

          <div className="p-8">
            {/* Grid 2 Kolom */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 mb-8">
              <div>
                <p className="text-sm font-semibold text-gray-700">Nama Kegiatan</p>
                <p className="mt-2 text-gray-900">{laporan.nama_kegiatan}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Ketua Pelaksana</p>
                <p className="mt-2 text-gray-900">{laporan.ketua_pelaksana}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Tempat Pelaksanaan</p>
                <p className="mt-2 text-gray-900">{laporan.tempat_pelaksanaan}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Tanggal Pelaksanaan</p>
                <p className="mt-2 text-gray-900">{laporan.tanggal_pelaksanaan}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Jumlah Peserta</p>
                <p className="mt-2 text-gray-900">{laporan.jumlah_peserta} orang</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Anggaran Disetujui</p>
                <p className="mt-2 text-gray-900">{formatCurrency(laporan.anggaran_disetujui)}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Dana Digunakan</p>
                <p className="mt-2 text-gray-900">{formatCurrency(laporan.anggaran_realisasi)}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Status</p>
                <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mt-2 ${
                  laporan.status === 'Disetujui' ? 'bg-green-200 text-green-800' :
                  laporan.status === 'Ditolak' ? 'bg-red-200 text-red-800' :
                  laporan.status === 'Direview' ? 'bg-yellow-200 text-yellow-800' :
                  laporan.status === 'Direvisi' ? 'bg-orange-200 text-orange-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {laporan.status}
                </span>
              </div>
            </div>

            {/* Ringkasan */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Ringkasan Kegiatan</p>
              <p className="text-gray-900 leading-relaxed whitespace-pre-line">
                {laporan.ringkasan || 'Tidak ada ringkasan'}
              </p>
            </div>

            {/* Laporan Pertanggung Jawaban */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Laporan Pertanggung Jawaban</p>
              {laporan.lpj_file ? (
                <a href={`/storage/${laporan.lpj_file}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-700">
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
                {laporan.bukti_pengeluaran && laporan.bukti_pengeluaran.length > 0 ? (
                  laporan.bukti_pengeluaran.map((file, idx) => (
                    <a key={idx} href={`/storage/${file}`} target="_blank" rel="noopener noreferrer" title={file} className="inline-flex items-center text-blue-600 hover:text-blue-700 p-2 border border-gray-300 rounded">
                      <FileText className="h-6 w-6" />
                    </a>
                  ))
                ) : (
                  <span className="text-gray-500">Tidak ada file</span>
                )}
              </div>
            </div>

            {/* Dokumentasi Kegiatan */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-700 mb-3">Dokumentasi Kegiatan</p>
              <div className="flex gap-3 flex-wrap">
                {laporan.dokumentasi && laporan.dokumentasi.length > 0 ? (
                  laporan.dokumentasi.map((file, idx) => (
                    <a key={idx} href={`/storage/${file}`} target="_blank" rel="noopener noreferrer" title={file} className="inline-flex items-center text-blue-600 hover:text-blue-700 p-2 border border-gray-300 rounded">
                      <ImageIcon className="h-6 w-6" />
                    </a>
                  ))
                ) : (
                  <span className="text-gray-500">Tidak ada dokumentasi</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CATATAN SEBELUMNYA */}
        {laporan.catatan_puskaka && (
          <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 overflow-hidden mb-6">
            <div className="bg-blue-100 text-blue-900 px-6 py-3 font-semibold border-b border-blue-200">
              Catatan Sebelumnya
            </div>
            <div className="p-6">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {laporan.catatan_puskaka}
              </p>
              {laporan.reviewed_at && (
                <p className="mt-3 text-xs text-gray-500">
                  Direview pada: {laporan.reviewed_at}
                </p>
              )}
            </div>
          </div>
        )}

        {/* FORM REVIEW */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold">
            Review & Evaluasi
            {laporan.status === 'Selesai' && (
              <p className="text-xs font-normal mt-1">Laporan yang sudah selesai tidak dapat diubah statusnya lagi.</p>
            )}
          </div>

          <div className="p-8">
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Catatan Puskaka
              </label>
              <textarea
                value={data.catatan_puskaka}
                onChange={(e) => setData('catatan_puskaka', e.target.value)}
                disabled={laporan.status === 'Selesai'}
                rows={5}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0B132B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                placeholder="Masukkan catatan, saran, atau alasan penolakan..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                disabled={isLoading}
                className="bg-gray-500 text-white px-8 py-2 rounded-lg shadow hover:bg-gray-600 transition font-semibold disabled:opacity-50"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={handleReview}
                disabled={isLoading || laporan.status === 'Selesai'}
                className="bg-yellow-500 text-white px-8 py-2 rounded-lg shadow hover:bg-yellow-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Perlu Revisi'}
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={isLoading || laporan.status === 'Selesai'}
                className="bg-red-500 text-white px-8 py-2 rounded-lg shadow hover:bg-red-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Tolak'}
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={isLoading || laporan.status === 'Selesai'}
                className="bg-green-500 text-white px-8 py-2 rounded-lg shadow hover:bg-green-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Setujui'}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-12">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
