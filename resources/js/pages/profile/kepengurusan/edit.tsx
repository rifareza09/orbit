import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Kepengurusan {
  id: number;
  jabatan: string;
  nama: string;
  prodi: string;
  npm: string;
}

interface Props {
  kepengurusan: Kepengurusan;
}

export default function EditKepengurusan({ kepengurusan }: Props) {
  const predefinedJabatan = ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Koordinator Divisi', 'Anggota Divisi', 'Anggota'];
  const isCustomJabatan = !predefinedJabatan.includes(kepengurusan.jabatan);

  const { data, setData, put, processing, errors } = useForm({
    jabatan: kepengurusan.jabatan,
    nama: kepengurusan.nama,
    prodi: kepengurusan.prodi,
    npm: kepengurusan.npm,
  });

  const [showCustomJabatan, setShowCustomJabatan] = React.useState(isCustomJabatan);
  const [customJabatan, setCustomJabatan] = React.useState(isCustomJabatan ? kepengurusan.jabatan : '');

  const handleJabatanChange = (value: string) => {
    if (value === 'Lainnya') {
      setShowCustomJabatan(true);
      setData('jabatan', customJabatan);
    } else {
      setShowCustomJabatan(false);
      setCustomJabatan('');
      setData('jabatan', value);
    }
  };

  const handleCustomJabatanChange = (value: string) => {
    setCustomJabatan(value);
    setData('jabatan', value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/profile/kepengurusan/${kepengurusan.id}`);
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
            Edit Data Kepengurusan
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
                value={showCustomJabatan ? 'Lainnya' : data.jabatan}
                onChange={(e) => handleJabatanChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                required={!showCustomJabatan}
              >
                <option value="">Pilih Jabatan</option>
                <option value="Ketua">Ketua</option>
                <option value="Wakil Ketua">Wakil Ketua</option>
                <option value="Sekretaris">Sekretaris</option>
                <option value="Bendahara">Bendahara</option>
                <option value="Koordinator Divisi">Koordinator Divisi</option>
                <option value="Anggota Divisi">Anggota Divisi</option>
                <option value="Anggota">Anggota</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              {errors.jabatan && (
                <p className="mt-1 text-sm text-red-600">{errors.jabatan}</p>
              )}
            </div>

            {/* Custom Jabatan Input */}
            {showCustomJabatan && (
              <div>
                <label htmlFor="customJabatan" className="block text-sm font-semibold text-gray-700 mb-2">
                  Jabatan Lainnya <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="customJabatan"
                  value={customJabatan}
                  onChange={(e) => handleCustomJabatanChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                  placeholder="Ketik jabatan Anda"
                  required
                />
              </div>
            )}

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
                placeholder="Contoh: 2024010001"
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
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition text-center"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-[#0B132B] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152042] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
