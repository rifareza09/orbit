import React from "react";
import { router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";

interface DokumentasiItem {
  id: number;
  nama_kegiatan: string;
  tanggal_kegiatan: string;
  foto_url: string | null;
}

export default function DokumentasiKegiatan() {
  const { dokumentasi } = usePage<{
    dokumentasi: DokumentasiItem[];
  }>().props;

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">
            Dokumentasi Kegiatan
          </h1>
          <button
            onClick={() => router.visit('/dokumentasi/buat')}
            className="bg-[#0B132B] text-white px-5 py-2 rounded-lg hover:bg-[#1C2541] transition"
          >
            Buat Dokumentasi
          </button>
        </div>

        {/* Grid Card Dokumentasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dokumentasi.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="bg-gray-200 h-40 w-full flex items-center justify-center overflow-hidden">
                {item.foto_url ? (
                  <img
                    src={item.foto_url}
                    alt={item.nama_kegiatan}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No Image</div>
                )}
              </div>
              <div className="p-3 text-center">
                <p className="font-medium text-[#0B132B]">{item.nama_kegiatan}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.tanggal_kegiatan).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
