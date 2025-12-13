import React, { useState, FormEvent } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Upload, FileText } from 'lucide-react';

export default function TambahPrestasiPage() {
  const [formData, setFormData] = useState({
    nama_prestasi: '',
    jenis_prestasi: 'Akademik',
    tingkat_kejuaraan: 'Lokal',
    nama_peraih: '',
    tanggal_perolehan: '',
  });

  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setBuktiFile(file);
        setFileName(file.name);
      } else {
        alert('File harus berformat PDF');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('nama_prestasi', formData.nama_prestasi);
    data.append('jenis_prestasi', formData.jenis_prestasi);
    data.append('tingkat_kejuaraan', formData.tingkat_kejuaraan);
    data.append('nama_peraih', formData.nama_peraih);
    data.append('tanggal_perolehan', formData.tanggal_perolehan);

    if (buktiFile) {
      data.append('bukti', buktiFile);
    }

    router.post('/prestasi', data, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/prestasi"
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft size={24} className="text-[#0B132B]" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#0B132B]">Tambah Prestasi</h1>
            <p className="text-gray-600 text-sm mt-1">Tambahkan prestasi baru untuk organisasi Anda</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] px-8 py-6">
            <h2 className="text-white text-xl font-semibold">Informasi Prestasi</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Row 1: Nama Prestasi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Prestasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_prestasi"
                value={formData.nama_prestasi}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                placeholder="Contoh: Juara 1 Lomba Karya Tulis Ilmiah Nasional"
              />
            </div>

            {/* Row 2: Jenis & Tingkat */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jenis Prestasi <span className="text-red-500">*</span>
                </label>
                <select
                  name="jenis_prestasi"
                  value={formData.jenis_prestasi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                >
                  <option value="Akademik">Akademik</option>
                  <option value="Olahraga">Olahraga</option>
                  <option value="Seni">Seni</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tingkat Kejuaraan <span className="text-red-500">*</span>
                </label>
                <select
                  name="tingkat_kejuaraan"
                  value={formData.tingkat_kejuaraan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                >
                  <option value="Lokal">Lokal</option>
                  <option value="Provinsi">Provinsi</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Internasional">Internasional</option>
                </select>
              </div>
            </div>

            {/* Row 3: Nama Peraih */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Peraih <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_peraih"
                value={formData.nama_peraih}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                placeholder="Contoh: Ahmad Dahlan, Tim Futsal A"
              />
            </div>

            {/* Row 4: Tanggal Perolehan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Perolehan <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_perolehan"
                value={formData.tanggal_perolehan}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
              />
            </div>

            {/* Row 5: Upload Bukti */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Bukti Prestasi (PDF) <span className="text-gray-500 text-xs">Opsional</span>
              </label>
              <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-[#0B132B] hover:bg-blue-50 cursor-pointer transition">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
                <div className="text-center">
                  <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-700 font-medium">Klik untuk upload atau drag & drop</p>
                  <p className="text-gray-500 text-sm">Format: PDF (Max 5MB)</p>
                </div>
              </label>

              {fileName && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <FileText size={20} className="text-green-600" />
                  <span className="text-sm text-green-700 font-medium">{fileName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setBuktiFile(null);
                      setFileName('');
                    }}
                    className="ml-auto text-green-600 hover:text-green-800 text-sm font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Link
                href="/prestasi"
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-semibold text-center"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#0B132B] text-white px-6 py-3 rounded-lg hover:bg-[#1C2541] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Prestasi'}
              </button>
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
