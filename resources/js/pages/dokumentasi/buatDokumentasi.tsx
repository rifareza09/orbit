import React, { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function BuatDokumentasi() {
  const { data, setData, post, processing, errors } = useForm({
    nama_kegiatan: "",
    tanggal_kegiatan: "",
    foto: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/dokumentasi', {
      onSuccess: () => {
        router.visit('/dokumentasi');
      }
    });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (allowedTypes.includes(file.type)) {
        setData('foto', file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('File harus berformat PNG, JPG, atau JPEG');
        e.target.value = '';
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-[#0B132B] mb-6">
          Buat Dokumentasi
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <div className="space-y-6">
            {/* Nama Kegiatan */}
            <div>
              <label htmlFor="nama_kegiatan" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kegiatan
              </label>
              <input
                id="nama_kegiatan"
                type="text"
                value={data.nama_kegiatan}
                onChange={e => setData('nama_kegiatan', e.target.value)}
                placeholder="Masukkan nama kegiatan"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.nama_kegiatan && (
                <p className="text-red-500 text-xs mt-1">{errors.nama_kegiatan}</p>
              )}
            </div>

            {/* Tanggal Kegiatan */}
            <div>
              <label htmlFor="tanggal_kegiatan" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Kegiatan
              </label>
              <input
                id="tanggal_kegiatan"
                type="date"
                value={data.tanggal_kegiatan}
                onChange={e => setData('tanggal_kegiatan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.tanggal_kegiatan && (
                <p className="text-red-500 text-xs mt-1">{errors.tanggal_kegiatan}</p>
              )}
            </div>

            {/* Upload Dokumentasi */}
            <div>
              <label htmlFor="foto-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Dokumentasi
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                <input
                  type="file"
                  onChange={handleFotoChange}
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  id="foto-upload"
                  required
                />
                <label htmlFor="foto-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    {previewUrl ? (
                      <div className="mb-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-64 rounded-lg shadow"
                        />
                      </div>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-gray-500">
                          {data.foto ? data.foto.name : "Klik untuk upload foto"}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          Format: PNG, JPG, JPEG (Max 5MB)
                        </span>
                      </>
                    )}
                  </div>
                </label>
              </div>
              {errors.foto && (
                <p className="text-red-500 text-xs mt-1">{errors.foto}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-6">
            <button
              type="button"
              onClick={() => router.visit('/dokumentasi')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition bg-red-600 text-white hover:bg-red-700"
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-[#0B132B] text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
