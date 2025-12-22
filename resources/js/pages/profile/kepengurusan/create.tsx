import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function CreateKepengurusan() {
  const { data, setData, post, processing, errors } = useForm({
    jabatan: '',
    nama: '',
    prodi: '',
    npm: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/profile/kepengurusan');
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 bg-[#F5F6FA] min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/profil"
            className="p-2 rounded-lg hover:bg-gray-200 transition"
          >
            <ArrowLeft size={20} className="text-[#0B132B]" />
          </Link>
          <h1 className="text-2xl font-bold text-[#0B132B]">
            Tambah Data Kepengurusan
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Jabatan */}
            <div>
              <label htmlFor="jabatan" className="block text-sm font-semibold text-gray-700 mb-2">
                Jabatan <span className="text-red-500">*</span>
              </label>
              <select
                id="jabatan"
                value={data.jabatan}
                onChange={(e) => setData('jabatan', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                required
              >
                <option value="">Pilih Jabatan</option>
                <option value="Ketua">Ketua</option>
                <option value="Wakil Ketua">Wakil Ketua</option>
                <option value="Sekretaris">Sekretaris</option>
                <option value="Bendahara">Bendahara</option>
                <option value="Koordinator Divisi">Koordinator Divisi</option>
                <option value="Anggota Divisi">Anggota Divisi</option>
                <option value="Anggota">Anggota</option>
              </select>
              {errors.jabatan && (
                <p className="mt-1 text-sm text-red-600">{errors.jabatan}</p>
              )}
            </div>

            {/* Nama */}
            <div>
              <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nama"
                value={data.nama}
                onChange={(e) => setData('nama', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                placeholder="Masukkan nama lengkap"
                required
              />
              {errors.nama && (
                <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
              )}
            </div>

            {/* Prodi */}
            <div>
              <label htmlFor="prodi" className="block text-sm font-semibold text-gray-700 mb-2">
                Program Studi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="prodi"
                value={data.prodi}
                onChange={(e) => setData('prodi', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                placeholder="Contoh: Teknik Informatika"
                required
              />
              {errors.prodi && (
                <p className="mt-1 text-sm text-red-600">{errors.prodi}</p>
              )}
            </div>

            {/* NPM */}
            <div>
              <label htmlFor="npm" className="block text-sm font-semibold text-gray-700 mb-2">
                NPM <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="npm"
                value={data.npm}
                onChange={(e) => setData('npm', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                placeholder="Masukkan NPM"
                required
              />
              {errors.npm && (
                <p className="mt-1 text-sm text-red-600">{errors.npm}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Link
                href="/profil"
                className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-center"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 px-6 py-2.5 bg-[#0B132B] text-white rounded-lg font-medium hover:bg-[#152042] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-12 font-medium">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
