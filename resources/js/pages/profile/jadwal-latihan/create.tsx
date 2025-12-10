import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function CreateJadwalLatihan() {
  const { data, setData, post, processing, errors } = useForm({
    divisi: '',
    hari: '',
    pukul: '',
    tempat: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/profile/jadwal-latihan');
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
            Tambah Jadwal Latihan
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Divisi */}
            <div>
              <label htmlFor="divisi" className="block text-sm font-semibold text-gray-700 mb-2">
                Divisi/Seksi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="divisi"
                value={data.divisi}
                onChange={(e) => setData('divisi', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                placeholder="Contoh: Tari, Band, Futsal"
                required
              />
              {errors.divisi && (
                <p className="mt-1 text-sm text-red-600">{errors.divisi}</p>
              )}
            </div>

            {/* Hari */}
            <div>
              <label htmlFor="hari" className="block text-sm font-semibold text-gray-700 mb-2">
                Hari <span className="text-red-500">*</span>
              </label>
              <select
                id="hari"
                value={data.hari}
                onChange={(e) => setData('hari', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                required
              >
                <option value="">Pilih Hari</option>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
              {errors.hari && (
                <p className="mt-1 text-sm text-red-600">{errors.hari}</p>
              )}
            </div>

            {/* Pukul */}
            <div>
              <label htmlFor="pukul" className="block text-sm font-semibold text-gray-700 mb-2">
                Waktu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="pukul"
                value={data.pukul}
                onChange={(e) => setData('pukul', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                placeholder="Contoh: 16:00 - 18:00"
                required
              />
              {errors.pukul && (
                <p className="mt-1 text-sm text-red-600">{errors.pukul}</p>
              )}
            </div>

            {/* Tempat */}
            <div>
              <label htmlFor="tempat" className="block text-sm font-semibold text-gray-700 mb-2">
                Tempat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tempat"
                value={data.tempat}
                onChange={(e) => setData('tempat', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                placeholder="Contoh: Aula Gedung A Lantai 3"
                required
              />
              {errors.tempat && (
                <p className="mt-1 text-sm text-red-600">{errors.tempat}</p>
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
                {processing ? 'Menyimpan...' : 'Simpan Jadwal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
