import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { router, usePage } from "@inertiajs/react";

// Menambahkan tipe untuk item
interface ProgramKerjaItem {
  id: number;
  programKerja: string;
  kegiatan: string;
  deskripsiKegiatan: string;
  jenisKegiatan: string;
  estimasiKegiatan: string;
  status: string;
}

export default function EditProgramKerja() {
  const { item } = usePage().props as { item?: ProgramKerjaItem }; // Pastikan item ada atau tidak
  const [formData, setFormData] = useState({
    program_kerja: '',
    kegiatan: '',
    deskripsi_kegiatan: '',
    jenis_kegiatan: '',
    estimasi_anggaran: '',
    status: 'Diajukan', // Default status
  });

  // Mengisi data form jika item ada
  useEffect(() => {
    if (item) {
      setFormData({
        program_kerja: item.programKerja,
        kegiatan: item.kegiatan,
        deskripsi_kegiatan: item.deskripsiKegiatan,
        jenis_kegiatan: item.jenisKegiatan,
        estimasi_anggaran: item.estimasiKegiatan,
        status: item.status || 'Diajukan', // Menangani jika status kosong
      });
    }
  }, [item]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
  e.preventDefault();

  const cleaned = {
    ...formData,
    // hapus semua karakter non-digit
    estimasi_anggaran: String(formData.estimasi_anggaran).replace(/[^0-9]/g, ''),
  };

  router.put(`/program-kerja/${item?.id}`, cleaned, {
    onSuccess: () => {
      alert("Program kerja berhasil diperbarui!");
      router.visit("/program-kerja");
    },
    onError: (errors) => {
      console.log(errors);
      alert("Gagal memperbarui: " + JSON.stringify(errors));
    },
  });
};


  return (
    <DashboardLayout>
      <div className="p-8 bg-[#F5F6FA] min-h-screen">
        <h1 className="text-2xl font-bold text-[#0B132B] mb-6">Edit Program Kerja</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* KIRI */}
            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Nama Program Kerja
              </label>
              <input
                type="text"
                name="program_kerja"
                value={formData.program_kerja}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <label className="block font-semibold text-[#0B132B] mb-2 mt-4">
                Deskripsi Kegiatan
              </label>
              <textarea
                name="deskripsi_kegiatan"
                value={formData.deskripsi_kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"
              ></textarea>

              <label className="block font-semibold text-[#0B132B] mb-2 mt-4">
                Estimasi Anggaran
              </label>
          <input
  name="estimasi_anggaran"
  value={formData.estimasi_anggaran}
  onChange={(e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setFormData((p) => ({ ...p, estimasi_anggaran: raw }));
  }}
/>


            </div>

            {/* KANAN */}
            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Nama Kegiatan
              </label>
              <input
                type="text"
                name="kegiatan"
                value={formData.kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <label className="block font-semibold text-[#0B132B] mb-2 mt-4">
                Jenis Kegiatan
              </label>
              <select
                name="jenis_kegiatan"
                value={formData.jenis_kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Pilih</option>
                <option value="Pengembangan Sumber Daya Mahasiswa">
                  Pengembangan Sumber Daya Mahasiswa
                </option>
                <option value="Akademik dan Prestasi">Akademik dan Prestasi</option>
                <option value="Minat dan Bakat">Minat dan Bakat</option>
                <option value="Sosial dan Pengabdian Masyarakat">
                  Sosial dan Pengabdian Masyarakat
                </option>
                <option value="Internal Ormawa">Internal Ormawa</option>
                <option value="Teknologi dan Inovasi">Teknologi dan Inovasi</option>
              </select>

              <label className="block font-semibold text-[#0B132B] mb-2 mt-4">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Belum Diajukan">Belum Diajukan</option>
                <option value="Diajukan">Diajukan</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          {/* BUTTON */}
          <div className="col-span-2 flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={() => router.visit("/program-kerja")}
              className="bg-[#B60000] text-white px-6 py-2 rounded-md hover:bg-[#8B0000] transition"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="bg-[#0B132B] text-white px-6 py-2 rounded-md hover:bg-[#1C2541] transition"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
