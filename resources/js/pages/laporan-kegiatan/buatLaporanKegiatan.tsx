import React from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";

interface PrefillData {
  pengajuan_kegiatan_id: number;
  nama_kegiatan: string;
  ketua_pelaksana: string;
  tempat_pelaksanaan: string;
  tanggal_pelaksanaan: string;
  jumlah_peserta: number;
  anggaran_disetujui: number;
}

interface ExistingData {
  anggaran_realisasi: number;
  ringkasan: string;
  lpj_file: string | null;
  bukti_pengeluaran: string[];
  dokumentasi: string[];
  status: string;
}

export default function BuatLaporanKegiatan() {
  const { prefill, isEdit, laporanId, existing } = usePage<{
    prefill: PrefillData;
    isEdit: boolean;
    laporanId: number | null;
    existing: ExistingData | null;
  }>().props;

  const { data, setData, post, put, processing, errors } = useForm({
    pengajuan_kegiatan_id: prefill?.pengajuan_kegiatan_id || 0,
    anggaran_disetujui: prefill?.anggaran_disetujui || 0,
    anggaran_realisasi: existing?.anggaran_realisasi?.toString() || "",
    ringkasan: existing?.ringkasan || "",
    lpj: null as File | null,
    bukti_pengeluaran: [] as File[],
    dokumentasi: [] as File[],
    status: existing?.status || "Belum Diajukan",
    _method: isEdit ? 'PUT' : 'POST',
    // Tambahkan field yang bisa diedit
    nama_kegiatan: prefill?.nama_kegiatan || "",
    ketua_pelaksana: prefill?.ketua_pelaksana || "",
    tempat_pelaksanaan: prefill?.tempat_pelaksanaan || "",
    tanggal_pelaksanaan: prefill?.tanggal_pelaksanaan || "",
    jumlah_peserta: prefill?.jumlah_peserta || 0,
  });

  // Validasi prefill data exists
  if (!prefill) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: Data pengajuan tidak ditemukan
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && laporanId) {
      // Update existing laporan
      post(`/laporan-kegiatan/update/${laporanId}`, {
        onSuccess: () => {
          router.visit('/laporan-kegiatan');
        },
        onError: (errors) => {
          showNotification('error', `❌ Update gagal: ${JSON.stringify(errors)}`);
        }
      });
    } else {
      // Create new laporan
      post('/laporan-kegiatan', {
        onSuccess: () => {
          router.visit('/laporan-kegiatan');
        },
        onError: (errors) => {
          showNotification('error', `❌ Simpan gagal: ${JSON.stringify(errors)}`);
        }
      });
    }
  };

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB per file
  const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total
  const [notifications, setNotifications] = React.useState<Array<{id: string, type: 'error'|'success', message: string}>>([]);

  const showNotification = (type: 'error' | 'success', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, {id, type, message}]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000); // Auto-remove after 5 seconds
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleLpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showNotification('error', `❌ File "${file.name}" tidak valid. Harus berformat PDF`);
        e.target.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        showNotification('error', `❌ File "${file.name}" terlalu besar! Ukuran: ${formatFileSize(file.size)}, Maksimal: ${formatFileSize(MAX_FILE_SIZE)}`);
        e.target.value = '';
        return;
      }
      setData('lpj', file);
      showNotification('success', `✅ File "${file.name}" (${formatFileSize(file.size)}) siap upload`);
    }
  };

  const handleBuktiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];

    const validFiles: File[] = [];
    let totalSize = 0;
    const errors: string[] = [];

    files.forEach(file => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        errors.push(`"${file.name}" - format tidak valid (harus PNG, JPG, JPEG, atau PDF)`);
        return;
      }

      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" - terlalu besar (${formatFileSize(file.size)} > ${formatFileSize(MAX_FILE_SIZE)})`);
        return;
      }

      totalSize += file.size;
      validFiles.push(file);
    });

    // Check total size
    if (totalSize > MAX_TOTAL_SIZE) {
      errors.push(`Total file terlalu besar (${formatFileSize(totalSize)} > ${formatFileSize(MAX_TOTAL_SIZE)})`);
      e.target.value = '';
    } else if (errors.length === 0) {
      setData('bukti_pengeluaran', validFiles);
      showNotification('success', `✅ ${validFiles.length} file bukti pengeluaran (${formatFileSize(totalSize)}) siap upload`);
      return;
    }

    if (errors.length > 0) {
      showNotification('error', `❌ Bukti Pengeluaran:\n${errors.join('\n')}`);
      e.target.value = '';
    }
  };

  const handleDokumentasiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];

    const validFiles: File[] = [];
    let totalSize = 0;
    const errors: string[] = [];

    files.forEach(file => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        errors.push(`"${file.name}" - format tidak valid (harus PNG, JPG, JPEG, atau PDF)`);
        return;
      }

      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" - terlalu besar (${formatFileSize(file.size)} > ${formatFileSize(MAX_FILE_SIZE)})`);
        return;
      }

      totalSize += file.size;
      validFiles.push(file);
    });

    // Check total size
    if (totalSize > MAX_TOTAL_SIZE) {
      errors.push(`Total file terlalu besar (${formatFileSize(totalSize)} > ${formatFileSize(MAX_TOTAL_SIZE)})`);
      e.target.value = '';
    } else if (errors.length === 0) {
      setData('dokumentasi', validFiles);
      showNotification('success', `✅ ${validFiles.length} file dokumentasi (${formatFileSize(totalSize)}) siap upload`);
      return;
    }

    if (errors.length > 0) {
      showNotification('error', `❌ Dokumentasi:\n${errors.join('\n')}`);
      e.target.value = '';
    }
  };
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Notification Toast Container */}
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg shadow-lg border-l-4 animate-in fade-in slide-in-from-right ${
                notif.type === 'error'
                  ? 'bg-red-50 border-l-red-500 text-red-800'
                  : 'bg-green-50 border-l-green-500 text-green-800'
              }`}
              style={{animation: 'slideIn 0.3s ease-out'}}
            >
              <p className="text-sm font-medium whitespace-pre-wrap">{notif.message}</p>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>

        <h1 className="text-2xl font-semibold text-[#0B132B] mb-6">
          {isEdit ? 'Edit Laporan Kegiatan' : 'Buat Laporan Kegiatan'}
        </h1>

        {/* Info Box - Upload Guidelines */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Panduan Upload File</h3>
              <p className="mt-1 text-sm text-blue-800">
                • Setiap file maksimal <strong>20MB</strong><br/>
                • Total semua file maksimal <strong>50MB</strong><br/>
                • Format yang diterima: <strong>PDF, JPG, JPEG, PNG</strong><br/>
                • ⚠️ Jika file melebihi batas, notifikasi akan muncul (atas kanan)<br/>
                • Tips: Kompresi gambar/PDF sebelum upload
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-semibold text-red-900">Terjadi Kesalahan:</h3>
            <ul className="mt-2 text-sm text-red-800 list-disc list-inside">
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>
                  {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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

            {/* Ketua Pelaksana */}
            <div>
              <label htmlFor="ketua_pelaksana" className="block text-sm font-medium text-gray-700 mb-2">
                Ketua Pelaksana
              </label>
              <input
                id="ketua_pelaksana"
                type="text"
                value={data.ketua_pelaksana}
                onChange={e => setData('ketua_pelaksana', e.target.value)}
                placeholder="Masukkan nama ketua pelaksana"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.ketua_pelaksana && (
                <p className="text-red-500 text-xs mt-1">{errors.ketua_pelaksana}</p>
              )}
            </div>

            {/* Tempat Pelaksanaan */}
            <div>
              <label htmlFor="tempat_pelaksanaan" className="block text-sm font-medium text-gray-700 mb-2">
                Tempat Pelaksanaan
              </label>
              <input
                id="tempat_pelaksanaan"
                type="text"
                value={data.tempat_pelaksanaan}
                onChange={e => setData('tempat_pelaksanaan', e.target.value)}
                placeholder="Masukkan tempat pelaksanaan"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.tempat_pelaksanaan && (
                <p className="text-red-500 text-xs mt-1">{errors.tempat_pelaksanaan}</p>
              )}
            </div>

            {/* Tanggal Pelaksanaan */}
            <div>
              <label htmlFor="tanggal_pelaksanaan" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Pelaksanaan
              </label>
              <input
                id="tanggal_pelaksanaan"
                type="date"
                value={data.tanggal_pelaksanaan}
                onChange={e => setData('tanggal_pelaksanaan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.tanggal_pelaksanaan && (
                <p className="text-red-500 text-xs mt-1">{errors.tanggal_pelaksanaan}</p>
              )}
            </div>

            {/* Jumlah Peserta */}
            <div>
              <label htmlFor="jumlah_peserta" className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Peserta
              </label>
              <input
                id="jumlah_peserta"
                type="number"
                value={data.jumlah_peserta}
                onChange={e => setData('jumlah_peserta', parseInt(e.target.value) || 0)}
                placeholder="Masukkan jumlah peserta"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.jumlah_peserta && (
                <p className="text-red-500 text-xs mt-1">{errors.jumlah_peserta}</p>
              )}
            </div>

            {/* Dana Digunakan */}
            <div>
              <label htmlFor="anggaran_realisasi" className="block text-sm font-medium text-gray-700 mb-2">
                Dana Digunakan
              </label>
              <input
                id="anggaran_realisasi"
                type="number"
                value={data.anggaran_realisasi}
                onChange={e => setData('anggaran_realisasi', e.target.value)}
                placeholder="Masukkan dana yang digunakan"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.anggaran_realisasi && (
                <p className="text-red-500 text-xs mt-1">{errors.anggaran_realisasi}</p>
              )}
            </div>

            {/* LPJ Upload */}
            <div>
              <label htmlFor="lpj-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Laporan Pertanggung Jawaban (LPJ)
                <span className="text-xs text-gray-500 font-normal ml-1">(Maksimal 5MB)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                <input
                  type="file"
                  onChange={handleLpjChange}
                  accept=".pdf"
                  className="hidden"
                  id="lpj-upload"
                />
                <label htmlFor="lpj-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-500">
                      {data.lpj ? data.lpj.name : (existing?.lpj_file ? 'File sudah ada' : "Upload")}
                    </span>
                    {isEdit && existing?.lpj_file && !data.lpj && (
                      <p className="text-xs text-green-600 mt-1">File saat ini: {existing.lpj_file.split('/').pop()}</p>
                    )}
                  </div>
                </label>
              </div>
              {errors.lpj && (
                <p className="text-red-500 text-xs mt-1">{errors.lpj}</p>
              )}
            </div>

            {/* Bukti Pengeluaran Upload */}
            <div>
              <label htmlFor="bukti-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Bukti Pengeluaran (Nota/Kwitansi)
                <span className="text-xs text-gray-500 font-normal ml-1">(Per file: Maks 5MB, Total: Maks 8MB)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                <input
                  type="file"
                  onChange={handleBuktiChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  multiple
                  className="hidden"
                  id="bukti-upload"
                />
                <label htmlFor="bukti-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-500">
                      {data.bukti_pengeluaran.length > 0
                        ? `${data.bukti_pengeluaran.length} file selected`
                        : "Multiple Upload"}
                    </span>
                  </div>
                </label>
              </div>
              {errors.bukti_pengeluaran && (
                <p className="text-red-500 text-xs mt-1">{errors.bukti_pengeluaran}</p>
              )}
            </div>

            {/* Dokumentasi Upload */}
            <div>
              <label htmlFor="dokumentasi-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Dokumentasi Kegiatan
                <span className="text-xs text-gray-500 font-normal ml-1">(Per file: Maks 5MB, Total: Maks 8MB)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                <input
                  type="file"
                  onChange={handleDokumentasiChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  multiple
                  className="hidden"
                  id="dokumentasi-upload"
                />
                <label htmlFor="dokumentasi-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-500">
                      {data.dokumentasi.length > 0
                        ? `${data.dokumentasi.length} file selected`
                        : "Multiple Upload"}
                    </span>
                  </div>
                </label>
              </div>
              {errors.dokumentasi && (
                <p className="text-red-500 text-xs mt-1">{errors.dokumentasi}</p>
              )}
            </div>

            {/* Catatan */}
            <div className="md:col-span-2">
              <label htmlFor="ringkasan" className="block text-sm font-medium text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                id="ringkasan"
                value={data.ringkasan}
                onChange={e => setData('ringkasan', e.target.value)}
                rows={4}
                placeholder="Masukkan catatan atau ringkasan kegiatan..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.ringkasan && (
                <p className="text-red-500 text-xs mt-1">{errors.ringkasan}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-6">
            <button
              type="button"
              onClick={() => router.visit('/laporan-kegiatan')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-[#0B132B] text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan')}
            </button>
          </div>
        </form>

        {/* FOOTER */}
        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
