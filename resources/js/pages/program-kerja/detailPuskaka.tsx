import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, useForm, usePage } from "@inertiajs/react";

interface ProgramKerja {
  id: number;
  program_kerja: string;
  kegiatan: string;
  deskripsi_kegiatan: string;
  jenis_kegiatan: string;
  estimasi_anggaran: string;
  status: string;
  catatan_puskaka: string | null;
  ormawa: string;
  user_id: number;
  created_at: string;
}

interface Props {
  programKerja: ProgramKerja;
}

export default function DetailPuskaka({ programKerja }: Props) {
  const [activeTab, setActiveTab] = useState<'program-kerja' | 'pengajuan-dana'>('program-kerja');
  const { flash } = usePage().props as any;
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    status: programKerja.status,
    catatan_puskaka: programKerja.catatan_puskaka || '',
  });

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
    openConfirmation('Apakah Anda yakin ingin menyetujui program kerja ini?', () => {
      setIsLoading(true);
      post(`/program-kerja/${programKerja.id}/update-status`, {
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
      });
    });
  };

  const handleReject = () => {
    if (!data.catatan_puskaka) {
      alert('Catatan wajib diisi saat menolak');
      return;
    }
    openConfirmation('Apakah Anda yakin ingin menolak program kerja ini?', () => {
      setData('status', 'Ditolak');
      setIsLoading(true);
      post(`/program-kerja/${programKerja.id}/update-status`, {
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
      });
    });
  };

  const handleRevise = () => {
    if (!data.catatan_puskaka) {
      alert('Catatan wajib diisi saat meminta revisi');
      return;
    }
    openConfirmation('Apakah Anda yakin ingin meminta revisi program kerja ini?', () => {
      setData('status', 'Direvisi');
      setIsLoading(true);
      post(`/program-kerja/${programKerja.id}/update-status`, {
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
      });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/program-kerja/${programKerja.id}/update-status`, {
      preserveScroll: true,
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
            <h1 className="text-2xl font-bold text-[#0B132B]">Detail Program Kerja</h1>
          </div>

          {/* Tabs */}
          
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
            <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] px-6 py-3 border-b">
              <h2 className="font-bold text-white text-sm">Detail Kegiatan</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Nama Kegiatan
                  </label>
                  <input
                    type="text"
                    value={programKerja.kegiatan}
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
                    value={programKerja.program_kerja}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Organisasi
                  </label>
                  <input
                    type="text"
                    value={programKerja.ormawa}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    tanggal
                  </label>
                  <input
                    type="text"
                    value={programKerja.created_at}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Jenis Kegiatan
                  </label>
                  <input
                    type="text"
                    value={programKerja.jenis_kegiatan}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Deskripsi Kegiatan
                  </label>
                  <textarea
                    value={programKerja.deskripsi_kegiatan}
                    readOnly
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Estimasi Anggaran
                  </label>
                  <input
                    type="text"
                    value={`Rp ${parseInt(programKerja.estimasi_anggaran).toLocaleString('id-ID')}`}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status Pengajuan Section */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] px-6 py-3 border-b">
                <h2 className="font-bold text-white text-sm">Review & Evaluasi</h2>
                {programKerja.status === 'Disetujui' && (
                  <p className="text-xs text-gray-300 mt-1">Program kerja yang sudah disetujui tidak dapat diubah statusnya lagi.</p>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Catatan Puskaka
                  </label>
                  <textarea
                    value={data.catatan_puskaka}
                    onChange={(e) => setData('catatan_puskaka', e.target.value)}
                    disabled={programKerja.status === 'Disetujui'}
                    rows={4}
                    placeholder="Tulis catatan atau komentar..."
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                  />
                  {errors.catatan_puskaka && (
                    <p className="text-red-600 text-xs mt-1">{errors.catatan_puskaka}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pb-8 mt-6">
              <Link
                href="/program-kerja/indexPuskaka"
                className="px-8 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-semibold transition-colors text-sm shadow"
              >
                Kembali
              </Link>
              <button
                type="button"
                onClick={() => {
                  setData('status', 'Direvisi');
                  handleRevise();
                }}
                disabled={isLoading || programKerja.status === 'Disetujui'}
                className="px-8 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Perlu Revisi'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setData('status', 'Ditolak');
                  handleReject();
                }}
                disabled={isLoading || programKerja.status === 'Disetujui'}
                className="px-8 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Tolak'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setData('status', 'Disetujui');
                  handleApprove();
                }}
                disabled={isLoading || programKerja.status === 'Disetujui'}
                className="px-8 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Setujui'}
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
