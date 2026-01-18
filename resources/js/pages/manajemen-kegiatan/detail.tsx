import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, useForm, usePage, router } from "@inertiajs/react";
import { Download } from "lucide-react";

interface ItemPengajuanDana {
  id: number;
  nama_item: string;
  kuantitas: number;
  harga_satuan: string;
  total: number;
}

interface Pengajuan {
  id: number;
  nama_kegiatan: string;
  ormawa: string;
  program_kerja: string;
  ketua_pelaksana: string;
  tempat_pelaksanaan: string;
  jumlah_peserta: number;
  tanggal_pelaksanaan: string;
  deskripsi: string;
  total_anggaran: string;
  status_review: string;
  catatan_puskaka: string | null;
  proposal_path: string | null;
  created_at: string;
  item_pengajuan_dana: ItemPengajuanDana[];
}

interface Props {
  pengajuan: Pengajuan;
}

export default function ManajemenKegiatanDetail({ pengajuan }: Props) {
  const { flash } = usePage().props as any;
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    status_review: pengajuan.status_review,
    catatan_puskaka: pengajuan.catatan_puskaka || '',
  });

  // Helper function to calculate total for an item
  const calculateItemTotal = (item: ItemPengajuanDana): number => {
    const hargaSatuan = typeof item.harga_satuan === 'string' 
      ? Number.parseFloat(item.harga_satuan.replaceAll(/[^\d.-]/g, '')) 
      : item.harga_satuan;
    const kuantitas = item.kuantitas || 0;
    return hargaSatuan * kuantitas;
  };

  // Calculate total anggaran
  const calculateTotalAnggaran = (): number => {
    return pengajuan.item_pengajuan_dana.reduce((sum, item) => {
      return sum + calculateItemTotal(item);
    }, 0);
  };

  const openConfirmation = (message: string, callback: () => void) => {
    setConfirmMessage(message);
    setConfirmCallback(() => callback);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    if (confirmCallback) {
      confirmCallback();
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setConfirmCallback(null);
  };

  const handleApprove = () => {
    openConfirmation('Apakah Anda yakin ingin menyetujui pengajuan kegiatan ini?', () => {
      setIsLoading(true);
      router.post(`/manajemen-kegiatan/${pengajuan.id}/update-review`, {
        status_review: 'Disetujui',
        catatan_puskaka: data.catatan_puskaka,
      }, {
        preserveScroll: true,
        onSuccess: () => {
          router.visit('/manajemen-kegiatan');
        },
        onFinish: () => setIsLoading(false),
      });
    });
  };

  const handleReject = () => {
    if (!data.catatan_puskaka.trim()) {
      alert('⚠️ Catatan wajib diisi saat menolak!');
      return;
    }
    openConfirmation('Apakah Anda yakin ingin menolak pengajuan kegiatan ini?', () => {
      setIsLoading(true);
      router.post(`/manajemen-kegiatan/${pengajuan.id}/update-review`, {
        status_review: 'Ditolak',
        catatan_puskaka: data.catatan_puskaka,
      }, {
        preserveScroll: true,
        onSuccess: () => {
          router.visit('/manajemen-kegiatan');
        },
        onFinish: () => setIsLoading(false),
      });
    });
  };

  const handleRevise = () => {
    if (!data.catatan_puskaka.trim()) {
      alert('⚠️ Catatan wajib diisi saat meminta revisi!');
      return;
    }
    openConfirmation('Apakah Anda yakin ingin meminta revisi pengajuan kegiatan ini?', () => {
      setIsLoading(true);
      router.post(`/manajemen-kegiatan/${pengajuan.id}/update-review`, {
        status_review: 'Direvisi',
        catatan_puskaka: data.catatan_puskaka,
      }, {
        preserveScroll: true,
        onSuccess: () => {
          router.visit('/manajemen-kegiatan');
        },
        onFinish: () => setIsLoading(false),
      });
    });
  };

  return (
    <DashboardLayout>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Konfirmasi Aksi</h2>
            <p className="text-gray-700 mb-6">{confirmMessage}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-[#0B132B]">Detail Pengajuan Kegiatan</h1>
            <p className="text-sm text-gray-600 mt-1">
              Diajukan oleh <span className="font-semibold">{pengajuan.ormawa}</span> pada {pengajuan.created_at}
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold flex items-center justify-between">
              <h2 className="font-bold text-white text-lg">Detail Kegiatan</h2>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                  pengajuan.status_review === 'Disetujui' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/25' :
                  pengajuan.status_review === 'Ditolak' ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' :
                  pengajuan.status_review === 'Direview' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-blue-500/25' :
                  pengajuan.status_review === 'Direvisi' ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-orange-500/25' :
                  'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-amber-500/25'
                }`}>
                  {pengajuan.status_review}
                </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Nama Kegiatan
                  </label>
                  <input
                    type="text"
                    value={pengajuan.nama_kegiatan}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Program Kerja
                  </label>
                  <input
                    type="text"
                    value={pengajuan.program_kerja}
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
                    value={pengajuan.ketua_pelaksana}
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
                    value={pengajuan.tanggal_pelaksanaan}
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
                    value={pengajuan.tempat_pelaksanaan}
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
                    value={pengajuan.jumlah_peserta}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Deskripsi Kegiatan
                  </label>
                  <textarea
                    value={pengajuan.deskripsi}
                    readOnly
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rencana Anggaran Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold">
              <h2 className="font-bold text-white text-lg">Rencana Anggaran</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">No</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Nama Item</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Kuantitas</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Harga Satuan</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pengajuan.item_pengajuan_dana.length > 0 ? (
                    pengajuan.item_pengajuan_dana.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-6 py-3 text-gray-600">{index + 1}</td>
                        <td className="px-6 py-3 text-gray-700">{item.nama_item}</td>
                        <td className="px-6 py-3 text-gray-700 font-semibold">{item.kuantitas || 0}</td>
                        <td className="px-6 py-3 text-gray-700 font-mono">
                          Rp {Number.parseFloat(item.harga_satuan).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-3 text-gray-700 font-mono font-semibold">
                          Rp {calculateItemTotal(item).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-6 text-center text-gray-400 italic">
                        Tidak ada item anggaran
                      </td>
                    </tr>
                  )}
                  {pengajuan.item_pengajuan_dana.length > 0 && (
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan={4} className="px-6 py-3 text-right text-gray-700">
                        Total Anggaran:
                      </td>
                      <td className="px-6 py-3 text-gray-900 font-mono text-lg">
                        Rp {calculateTotalAnggaran().toLocaleString('id-ID')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* File Proposal */}
          {pengajuan.proposal_path && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold">
                <h2 className="font-bold text-white text-lg">File Proposal</h2>
              </div>
              <div className="p-6">
                <a
                  href={`/storage/${pengajuan.proposal_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Download size={16} />
                  Download Proposal
                </a>
              </div>
            </div>
          )}

          {/* Review & Evaluasi */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold">
              <h2 className="font-bold text-white text-lg">Review & Evaluasi</h2>
              <p className="text-xs text-white/90 mt-1">Program kerja yang sudah disetujui tidak dapat diubah statusnya lagi.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Catatan Puskaka
                </label>
                <textarea
                  value={data.catatan_puskaka}
                  onChange={(e) => setData('catatan_puskaka', e.target.value)}
                  rows={5}
                  placeholder="Tulis catatan atau komentar..."
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                />
                {errors.catatan_puskaka && (
                  <p className="text-red-600 text-xs mt-1">{errors.catatan_puskaka}</p>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-4 pb-8 mt-6">
              <Link
                href="/manajemen-kegiatan"
                className="px-8 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-semibold transition-colors text-sm shadow"
              >
                Kembali
              </Link>
              <button
                type="button"
                onClick={handleRevise}
                disabled={isLoading || pengajuan.status_review === 'Disetujui' || pengajuan.status_review === 'Direvisi' || pengajuan.status_review === 'Ditolak'}
                className="px-8 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Perlu Revisi'}
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isLoading || pengajuan.status_review === 'Disetujui' || pengajuan.status_review === 'Direvisi' || pengajuan.status_review === 'Ditolak'}
                className="px-8 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Tolak'}
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isLoading || pengajuan.status_review === 'Disetujui' || pengajuan.status_review === 'Direvisi' || pengajuan.status_review === 'Ditolak'}
                className="px-8 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Setujui'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 py-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
