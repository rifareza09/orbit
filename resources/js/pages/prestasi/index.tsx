import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function PrestasiPage() {
  const data = [
    {
      id: 1,
      nama: "Juara 1 Short Video DKI JAKARTA XXI",
      jenis: "Video",
      tingkat: "Nasional",
      peraih: "UKM Band",
      tanggal: "10 Mei 2025",
      bukti: "link atau file",
    },
    {
      id: 2,
      nama: "Juara 2 Short Video Antar Provinsi XI",
      jenis: "Video",
      tingkat: "Provinsi",
      peraih: "UKM Band",
      tanggal: "15 Juli 2025",
      bukti: "link atau file",
    },
    {
      id: 3,
      nama: "Juara 3 Ulang Tahun Jakarta ke XXXI",
      jenis: "Festival",
      tingkat: "Kota",
      peraih: "UKM Band",
      tanggal: "2 Agustus 2025",
      bukti: "link atau file",
    },
    {
      id: 4,
      nama: "Juara 4 Membuat Indomie",
      jenis: "Kuliner",
      tingkat: "Kampus",
      peraih: "LDK",
      tanggal: "5 September 2025",
      bukti: "link atau file",
    },
    {
      id: 5,
      nama: "Juara 2 Lomba Short Video YARSI",
      jenis: "Video",
      tingkat: "Universitas",
      peraih: "UKM Band",
      tanggal: "21 Oktober 2025",
      bukti: "link atau file",
    },
    {
      id: 6,
      nama: "Juara 1 Organisasi Paling Baik",
      jenis: "Organisasi",
      tingkat: "Universitas",
      peraih: "Himpunan Mahasiswa",
      tanggal: "25 November 2025",
      bukti: "link atau file",
    },
  ];

  return (
    <DashboardLayout>
      {/* === KONTEN UTAMA === */}
      <div className="p-8">
        {/* Header + Tombol */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">Prestasi</h1>
          <button className="bg-[#0B132B] text-white px-5 py-2 rounded-lg hover:bg-[#1C2541] transition">
            Tambah Prestasi
          </button>
        </div>

        {/* === TABEL === */}
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#0B132B] text-white">
              <tr>
                <th className="px-4 py-3">No.</th>
                <th className="px-4 py-3">Nama Prestasi</th>
                <th className="px-4 py-3">Jenis Prestasi</th>
                <th className="px-4 py-3">Tingkat Kejuaraan</th>
                <th className="px-4 py-3">Nama Peraih</th>
                <th className="px-4 py-3">Tanggal Perolehan</th>
                <th className="px-4 py-3">Bukti</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.jenis}</td>
                  <td className="px-4 py-3">{item.tingkat}</td>
                  <td className="px-4 py-3">{item.peraih}</td>
                  <td className="px-4 py-3">{item.tanggal}</td>
                  <td className="px-4 py-3">{item.bukti}</td>
                </tr>
              ))}

              {/* Baris kosong biar tabel tetap penuh (12 baris total) */}
              {Array.from({ length: 12 - data.length }).map((_, i) => (
                <tr key={i + data.length} className="border-b">
                  <td className="px-4 py-3">{i + data.length + 1}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
