import React from "react";
import { router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { formatCurrency } from "@/utils/currency";
import { Plus, Eye, FileText } from "lucide-react";

type Program = {
  id: number;
  program_kerja: string;
  kegiatan: string;
  deskripsi_kegiatan: string;
  jenis_kegiatan: string;
  estimasi_anggaran: string;
  status?: string;
};

export default function ProgramKerja() {

  const { programs = [] } = usePage().props as Partial<{ programs: Program[] }>;


  return (
    <DashboardLayout>
      <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        {/* Header dengan gradient */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B132B] to-[#1C2541] bg-clip-text text-transparent">
              Program Kerja Tahunan
            </h1>
            <p className="text-gray-500 mt-1">Kelola program kerja organisasi Anda</p>
          </div>
          <button
            onClick={() => router.visit("/program-kerja/tambah")}
            className="group bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Tambah Program Kerja
          </button>
        </div>

        {/* Table dengan styling modern */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gradient-to-r from-[#0B132B] to-[#1C2541]">
                  <th className="px-6 py-4 text-white font-semibold">No.</th>
                  <th className="px-6 py-4 text-white font-semibold">Program Kerja</th>
                  <th className="px-6 py-4 text-white font-semibold">Kegiatan</th>
                  <th className="px-6 py-4 text-white font-semibold">Deskripsi</th>
                  <th className="px-6 py-4 text-white font-semibold">Jenis</th>
                  <th className="px-6 py-4 text-white font-semibold">Estimasi Anggaran</th>
                  <th className="px-6 py-4 text-white font-semibold">Status</th>
                  <th className="px-6 py-4 text-white font-semibold text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {programs.length > 0 ? programs.map((item, index) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                  >
                    <td className="px-6 py-4 font-medium text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                          <FileText size={18} className="text-white" />
                        </div>
                        <span className="font-semibold text-gray-800">{item.program_kerja}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{item.kegiatan}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{item.deskripsi_kegiatan}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {item.jenis_kegiatan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(Number(item.estimasi_anggaran))}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all duration-300 ${
                        item.status === 'Disetujui' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/25' :
                        item.status === 'Ditolak' ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-red-500/25' :
                        item.status === 'Direview' ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-blue-500/25' :
                        item.status === 'Diajukan' ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-amber-500/25' :
                        item.status === 'Direvisi' ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-orange-500/25' :
                        'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
                      }`}>
                        {item.status ?? 'Belum Diajukan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => router.visit(`/program-kerja/detail/${item.id}`)}
                        className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                        Detail
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                          <FileText size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">Belum ada program kerja</p>
                        <p className="text-gray-400 text-sm mt-1">Klik tombol "Tambah Program Kerja" untuk memulai</p>
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
