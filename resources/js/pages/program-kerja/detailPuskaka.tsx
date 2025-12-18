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

  const { data, setData, post, processing, errors } = useForm({
    status: programKerja.status,
    catatan_puskaka: programKerja.catatan_puskaka || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/program-kerja/${programKerja.id}/update-status`, {
      preserveScroll: true,
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-[#0B132B]">Manajemen Kegiatan</h1>
          </div>

          {/* Tabs */}
          <div className="px-8 flex gap-4">
            <button
              onClick={() => setActiveTab('program-kerja')}
              className={`pb-3 px-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'program-kerja'
                  ? 'border-[#0B132B] text-[#0B132B]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Program Kerja
            </button>

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
            <div className="bg-yellow-100 px-6 py-3 border-b border-yellow-200">
              <h2 className="font-bold text-[#0B132B] text-sm">Detail Kegiatan</h2>
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
                    organisasi
                  </label>
                  <select
                    value={programKerja.ormawa}
                    disabled
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm"
                  >
                    <option value={programKerja.ormawa}>{programKerja.ormawa}</option>
                  </select>
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
              </div>
            </div>
          </div>

          {/* Status Pengajuan Section */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-blue-100 px-6 py-3 border-b border-blue-200">
                <h2 className="font-bold text-[#0B132B] text-sm">Status Pengajuan</h2>
                {programKerja.status === 'Disetujui' && (
                  <p className="text-xs text-blue-700 mt-1">Program kerja yang sudah disetujui tidak dapat diubah statusnya lagi.</p>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Status
                  </label>
                  <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    disabled={programKerja.status === 'Disetujui'}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                  >
                    <option value="Belum Diajukan">Belum Diajukan</option>
                    <option value="Diajukan">Diajukan</option>
                    <option value="Direview">Direview</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Ditolak">Ditolak</option>
                    <option value="Direvisi">Direvisi</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-600 text-xs mt-1">{errors.status}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Catatan
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
            <div className="flex justify-end gap-3 pb-8 mt-6">
              <Link
                href="/program-kerja/indexPuskaka"
                className="px-6 py-2.5 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 font-semibold transition-colors text-sm"
              >
                Kembali
              </Link>
              <button
                type="submit"
                disabled={processing || programKerja.status === 'Disetujui'}
                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-[#0B132B] rounded font-semibold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Menyimpan...' : 'Simpan Status'}
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
