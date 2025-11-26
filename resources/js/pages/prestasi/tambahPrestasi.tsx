import React, { useState, FormEvent } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Upload } from 'lucide-react';

export default function TambahPrestasiPage() {
  const [formData, setFormData] = useState({
    nama_prestasi: '',
    jenis_prestasi: '',
    tingkat_kejuaraan: '',
    nama_peraih: '',
    tanggal_perolehan: '',
  });

  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBuktiFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('nama_prestasi', formData.nama_prestasi);
    data.append('jenis_prestasi', formData.jenis_prestasi);
    data.append('tingkat_kejuaraan', formData.tingkat_kejuaraan);
    data.append('nama_peraih', formData.nama_peraih);
    data.append('tanggal_perolehan', formData.tanggal_perolehan);

    if (buktiFile) {
      data.append('bukti', buktiFile);
    }

    router.post('/prestasi', data);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/prestasi"
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold text-[#0B132B]">Tambah Prestasi</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Prestasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Prestasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_prestasi"
                value={formData.nama_prestasi}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                placeholder="Contoh: Juara 1 Lomba Karya Tulis Ilmiah"
              />
            </div>

            {/* Jenis Prestasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Prestasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jenis_prestasi"
                value={formData.jenis_prestasi}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                placeholder="Contoh: Akademik, Olahraga, Seni, dll"
              />
            </div>

            {/* Tingkat Kejuaraan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tingkat Kejuaraan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tingkat_kejuaraan"
                value={formData.tingkat_kejuaraan}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                placeholder="Contoh: Nasional, Provinsi, Kota, Universitas"
              />
            </div>

            {/* Nama Peraih */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Peraih <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_peraih"
                value={formData.nama_peraih}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                placeholder="Contoh: Tim Debat LDK KAHFI"
              />
            </div>

            {/* Tanggal Perolehan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Perolehan <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_perolehan"
                value={formData.tanggal_perolehan}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
              />
            </div>

            {/* Upload Bukti */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bukti (PDF)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition">
                  <Upload size={20} />
                  <span>Pilih File</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {fileName && (
                  <span className="text-sm text-gray-600">{fileName}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format: PDF, Maksimal 5MB
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-[#0B132B] text-white px-6 py-2 rounded-lg hover:bg-[#1C2541] transition"
              >
                Simpan
              </button>
              <Link
                href="/prestasi"
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
