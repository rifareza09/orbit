import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  periode: string | null;
  deskripsi: string | null;
  logo_path: string | null;
  logo_url: string | null;
}

interface Props {
  user: User;
}

export default function EditProfileOrmawa({ user }: Props) {
  const [logoPreview, setLogoPreview] = useState<string | null>(user.logo_url);

  const { data, setData, post, processing, errors } = useForm({
    name: user.name || '',
    periode: user.periode || '',
    deskripsi: user.deskripsi || '',
    logo: null as File | null,
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('logo', file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setData('logo', null);
    setLogoPreview(user.logo_url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/profil/update');
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
            Edit Profil Ormawa
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Logo Organisasi
              </label>

              <div className="flex items-start gap-6">
                {/* Preview */}
                <div className="w-32 h-28 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Upload size={32} className="text-gray-400" />
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                  <div>
                    <input
                      type="file"
                      id="logo"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo"
                      className="inline-flex items-center gap-2 bg-[#0B132B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152042] transition cursor-pointer"
                    >
                      <Upload size={16} />
                      Pilih Logo
                    </label>
                    {data.logo && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="ml-2 inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        <X size={16} />
                        Hapus
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Format: PNG, JPG, JPEG. Maksimal 5MB.
                  </p>
                  {errors.logo && (
                    <p className="text-sm text-red-600">{errors.logo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Nama Organisasi */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Organisasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                placeholder="Contoh: UKM Seni Tari"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Periode */}
            <div>
              <label htmlFor="periode" className="block text-sm font-semibold text-gray-700 mb-2">
                Periode
              </label>
              <input
                type="text"
                id="periode"
                value={data.periode}
                readOnly
                disabled
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Periode hanya dapat diubah oleh Puskaka
              </p>
              {errors.periode && (
                <p className="mt-1 text-sm text-red-600">{errors.periode}</p>
              )}
            </div>

            {/* Deskripsi */}
            <div>
              <label htmlFor="deskripsi" className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi Organisasi
              </label>
              <textarea
                id="deskripsi"
                value={data.deskripsi}
                onChange={(e) => setData('deskripsi', e.target.value)}
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition resize-none"
                placeholder="Tulis deskripsi singkat tentang organisasi Anda..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Opsional. Jelaskan visi, misi, atau kegiatan organisasi Anda.
              </p>
              {errors.deskripsi && (
                <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
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
