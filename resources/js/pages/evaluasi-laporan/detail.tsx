import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Download, FileText, Image } from "lucide-react";

interface Laporan {
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

interface Props {
  laporan: Laporan;
}

export default function EvaluasiLaporanDetail({ laporan }: Props) {
  const { flash } = usePage().props as any;

  const { data, setData, post, processing, errors } = useForm({
    status: laporan.status,
    catatan: laporan.catatan_puskaka || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/evaluasi-laporan/${laporan.id}/update-status`, {
      preserveScroll: true,
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-[#0B132B]">Detail Laporan Kegiatan</h1>
            <p className="text-sm text-gray-600 mt-1">
              Dilaporkan oleh <span className="font-semibold">{laporan.ormawa}</span> pada {laporan.created_at}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Success Message */}
          {flash?.success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{flash.success}</span>
            </div>
          )}

          {/* Detail Kegiatan Section */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-blue-100 px-6 py-3 border-b border-blue-200">
              <h2 className="font-bold text-[#0B132B] text-sm">Informasi Kegiatan</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Nama Kegiatan
                  </label>
                  <input
                    type="text"
                    value={laporan.nama_kegiatan}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Ketua Pelaksana
                  </label>
                  <input
                    type="text"
                    value={laporan.ketua_pelaksana}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Tempat Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={laporan.tempat_pelaksanaan}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={laporan.tanggal_pelaksanaan}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Jumlah Peserta
                  </label>
                  <input
                    type="text"
                    value={laporan.jumlah_peserta}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Status
                  </label>
                  <span className={`inline-block px-3 py-2 rounded-full text-xs font-semibold ${
                    laporan.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                    laporan.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                    laporan.status === 'Direview' ? 'bg-blue-100 text-blue-700' :
                    laporan.status === 'Direvisi' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {laporan.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Ringkasan Kegiatan
                  </label>
                  <textarea
                    value={laporan.ringkasan}
                    readOnly
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Anggaran Section */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-yellow-100 px-6 py-3 border-b border-yellow-200">
              <h2 className="font-bold text-[#0B132B] text-sm">Realisasi Anggaran</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Anggaran Disetujui
                  </label>
                  <div className="text-2xl font-bold text-[#0B132B]">
                    Rp {laporan.anggaran_disetujui.toLocaleString('id-ID')}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Anggaran Realisasi
                  </label>
                  <div className="text-2xl font-bold text-blue-600">
                    Rp {laporan.anggaran_realisasi.toLocaleString('id-ID')}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Selisih
                  </label>
                  <div className={`text-2xl font-bold ${
                    laporan.anggaran_disetujui - laporan.anggaran_realisasi >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    Rp {Math.abs(laporan.anggaran_disetujui - laporan.anggaran_realisasi).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* LPJ File */}
            {laporan.lpj_file && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-3 border-b bg-white">
                  <h2 className="font-bold text-[#0B132B] text-sm">File LPJ</h2>
                </div>
                <div className="p-6">
                  <a
                    href={`/storage/${laporan.lpj_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <FileText size={16} />
                    Download LPJ
                  </a>
                </div>
              </div>
            )}

            {/* Bukti Pengeluaran */}
            {laporan.bukti_pengeluaran && laporan.bukti_pengeluaran.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-3 border-b bg-white">
                  <h2 className="font-bold text-[#0B132B] text-sm">Bukti Pengeluaran</h2>
                </div>
                <div className="p-6 space-y-2">
                  {laporan.bukti_pengeluaran.map((file, index) => (
                    <a
                      key={index}
                      href={`/storage/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Download size={14} />
                      Bukti {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Dokumentasi */}
            {laporan.dokumentasi && laporan.dokumentasi.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-3 border-b bg-white">
                  <h2 className="font-bold text-[#0B132B] text-sm">Dokumentasi</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-2">
                    {laporan.dokumentasi.slice(0, 4).map((foto, index) => (
                      <a
                        key={index}
                        href={`/storage/${foto}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-75 transition"
                      >
                        <img
                          src={`/storage/${foto}`}
                          alt={`Dokumentasi ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Update Status */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-green-100 px-6 py-3 border-b border-green-200">
                <h2 className="font-bold text-[#0B132B] text-sm">Evaluasi Laporan</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Status Laporan
                  </label>
                  <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                  >
                    <option value="Belum Diajukan">Belum Diajukan</option>
                    <option value="Diajukan">Diajukan</option>
                    <option value="Direview">Direview</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Direvisi">Direvisi</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-600 text-xs mt-1">{errors.status}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    value={data.catatan}
                    onChange={(e) => setData('catatan', e.target.value)}
                    rows={5}
                    placeholder="Tulis catatan atau masukan untuk ormawa..."
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                  />
                  {errors.catatan && (
                    <p className="text-red-600 text-xs mt-1">{errors.catatan}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pb-8">
              <Link
                href="/evaluasi-laporan"
                className="px-6 py-2.5 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 font-semibold transition-colors text-sm"
              >
                Kembali
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2.5 bg-[#0B132B] hover:bg-[#1C2541] text-white rounded font-semibold transition-colors text-sm disabled:opacity-50"
              >
                {processing ? 'Menyimpan...' : 'Simpan Evaluasi'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 py-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
