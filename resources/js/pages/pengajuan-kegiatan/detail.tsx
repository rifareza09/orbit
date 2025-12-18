import React, { useState } from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { router, usePage } from '@inertiajs/react';
import { formatCurrency } from '@/utils/currency';
import { X } from 'lucide-react';

interface ProgramKerja {
  id: number;
  nama_kegiatan: string;
  anggaran_dana: number;
  status: string;
}

interface ItemPengajuanDana {
  id: number;
  nama_item: string;
  deskripsi_item: string;
  quantity: number;
  harga_satuan: number;
  total_harga: number;
}

interface PengajuanKegiatan {
  id: number;
  program_kerja_id?: number;
  nama_kegiatan: string;
  ketua_pelaksana: string;
  tempat_pelaksanaan: string;
  jumlah_peserta: number;
  tanggal_pelaksanaan: string;
  total_anggaran: number;
  status: string;
  status_review: string;
  catatan_puskaka: string | null;
  reviewed_at: string | null;
  deskripsi: string;
  proposal_path?: string;
  program_kerja?: ProgramKerja;
  item_pengajuan_dana: ItemPengajuanDana[];
}

export default function DetailPengajuanKegiatan() {
  const { pengajuan } = usePage<{ pengajuan: PengajuanKegiatan }>().props;
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleAjukan = () => {
    router.put(`/pengajuan-kegiatan/ajukan/${pengajuan.id}`, {}, {
      onSuccess: () => {
        alert('✅ Pengajuan kegiatan berhasil diajukan ke Puskaka!');
        router.visit('/pengajuan-kegiatan');
      },
      onError: () => {
        alert('❌ Gagal mengajukan pengajuan kegiatan. Silakan coba lagi.');
      }
    });
  };

  const confirmAjukan = () => {
    setShowConfirmModal(false);
    handleAjukan();
  };

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus pengajuan kegiatan ini?')) {
      router.delete(`/pengajuan-kegiatan/${pengajuan.id}`, {
        onSuccess: () => {
          router.visit('/pengajuan-kegiatan');
        }
      });
    }
  };

    return (
        <DashboardLayout>
            <div className="p-8 bg-[#F5F6FA] min-h-screen">

                {/* Header + Tombol Hapus */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[#0B132B]">
                        Detail Pengajuan Kegiatan
                    </h1>

                    <button
                      onClick={handleDelete}
                      className="bg-[#8B0000] text-white px-6 py-2 rounded-md hover:bg-red-900 transition"
                    >
                        Hapus
                    </button>
                </div>

                {/* CARD WRAPPER */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

                    {/* Card Header */}
                    <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold">
                        Informasi Kegiatan
                    </div>

                    {/* Card Body */}
                    <div className="p-6 grid grid-cols-2 gap-x-10 gap-y-6">

                        {/* Nama Kegiatan */}
                        <div>
                            <p className="font-bold text-sm text-gray-800">
                                Nama Kegiatan
                            </p>
                            <p className="mt-1 text-gray-800">
                                {pengajuan.nama_kegiatan}
                            </p>
                        </div>

                        {/* Ketua Pelaksana */}
                        <div>
                            <p className="font-bold text-sm text-gray-800">
                                Ketua Pelaksana
                            </p>
                            <p className="mt-1 text-gray-800">
                                {pengajuan.ketua_pelaksana}
                            </p>
                        </div>

                        {/* Tempat Pelaksanaan */}
                        <div>
                            <p className="font-bold text-sm text-gray-800">
                                Tempat Pelaksanaan
                            </p>
                            <p className="mt-1 text-gray-800">
                                {pengajuan.tempat_pelaksanaan}
                            </p>
                        </div>

                        {/* Jumlah Peserta */}
                        <div>
                            <p className="font-bold text-sm text-gray-800">
                                Jumlah Peserta
                            </p>
                            <p className="mt-1 text-gray-800">
                                {pengajuan.jumlah_peserta} orang
                            </p>
                        </div>

                        {/* Tanggal Pelaksanaan */}
                        <div>
                            <p className="font-bold text-sm text-gray-800">
                                Tanggal Pelaksanaan
                            </p>
                            <p className="mt-1 text-gray-800">
                                {new Date(pengajuan.tanggal_pelaksanaan).toLocaleDateString('id-ID')}
                            </p>
                        </div>

                        {/* Program Kerja */}
                        {pengajuan.program_kerja && (
                            <div>
                                <p className="font-bold text-sm text-gray-800">
                                    Program Kerja Terkait
                                </p>
                                <p className="mt-1 text-gray-800">
                                    {pengajuan.program_kerja.nama_kegiatan}
                                </p>
                                <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    {pengajuan.program_kerja.status}
                                </span>
                            </div>
                        )}

                        {/* Proposal File */}
                        {pengajuan.proposal_path && (
                            <div>
                                <p className="font-bold text-sm text-gray-800">
                                    Proposal (PDF)
                                </p>
                                <a
                                    href={`/storage/${pengajuan.proposal_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-block text-blue-600 hover:text-blue-800 underline"
                                >
                                    📄 {pengajuan.proposal_path.split('/').pop()}
                                </a>
                            </div>
                        )}

                        {/* Deskripsi */}
                        <div className="col-span-2">
                            <p className="font-bold text-sm text-gray-800">
                                Deskripsi Kegiatan
                            </p>
                            <p className="mt-1 leading-relaxed text-gray-800">
                                {pengajuan.deskripsi || 'Tidak ada deskripsi'}
                            </p>
                        </div>

                        {/* Total Anggaran */}
                        <div>
                            <p className="font-bold text-sm text-gray-800">
                                Total Anggaran
                            </p>
                            <p className="mt-1 text-gray-800 font-semibold text-lg">
                                {formatCurrency(pengajuan.total_anggaran)}
                            </p>
                        </div>

                        {/* Status */}
                        <div>
                            <p className="font-bold text-sm text-gray-800">
                                Status Review Puskaka
                            </p>
                            <span className={`mt-1 inline-block text-xs font-medium px-3 py-1 rounded-full ${
                              pengajuan.status_review === 'Menunggu Review' ? 'bg-yellow-200 text-yellow-800' :
                              pengajuan.status_review === 'Direview' ? 'bg-blue-200 text-blue-800' :
                              pengajuan.status_review === 'Disetujui' ? 'bg-green-200 text-green-800' :
                              pengajuan.status_review === 'Ditolak' ? 'bg-red-200 text-red-800' :
                              pengajuan.status_review === 'Direvisi' ? 'bg-orange-200 text-orange-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                                {pengajuan.status_review}
                            </span>
                            {pengajuan.reviewed_at && (
                              <p className="mt-1 text-xs text-gray-500">
                                Direview pada: {pengajuan.reviewed_at}
                              </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* CATATAN PUSKAKA */}
                {pengajuan.catatan_puskaka && (
                  <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 overflow-hidden mt-6">
                    <div className="bg-blue-100 text-blue-900 px-6 py-3 font-semibold border-b border-blue-200">
                      Catatan dari Puskaka
                    </div>
                    <div className="p-6">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {pengajuan.catatan_puskaka}
                      </p>
                    </div>
                  </div>
                )}

                {/* DETAIL ITEM PENGAJUAN DANA */}
                {pengajuan.item_pengajuan_dana && pengajuan.item_pengajuan_dana.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-6">
                    <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold">
                      Detail Pengajuan Dana
                    </div>
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th className="px-4 py-2">No</th>
                              <th className="px-4 py-2">Nama Item</th>
                              <th className="px-4 py-2">Deskripsi</th>
                              <th className="px-4 py-2">Quantity</th>
                              <th className="px-4 py-2">Harga Satuan</th>
                              <th className="px-4 py-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pengajuan.item_pengajuan_dana.map((item, index) => (
                              <tr key={item.id} className="border-b">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{item.nama_item}</td>
                                <td className="px-4 py-2">{item.deskripsi_item || '-'}</td>
                                <td className="px-4 py-2">{item.quantity}</td>
                                <td className="px-4 py-2">{formatCurrency(item.harga_satuan)}</td>
                                <td className="px-4 py-2 font-semibold">{formatCurrency(item.total_harga)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* BUTTONS */}
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={() => router.visit('/pengajuan-kegiatan')}
                        className="bg-gray-500 text-white px-8 py-2 rounded-lg shadow hover:bg-gray-600 transition"
                    >
                        Kembali
                    </button>

                    {/* Tombol Edit untuk status Belum Diajukan atau Ditolak */}
                    {(pengajuan.status === 'Belum Diajukan' || pengajuan.status_review === 'Ditolak') && (
                        <button
                          onClick={() => router.visit(`/pengajuan-kegiatan/edit/${pengajuan.id}`)}
                          className="bg-blue-500 text-white px-8 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                        >
                          Edit Proposal
                        </button>
                    )}

                    {/* Tombol Revisi khusus untuk status Direvisi - hanya tombol ini yang muncul */}
                    {pengajuan.status_review === 'Direvisi' && (
                        <button
                          onClick={() => router.visit(`/pengajuan-kegiatan/edit/${pengajuan.id}`)}
                          className="bg-orange-500 text-white px-8 py-2 rounded-lg shadow hover:bg-orange-600 transition font-semibold"
                        >
                          Revisi Proposal
                        </button>
                    )}

                    {/* Tombol Ajukan hanya untuk status Belum Diajukan atau Ditolak */}
                    {(pengajuan.status === 'Belum Diajukan' || pengajuan.status_review === 'Ditolak') && (
                        <button
                          onClick={() => setShowConfirmModal(true)}
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

            {/* CONFIRMATION MODAL */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-[#0B132B]">Konfirmasi Pengajuan</h2>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700">
                                Apakah Anda yakin ingin mengajukan pengajuan kegiatan <strong>"{pengajuan.nama_kegiatan}"</strong> ke Puskaka?
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                Total anggaran: <strong>{formatCurrency(pengajuan.total_anggaran)}</strong>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Pengajuan ini akan diteruskan untuk review dan persetujuan oleh Puskaka.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmAjukan}
                                className="flex-1 bg-[#0B132B] text-white py-2 rounded-lg hover:bg-[#1C2541] transition font-medium"
                            >
                                Ya, Ajukan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
