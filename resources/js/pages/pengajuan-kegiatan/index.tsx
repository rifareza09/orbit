import React from "react";
import { router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { formatCurrency } from "@/utils/currency";
import { Eye, Calendar, Users, MapPin, Wallet, ClipboardList } from "lucide-react";

interface PengajuanKegiatan {
  id: number;
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
}

export default function PengajuanKegiatan() {
  const { pengajuan } = usePage<{
    pengajuan: PengajuanKegiatan[];
  }>().props;

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Disetujui':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/25';
      case 'Ditolak':
        return 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-red-500/25';
      case 'Diajukan':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-amber-500/25';
      case 'Direvisi':
        return 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-orange-500/25';
      default:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B132B] to-[#1C2541] bg-clip-text text-transparent">
            Pengajuan Kegiatan
          </h1>
          <p className="text-gray-500 mt-1">Kelola pengajuan kegiatan organisasi Anda</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gradient-to-r from-[#0B132B] to-[#1C2541]">
                  <th className="px-5 py-4 text-white font-semibold w-[4%]">No.</th>
                  <th className="px-5 py-4 text-white font-semibold w-[20%]">Nama Kegiatan</th>
                  <th className="px-5 py-4 text-white font-semibold w-[15%]">Ketua Pelaksana</th>
                  <th className="px-5 py-4 text-white font-semibold w-[14%]">Tempat</th>
                  <th className="px-5 py-4 text-white font-semibold w-[8%]">Peserta</th>
                  <th className="px-5 py-4 text-white font-semibold w-[11%]">Tanggal</th>
                  <th className="px-5 py-4 text-white font-semibold w-[12%]">Anggaran</th>
                  <th className="px-5 py-4 text-white font-semibold w-[10%]">Status</th>
                  <th className="px-5 py-4 text-white font-semibold w-[8%] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pengajuan.length > 0 ? (
                  pengajuan.map((item, index) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                    >
                      <td className="px-5 py-4 font-medium text-gray-600">{index + 1}.</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <ClipboardList size={18} className="text-white" />
                          </div>
                          <span className="font-semibold text-gray-800">{item.nama_kegiatan}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users size={16} className="text-gray-400" />
                          {item.ketua_pelaksana}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} className="text-gray-400" />
                          {item.tempat_pelaksanaan}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                          {item.jumlah_peserta}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          {new Date(item.tanggal_pelaksanaan).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-emerald-600">
                          {formatCurrency(item.total_anggaran)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => router.visit(`/pengajuan-kegiatan/detail/${item.id}`)}
                          className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                          <ClipboardList size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">Belum ada pengajuan kegiatan</p>
                        <p className="text-gray-400 text-sm mt-1">Tunggu sampai Puskaka menyetujui program kerja Anda</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm mt-8 py-6 border-t border-gray-200">
          <p className="text-gray-400">
            © 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
