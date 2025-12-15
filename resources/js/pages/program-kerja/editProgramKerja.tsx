import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { router, usePage } from "@inertiajs/react";
import { formatCurrencyInput } from "@/utils/currency";

interface ProgramKerjaItem {
  id: number;
  programKerja: string;
  kegiatan: string;
  deskripsiKegiatan: string;
  jenisKegiatan: string;
  estimasiKegiatan: number | string;
  status: string;
}

export default function EditProgramKerja() {
  const { item } = usePage<{ item: ProgramKerjaItem }>().props;

  const [formData, setFormData] = useState({
    program_kerja: "",
    kegiatan: "",
    deskripsi_kegiatan: "",
    jenis_kegiatan: "",
    estimasi_anggaran: "",
    status: "Belum Diajukan",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        program_kerja: item.programKerja,
        kegiatan: item.kegiatan,
        deskripsi_kegiatan: item.deskripsiKegiatan,
        jenis_kegiatan: item.jenisKegiatan,
        estimasi_anggaran: formatCurrencyInput(String(item.estimasiKegiatan ?? "")),
        status: item.status ?? "Belum Diajukan",
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'estimasi_anggaran' ? formatCurrencyInput(value) : value 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert formatted currency back to number before submit
    const submitData = {
      ...formData,
      estimasi_anggaran: parseInt(formData.estimasi_anggaran.replace(/\D/g, '')) || 0,
    };
    // jangan kirim status, biar tidak berubah
    const { status, ...payload } = submitData;
    router.put(`/program-kerja/${item.id}`, payload, {
      onSuccess: () => router.visit("/program-kerja"),
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
              <label htmlFor="program_kerja" className="block font-semibold text-[#0B132B] mb-2">Nama Program Kerja</label>
              <input
                id="program_kerja"
                type="text"
                name="program_kerja"
                value={formData.program_kerja}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <label htmlFor="deskripsi_kegiatan" className="block font-semibold text-[#0B132B] mb-2 mt-4">Deskripsi Kegiatan</label>
              <textarea
                id="deskripsi_kegiatan"
                name="deskripsi_kegiatan"
                value={formData.deskripsi_kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"
              />

              <label htmlFor="estimasi_anggaran" className="block font-semibold text-[#0B132B] mb-2 mt-4">Estimasi Anggaran</label>
              <input
                id="estimasi_anggaran"
                type="text"
                name="estimasi_anggaran"
                value={formData.estimasi_anggaran}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="kegiatan" className="block font-semibold text-[#0B132B] mb-2">Nama Kegiatan</label>
              <input
                id="kegiatan"
                type="text"
                name="kegiatan"
                value={formData.kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <label htmlFor="jenis_kegiatan" className="block font-semibold text-[#0B132B] mb-2 mt-4">Jenis Kegiatan</label>
              <select
                id="jenis_kegiatan"
                name="jenis_kegiatan"
                value={formData.jenis_kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Pilih</option>
                <option value="Pengembangan Sumber Daya Mahasiswa">Pengembangan Sumber Daya Mahasiswa</option>
                <option value="Akademik dan Prestasi">Akademik dan Prestasi</option>
                <option value="Minat dan Bakat">Minat dan Bakat</option>
                <option value="Sosial dan Pengabdian Masyarakat">Sosial dan Pengabdian Masyarakat</option>
                <option value="Internal Ormawa">Internal Ormawa</option>
                <option value="Teknologi dan Inovasi">Teknologi dan Inovasi</option>
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
