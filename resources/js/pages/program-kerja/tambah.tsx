import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { router } from "@inertiajs/react";

export default function TambahProgramKerja() {
  const handleBatal = () => {
    router.visit("/program-kerja");
  };

  return (
    <DashboardLayout>
      <div className="p-10">

        {/* === HEADER === */}
        <h1 className="text-2xl font-semibold text-[#0B132B] mb-10">
          Tambah Program Kerja
        </h1>

        {/* === FORM GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl">

          {/* ========= KIRI ========= */}
          <div className="space-y-6">

            {/* Nama Program Kerja */}
            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Nama Program Kerja
              </label>
              <input
                type="text"
                placeholder="Nama Program Kerja"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-[#0B132B] focus:outline-none"
              />
            </div>

            {/* Deskripsi Kegiatan */}
            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Deskripsi Kegiatan
              </label>
              <textarea
                rows={2}
                placeholder="Tuliskan deskripsi kegiatan..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-[#0B132B] focus:outline-none resize-none"
              ></textarea>
            </div>

            {/* Estimasi Anggaran */}
            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Estimasi Anggaran
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-600">Rp</span>
                <input
                 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-[#0B132B] focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>

          </div>


          {/* ========= KANAN ========= */}
          <div className="space-y-6">

            {/* Nama Kegiatan */}
            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Nama Kegiatan
              </label>
              <input
                type="text"
                placeholder="Masukkan nama kegiatan"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-[#0B132B] focus:outline-none"
              />
            </div>

            {/* Jenis Kegiatan */}
            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Jenis Kegiatan
              </label>

              {/* Custom simple dropdown */}
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-[#0B132B] focus:outline-none"
              >
                <option value="">Pilih</option>
                <option value="sumber-daya">Pengembangan Sumber Daya Mahasiswa</option>
                <option value="akademik">Akademik dan Prestasi</option>
                <option value="minat-bakat">Minat dan Bakat</option>
                <option value="sosial">Sosial dan Pengabdian Masyarakat</option>
                <option value="kesejahteraan">Kesejahteraan Masyarakat</option>
                <option value="kolaborasi">Kolaborasi dan Hubungan Eksternal</option>
                <option value="advokasi">Advokasi dan Kebijakan</option>
                <option value="teknologi">Teknologi dan Inovasi</option>
                <option value="internal">Internal Ormawa</option>
                <option value="keagamaan">Keagamaan dan Spiritual</option>
              </select>
            </div>

          </div>
        </div>

        {/* === BUTTONS === */}
        <div className="flex gap-4 mt-10">
          <button
            type="button"
            onClick={handleBatal}
            className="bg-[#B60000] text-white px-6 py-2 rounded-md hover:bg-[#8B0000] transition"
          >
            Batalkan
          </button>

          <button
            type="submit"
            className="bg-[#0B132B] text-white px-6 py-2 rounded-md hover:bg-[#1C2541] transition"
          >
            Buat
          </button>
        </div>

        {/* === FOOTER === */}
        <div className="text-center text-gray-500 text-sm mt-20">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>

      </div>
    </DashboardLayout>
  );
}
