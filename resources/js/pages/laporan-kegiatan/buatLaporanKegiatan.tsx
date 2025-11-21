import React from "react";
import { Calendar } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { router } from "@inertiajs/react";

export default function BuatLaporanKegiatan() {
  return (
    <DashboardLayout>
      <div className="p-10 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#0B132B] mb-8">
          Buat Laporan Kegiatan
        </h1>

        {/* GRID FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NAMA KEGIATAN */}
          <div>
            <label className="text-sm font-semibold">Nama Kegiatan</label>
            <input
              type="text"
              defaultValue="Open Recruitment dan Pelatihan Dasar Sinematografi"
              className="w-full mt-1 p-3 rounded-lg border bg-gray-100"
            />
          </div>

          {/* KETUA PELAKSANA */}
          <div>
            <label className="text-sm font-semibold">Ketua Pelaksana</label>
            <input
              type="text"
              defaultValue="Muhammad Raihan"
              className="w-full mt-1 p-3 rounded-lg border bg-gray-100"
            />
          </div>

          {/* TEMPAT */}
          <div>
            <label className="text-sm font-semibold">Tempat Pelaksanaan</label>
            <input
              type="text"
              defaultValue="Universitas YARSI"
              className="w-full mt-1 p-3 rounded-lg border"
            />
          </div>

          {/* TANGGAL */}
          <div>
            <label className="text-sm font-semibold">Tanggal Pelaksanaan</label>
            <div className="flex items-center gap-3 mt-1 p-3 rounded-lg border">
              <input
                type="text"
                defaultValue="29/12/2025"
                className="w-full outline-none"
              />
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          {/* PESERTA */}
          <div>
            <label className="text-sm font-semibold">Jumlah Peserta</label>
            <input
              type="text"
              defaultValue="63 Peserta"
              className="w-full mt-1 p-3 rounded-lg border"
            />
          </div>

          {/* DANA */}
          <div>
            <label className="text-sm font-semibold">Dana Digunakan</label>
            <input
              type="text"
              defaultValue="Rp1.300.000"
              className="w-full mt-1 p-3 rounded-lg border"
            />
          </div>

          {/* LPJ */}
          <div>
            <label className="text-sm font-semibold">Laporan Pertanggung Jawaban (LPJ)</label>
            <div className="mt-1 h-28 bg-gray-200 rounded-lg border flex items-center justify-center cursor-pointer">
              <span className="text-gray-600 text-sm">Upload</span>
            </div>
          </div>

          {/* BUKTI PENGELUARAN */}
          <div>
            <label className="text-sm font-semibold">Bukti Pengeluaran (Nota/Kwitansi)</label>
            <div className="mt-1 h-28 bg-gray-200 rounded-lg border flex items-center justify-center cursor-pointer">
              <span className="text-gray-600 text-sm">Multiple Upload</span>
            </div>
          </div>

          {/* DOKUMENTASI */}
          <div>
            <label className="text-sm font-semibold">Dokumentasi Kegiatan</label>
            <div className="mt-1 h-28 bg-gray-200 rounded-lg border flex items-center justify-center cursor-pointer">
              <span className="text-gray-600 text-sm">Multiple Upload</span>
            </div>
          </div>

          {/* CATATAN */}
          <div>
            <label className="text-sm font-semibold">Catatan</label>
            <input
              type="text"
              placeholder="....."
              className="w-full mt-1 p-3 rounded-lg border"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 mt-10">
          <button className="px-6 py-2 bg-[#1C2541] text-white rounded-lg">Kembali</button>
          <button className="px-6 py-2 bg-[#3A506B] text-white rounded-lg">Simpan</button>
        </div>

        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
