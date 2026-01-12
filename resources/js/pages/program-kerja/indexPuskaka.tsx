import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { FileText, Building2, Eye, Inbox } from "lucide-react";

interface ProgramKerja {
  id: number;
  program_kerja: string;
  kegiatan: string;
  deskripsi_kegiatan: string;
  jenis_kegiatan: string;
  estimasi_anggaran: string;
  status: string;
  ormawa: string;
  user_id: number;
  created_at: string;
}

interface Props {
  programKerjas: ProgramKerja[];
}

export default function IndexPuskaka({ programKerjas = [] }: Props) {
  const { flash } = usePage().props as any;

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Disetujui':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/25';
      case 'Ditolak':
        return 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-red-500/25';
      case 'Direview':
        return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-blue-500/25';
      case 'Direvisi':
        return 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-orange-500/25';
      default:
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-amber-500/25';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B132B] to-[#1C2541] bg-clip-text text-transparent">
            Program Kerja Diajukan
          </h1>
          <p className="text-gray-500 mt-1">Review dan kelola program kerja dari Ormawa</p>
        </div>

        {/* Success Message */}
        {flash?.success && (
          <div className="bg-green-100 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 shadow-sm">
            <span className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {flash.success}
            </span>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gradient-to-r from-[#0B132B] to-[#1C2541]">
                  <th className="px-6 py-4 text-white font-semibold w-16 text-center">No.</th>
                  <th className="px-6 py-4 text-white font-semibold">Organisasi</th>
                  <th className="px-6 py-4 text-white font-semibold">Program Kerja</th>
                  <th className="px-6 py-4 text-white font-semibold">Nama Kegiatan</th>
                  <th className="px-6 py-4 text-white font-semibold">Jenis Kegiatan</th>
                  <th className="px-6 py-4 text-white font-semibold">Estimasi Anggaran</th>
                  <th className="px-6 py-4 text-white font-semibold">Status</th>
                  <th className="px-6 py-4 text-white font-semibold text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {programKerjas.length > 0 ? (
                  programKerjas.map((item, index) => (
                    <tr key={item.id} className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                      <td className="px-6 py-4 text-center font-medium text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <Building2 size={18} className="text-white" />
                          </div>
                          <span className="font-semibold text-gray-800">{item.ormawa}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{item.program_kerja}</td>
                      <td className="px-6 py-4 text-gray-700">{item.kegiatan}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {item.jenis_kegiatan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-emerald-600">
                          Rp {parseInt(item.estimasi_anggaran).toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/program-kerja/${item.id}/detail-puskaka`}
                          className="group/btn inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-20">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
                          <Inbox size={40} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-semibold text-lg">
                          Belum ada Program Kerja yang Diajukan
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Program kerja dari Ormawa akan muncul di sini
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm mt-10 py-6 border-t border-gray-200">
          <p className="text-gray-400">
            © 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
