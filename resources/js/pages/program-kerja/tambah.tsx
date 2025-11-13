import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Calendar, Info } from "lucide-react";
import { router } from "@inertiajs/react";

export default function TambahProgramKerja() {
  const handleBatal = () => {
    router.visit("/program-kerja");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* === HEADER === */}
        <h1 className="text-2xl font-semibold text-[#0B132B] mb-8">
          Tambah Program Kerja
        </h1>

        {/* === FORM === */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {/* Nama Program */}
          <div>
            <label className="block font-medium text-[#0B132B] mb-2">
              Nama Program
            </label>
            <select className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 focus:ring-2 focus:ring-[#0B132B] focus:outline-none">
              <option value="">Pilih Program</option>
              <option value="open-recruitment">Open Recruitment</option>
              <option value="workshop">Workshop</option>
              <option value="event">Event</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          {/* Jenis Program */}
          <div>
            <label className="block font-medium text-[#0B132B] mb-2">
              Jenis Program
            </label>
            <select className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 focus:ring-2 focus:ring-[#0B132B] focus:outline-none">
              <option value="">Pilih Jenis</option>
              <option value="akademik">Akademik</option>
              <option value="non-akademik">Non-Akademik</option>
            </select>
          </div>

          {/* Tanggal Pelaksanaan */}
          <div>
            <label className="block font-medium text-[#0B132B] mb-2">
              Tanggal Pelaksanaan
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 focus:ring-2 focus:ring-[#0B132B] focus:outline-none"
              />
              <Calendar
                className="absolute right-3 top-2.5 text-gray-500"
                size={20}
              />
            </div>
          </div>

          {/* Program Divisi */}
          <div>
            <label className="block font-medium text-[#0B132B] mb-2">
              Program Divisi
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan divisi program"
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 focus:ring-2 focus:ring-[#0B132B] focus:outline-none"
              />
              <Info
                className="absolute right-3 top-2.5 text-gray-500"
                size={20}
              />
            </div>
          </div>

          {/* Deskripsi Program */}
          <div className="md:col-span-2">
            <label className="block font-medium text-[#0B132B] mb-2">
              Deskripsi Program
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan deskripsi singkat program kerja..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 focus:ring-2 focus:ring-[#0B132B] focus:outline-none resize-none"
            ></textarea>
          </div>
        </form>

        {/* === BUTTONS === */}
        <div className="flex gap-4 mt-8">
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
        <div className="text-center text-gray-500 text-sm mt-12">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
