import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function DokumentasiKegiatan() {
  // contoh data dummy (nanti kamu bisa ganti dengan gambar asli)
  const dokumentasiList = [
    { id: 1, gambar: "/images/dok1.jpg", judul: "Workshop Teknik Vokal" },
    { id: 2, gambar: "/images/dok2.jpg", judul: "Pelatihan Band UKM" },
    { id: 3, gambar: "/images/dok3.jpg", judul: "Latihan Rutin Mingguan" },
    { id: 4, gambar: "/images/dok4.jpg", judul: "Acara Campus Night" },
    { id: 5, gambar: "/images/dok5.jpg", judul: "Dies Natalis Kampus" },
    { id: 6, gambar: "/images/dok6.jpg", judul: "Kolaborasi UKM Seni Tari" },
  ];

  return (
    <DashboardLayout>
      {/* === KONTEN UTAMA === */}
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">
            Dokumentasi Kegiatan
          </h1>
          <button className="bg-[#0B132B] text-white px-5 py-2 rounded-lg hover:bg-[#1C2541] transition">
            Buat Dokumentasi
          </button>
        </div>

        {/* Grid Card Dokumentasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dokumentasiList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="bg-gray-200 h-40 w-full flex items-center justify-center overflow-hidden">
                <img
                  src={item.gambar}
                  alt={item.judul}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center font-medium text-[#0B132B]">
                {item.judul}
              </div>
            </div>
          ))}

          {/* Tambahan slot kosong jika ingin menjaga bentuk grid */}
          {Array.from({ length: Math.max(8 - dokumentasiList.length, 0) }).map(
            (_, i) => (
              <div
                key={`empty-${i}`}
                className="bg-white rounded-xl shadow border border-gray-200 h-52"
              ></div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
