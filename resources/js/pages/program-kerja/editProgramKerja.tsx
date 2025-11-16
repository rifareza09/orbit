import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { router } from "@inertiajs/react";

export default function EditProgramKerja() {
  // Data dummy (bebas kamu edit)
  const [data, setData] = useState({
    nama_program: "Pengembangan Anggota",
    nama_kegiatan: "Open Recruitment dan Pelatihan Dasar Sinematografi",
    deskripsi:
      "Menyaring dan melatih anggota baru dalam dasar perfilman (kamera, lighting, audio, editing)",
    jenis_kegiatan: "Pengembangan Sumber Daya Mahasiswa",
    estimasi_anggaran: "Rp. 5.000.000",
    status: "Belum Diajukan",
  });

  const handleChange = (key: string, value: any) => {
    setData({ ...data, [key]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Simulasi: data disimpan (dummy).");
    console.log(data);
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#F5F6FA] min-h-screen">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0B132B]">Edit Program Kerja</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold">
            Form Edit Program
          </div>

          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-6">
            {/* LEFT */}
            <div>
              <label className="font-semibold text-sm">Nama Program Kerja</label>
              <input
                type="text"
                className="w-full mt-2 p-2 border rounded-lg"
                value={data.nama_program}
                onChange={(e) => handleChange("nama_program", e.target.value)}
              />

              <label className="font-semibold text-sm mt-4 block">
                Deskripsi Kegiatan
              </label>
              <textarea
                className="w-full mt-2 p-2 border rounded-lg h-32"
                value={data.deskripsi}
                onChange={(e) => handleChange("deskripsi", e.target.value)}
              />

              <label className="font-semibold text-sm mt-4 block">
                Estimasi Anggaran
              </label>
              <input
                type="text"
                className="w-full mt-2 p-2 border rounded-lg"
                value={data.estimasi_anggaran}
                onChange={(e) => handleChange("estimasi_anggaran", e.target.value)}
              />
            </div>

            {/* RIGHT */}
            <div>
              <label className="font-semibold text-sm">Nama Kegiatan</label>
              <input
                type="text"
                className="w-full mt-2 p-2 border rounded-lg"
                value={data.nama_kegiatan}
                onChange={(e) => handleChange("nama_kegiatan", e.target.value)}
              />

              <label className="font-semibold text-sm mt-4 block">
                Jenis Kegiatan
              </label>
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

              <label className="font-semibold text-sm mt-4 block">Status</label>
              <select
                className="w-full mt-2 p-2 border rounded-lg"
                value={data.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="Belum Diajukan">Belum Diajukan</option>
                <option value="Diajukan">Diajukan</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-between items-center mt-2">
              <button
                type="button"
                onClick={() => router.visit("/program-kerja")}
                className="bg-[#0B132B] text-white px-6 py-2 rounded-lg shadow hover:bg-[#1C2541] transition"
              >
                Kembali
              </button>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[#0B132B] text-white px-6 py-2 rounded-lg shadow hover:bg-[#1C2541] transition"
                >
                  Simpan Perubahan
                </button>

                <button
                  type="button"
                  onClick={() => alert("Simulasi: program diajukan (dummy).")}
                  className="bg-[#0B132B] text-white px-6 py-2 rounded-lg shadow hover:bg-[#1C2541] transition"
                >
                  Ajukan
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="text-center text-gray-500 text-sm mt-8">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
