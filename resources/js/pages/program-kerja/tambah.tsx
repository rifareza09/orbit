import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { router } from "@inertiajs/react";
import { formatCurrencyInput, convertFormattedToNumber } from "@/utils/currency";

export default function TambahProgramKerja() {
  const [formData, setFormData] = useState({
    program_kerja: "",
    kegiatan: "",
    deskripsi_kegiatan: "",
    jenis_kegiatan: "",
    estimasi_anggaran: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'estimasi_anggaran' ? formatCurrencyInput(value) : value,
    });
    // Clear error saat user mulai edit
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Convert formatted currency back to number before submit
    const submitData = {
      ...formData,
      estimasi_anggaran: convertFormattedToNumber(formData.estimasi_anggaran),
    };

    router.post("/program-kerja", submitData, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setProcessing(false);
      },
      onError: (newErrors) => {
        setProcessing(false);
        setErrors(newErrors as Record<string, string>);
      },
    });
  };

  const handleBatal = () => {
    router.visit("/program-kerja");
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="p-10">
        <h1 className="text-2xl font-semibold text-[#0B132B] mb-10">
          Tambah Program Kerja
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl">

          {/* KIRI */}
          <div className="space-y-6">

            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Nama Program Kerja
              </label>
              <input
                type="text"
                name="program_kerja"
                value={formData.program_kerja}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-gray-100 rounded-lg"
              />
              {errors.program_kerja && (
                <p className="text-red-600 text-sm">{errors.program_kerja}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Deskripsi Kegiatan
              </label>
              <textarea
                name="deskripsi_kegiatan"
                rows={2}
                value={formData.deskripsi_kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-gray-100 rounded-lg"
              ></textarea>
              {errors.deskripsi_kegiatan && (
                <p className="text-red-600 text-sm">{errors.deskripsi_kegiatan}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Estimasi Anggaran
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-600">Rp</span>
                <input
                  name="estimasi_anggaran"
                  value={formData.estimasi_anggaran}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-2 border bg-gray-100 rounded-lg"
                />
              </div>
              {errors.estimasi_anggaran && (
                <p className="text-red-600 text-sm">{errors.estimasi_anggaran}</p>
              )}
            </div>

          </div>

          {/* KANAN */}
          <div className="space-y-6">

            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Nama Kegiatan
              </label>
              <input
                type="text"
                name="kegiatan"
                value={formData.kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-gray-100 rounded-lg"
              />
              {errors.kegiatan && (
                <p className="text-red-600 text-sm">{errors.kegiatan}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#0B132B] mb-2">
                Jenis Kegiatan
              </label>
              <select
                name="jenis_kegiatan"
                value={formData.jenis_kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-gray-100 rounded-lg"
              >
                <option value="">Pilih</option>
                <option value="Pengembangan Sumber Daya Mahasiswa">Pengembangan Sumber Daya Mahasiswa</option>
                <option value="Akademik dan Prestasi">Akademik dan Prestasi</option>
                <option value="Minat dan Bakat">Minat dan Bakat</option>
                <option value="Sosial dan Pengabdian Masyarakat">Sosial dan Pengabdian Masyarakat</option>
                <option value="Internal Ormawa">Internal Ormawa</option>
                <option value="Teknologi dan Inovasi">Teknologi dan Inovasi</option>
              </select>
              {errors.jenis_kegiatan && (
                <p className="text-red-600 text-sm">{errors.jenis_kegiatan}</p>
              )}
            </div>

          </div>
        </div>

        {/* BUTTON */}
        <div className="flex gap-4 mt-10">
          <button
            type="button"
            onClick={handleBatal}
            className="bg-[#B60000] text-white px-6 py-2 rounded-md"
          >
            Batalkan
          </button>

          <button
            type="submit"
            disabled={processing}
            className="bg-[#0B132B] text-white px-6 py-2 rounded-md"
          >
            {processing ? "Menyimpan..." : "Buat"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
