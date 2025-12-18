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

  const { data, setData, post, processing, errors } = useForm({
    status_review: pengajuan.status_review,
    catatan_puskaka: pengajuan.catatan_puskaka || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Use router.post with onSuccess callback for proper redirect
    router.post(`/manajemen-kegiatan/${pengajuan.id}/update-review`, {
      status_review: data.status_review,
      catatan_puskaka: data.catatan_puskaka,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        router.visit('/manajemen-kegiatan');
      },
      onError: (errors) => {
        console.error('Error:', errors);
        setIsLoading(false);
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };

  return (
    <DashboardLayout>
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
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-blue-100 px-6 py-3 border-b border-blue-200">
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
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-yellow-100 px-6 py-3 border-b border-yellow-200">
              <h2 className="font-bold text-[#0B132B] text-sm">Rencana Anggaran</h2>
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
                        <td className="px-6 py-3 text-gray-700">{item.kuantitas}</td>
                        <td className="px-6 py-3 text-gray-700 font-mono">
                          Rp {parseFloat(item.harga_satuan).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-3 text-gray-700 font-mono font-semibold">
                          Rp {item.total.toLocaleString('id-ID')}
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
                        Rp {parseFloat(pengajuan.total_anggaran).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* File Proposal */}
          {pengajuan.proposal_path && (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-3 border-b bg-white">
                <h2 className="font-bold text-[#0B132B] text-sm">File Proposal</h2>
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

          {/* Form Review */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-green-100 px-6 py-3 border-b border-green-200">
                <h2 className="font-bold text-[#0B132B] text-sm">Catatan Pengajuan</h2>
                {pengajuan.status_review === 'Disetujui' && (
                  <p className="text-xs text-green-700 mt-1">Pengajuan yang sudah disetujui tidak dapat diubah statusnya lagi.</p>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Status Pengajuan
                  </label>
                  <select
                    value={data.status_review}
                    onChange={(e) => setData('status_review', e.target.value)}
                    disabled={pengajuan.status_review === 'Disetujui'}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                  >
                    <option value="">-- Pilih Status --</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Ditolak">Ditolak</option>
                    <option value="Direvisi">Direvisi</option>
                  </select>
                  {errors.status_review && (
                    <p className="text-red-600 text-xs mt-1">{errors.status_review}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Catatan / Masukan
                  </label>
                  <textarea
                    value={data.catatan_puskaka}
                    onChange={(e) => setData('catatan_puskaka', e.target.value)}
                    disabled={pengajuan.status_review === 'Disetujui'}
                    rows={5}
                    placeholder="Tulis catatan atau masukan untuk ormawa..."
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                  />
                  {errors.catatan_puskaka && (
                    <p className="text-red-600 text-xs mt-1">{errors.catatan_puskaka}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pb-8">
              <Link
                href="/manajemen-kegiatan"
                className="px-6 py-2.5 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 font-semibold transition-colors text-sm"
              >
                Kembali
              </Link>
              <button
                type="submit"
                disabled={isLoading || pengajuan.status_review === 'Disetujui'}
                className="px-6 py-2.5 bg-[#0B132B] hover:bg-[#1C2541] text-white rounded font-semibold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Review'}
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
