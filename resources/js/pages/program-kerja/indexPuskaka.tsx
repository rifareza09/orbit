import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import { X } from "lucide-react"; // Pastikan library lucide-react terinstall

// Definisi tipe data program kerja
interface ProgramKerja {
  id: number;
  program_kerja: string;
  kegiatan: string;
  deskripsi_kegiatan: string;
  jenis_kegiatan: string;
  estimasi_anggaran: number;
  status: string;
  ormawa_name?: string;
}

export default function IndexPuskaka({ programs = [] }: { programs: ProgramKerja[] }) {
  
  // Helper untuk format Rupiah
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col justify-between">
        
        {/* Main Content */}
        <div>
          <h1 className="text-2xl font-bold text-[#0B132B] mb-6 font-sans">
            Program Kerja Diajukan
          </h1>

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
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody className="bg-white">
                  {programs.length > 0 ? (
                    // KONDISI: ADA DATA
                    programs.map((item, index) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50 text-[#0B132B]">
                        <td className="px-6 py-4 text-center">{index + 1}</td>
                        <td className="px-6 py-4 font-medium">
                          {item.program_kerja}
                          {/* Menampilkan nama Ormawa jika ada */}
                          {item.ormawa_name && (
                            <div className="text-xs text-gray-500 mt-1 font-normal">
                              Oleh: {item.ormawa_name}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">{item.kegiatan}</td>
                        <td className="px-6 py-4 truncate max-w-xs" title={item.deskripsi_kegiatan}>
                          {item.deskripsi_kegiatan}
                        </td>
                        <td className="px-6 py-4">{item.jenis_kegiatan}</td>
                        <td className="px-6 py-4">{formatCurrency(item.estimasi_anggaran)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${item.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 
                              item.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'}
                          `}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // KONDISI: DATA KOSONG (Seperti di Screenshot)
                    <tr>
                      <td colSpan={7} className="h-64 align-middle">
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

        {/* Footer (Sesuai Screenshot) */}
        <div className="text-center text-xs text-gray-500 mt-12 mb-4">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}