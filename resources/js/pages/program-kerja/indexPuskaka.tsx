import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { X } from "lucide-react";

// Definisi tipe data program kerja
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col justify-between">
        {/* Main Content */}
        <div>
          <h1 className="text-2xl font-bold text-[#0B132B] mb-6 font-sans">
            Program Kerja Diajukan
          </h1>

          {/* Success Message */}
          {flash?.success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
              <span className="block sm:inline">{flash.success}</span>
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header (Dark Blue) */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#0B132B] text-white">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-16 text-center">No.</th>
                    <th className="px-6 py-4 font-semibold">Organisasi</th>
                    <th className="px-6 py-4 font-semibold">Program Kerja</th>
                    <th className="px-6 py-4 font-semibold">Nama Kegiatan</th>
                    <th className="px-6 py-4 font-semibold">Jenis Kegiatan</th>
                    <th className="px-6 py-4 font-semibold">Estimasi Anggaran</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white">
                  {programKerjas.length > 0 ? (
                    programKerjas.map((item, index) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50 text-[#0B132B]">
                        <td className="px-6 py-4 text-center">{index + 1}</td>
                        <td className="px-6 py-4 font-medium">{item.ormawa}</td>
                        <td className="px-6 py-4">{item.program_kerja}</td>
                        <td className="px-6 py-4">{item.kegiatan}</td>
                        <td className="px-6 py-4">{item.jenis_kegiatan}</td>
                        <td className="px-6 py-4 font-mono">
                          Rp {parseInt(item.estimasi_anggaran).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${item.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                              item.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'}
                          `}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/program-kerja/${item.id}/detail-puskaka`}
                            className="inline-block bg-[#0B132B] hover:bg-[#1C2541] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="h-64 align-middle">
                        <div className="flex flex-col items-center justify-center w-full">
                          {/* Circle X Icon */}
                          <div className="w-16 h-16 rounded-full border-2 border-[#0B132B] flex items-center justify-center mb-4">
                            <X size={32} className="text-[#0B132B]" strokeWidth={1.5} />
                          </div>
                          {/* Text */}
                          <p className="text-[#0B132B] font-medium text-lg">
                            Belum ada Program Kerja yang Diajukan
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-12 mb-4">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
