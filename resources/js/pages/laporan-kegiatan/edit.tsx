import React, { useState, FormEvent } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { router, usePage } from '@inertiajs/react';
import { Upload, Trash2, FileText, Image } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface LaporanItem {
  id: number;
  pengajuan_kegiatan_id: number;
  ringkasan: string;
  catatan: string;
  lpj_file: string | null;
  bukti_pengeluaran: string[];
  dokumentasi: string[];
}

interface PengajuanKegiatan {
  id: number;
  nama_kegiatan: string;
  ketua_pelaksana: string;
  tempat_pelaksanaan: string;
  tanggal_pelaksanaan: string;
  jumlah_peserta: number;
  anggaran_yang_disetujui: number;
}

export default function EditLaporan() {
  const { laporan, pengajuan } = usePage<{
    laporan: LaporanItem;
    pengajuan: PengajuanKegiatan;
  }>().props;

  const [formData, setFormData] = useState({
    ringkasan: laporan.ringkasan || '',
    catatan: laporan.catatan || '',
    anggaran_realisasi: pengajuan.anggaran_yang_disetujui,
    lpjFile: null as File | null,
    buktiPengeluaran: [] as File[],
    dokumentasi: [] as File[],
    buktiPengeluaranHapus: [] as string[],
    dokumentasiHapus: [] as string[],
  });

  const [buktiPreviews, setBuktiPreviews] = useState<string[]>([]);
  const [dokPreviews, setDokPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'anggaran_realisasi' ? (value ? parseInt(value) : 0) : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'lpj' | 'bukti' | 'dokumentasi'
  ) => {
    const files = Array.from(e.target.files || []);
    if (type === 'lpj' && files.length > 0) {
      setFormData((prev) => ({ ...prev, lpjFile: files[0] }));
    } else if (type === 'bukti') {
      setFormData((prev) => ({
        ...prev,
        buktiPengeluaran: [...prev.buktiPengeluaran, ...files],
      }));
      setBuktiPreviews([...buktiPreviews, ...files.map((f) => URL.createObjectURL(f))]);
    } else if (type === 'dokumentasi') {
      setFormData((prev) => ({
        ...prev,
        dokumentasi: [...prev.dokumentasi, ...files],
      }));
      setDokPreviews([...dokPreviews, ...files.map((f) => URL.createObjectURL(f))]);
    }
    e.target.value = '';
  };

  const removeNewFile = (
    type: 'lpj' | 'bukti' | 'dokumentasi',
    index: number
  ) => {
    if (type === 'lpj') {
      setFormData((prev) => ({ ...prev, lpjFile: null }));
    } else if (type === 'bukti') {
      setFormData((prev) => ({
        ...prev,
        buktiPengeluaran: prev.buktiPengeluaran.filter((_, i) => i !== index),
      }));
      setBuktiPreviews(buktiPreviews.filter((_, i) => i !== index));
    } else {
      setFormData((prev) => ({
        ...prev,
        dokumentasi: prev.dokumentasi.filter((_, i) => i !== index),
      }));
      setDokPreviews(dokPreviews.filter((_, i) => i !== index));
    }
  };

  const toggleDeleteExistingFile = (
    type: 'bukti' | 'dokumentasi',
    filename: string
  ) => {
    const key = type === 'bukti' ? 'buktiPengeluaranHapus' : 'dokumentasiHapus';
    setFormData((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(filename)
          ? list.filter((f) => f !== filename)
          : [...list, filename],
      };
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append('_method', 'PUT');
    form.append('ringkasan', formData.ringkasan);
    form.append('catatan', formData.catatan);
    form.append('anggaran_realisasi', formData.anggaran_realisasi.toString());

    if (formData.lpjFile) {
      form.append('lpj', formData.lpjFile);
    }

    formData.buktiPengeluaran.forEach((file) => {
      form.append('bukti_pengeluaran[]', file);
    });

    formData.dokumentasi.forEach((file) => {
      form.append('dokumentasi[]', file);
    });

    formData.buktiPengeluaranHapus.forEach((file) => {
      form.append('remove_bukti[]', file);
    });

    formData.dokumentasiHapus.forEach((file) => {
      form.append('remove_dokumentasi[]', file);
    });

    router.post(`/laporan-kegiatan/update/${laporan.id}`, form, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-10 bg-[#F5F6FA]">
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-[#0B132B] mb-6">
          Laporan Kegiatan
        </h1>

        {/* CARD */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border">
          {/* HEADER DARK */}
          <div className="bg-[#0B132B] text-white px-6 py-3">
            <h2 className="text-lg font-semibold">
              Edit Laporan Kegiatan
            </h2>
          </div>

          {/* FORM CONTENT */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Info Kegiatan (Read-only) */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#0B132B] mb-6">
                Informasi Kegiatan
              </h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <p className="font-semibold text-sm mb-1">Nama Kegiatan</p>
                  <input
                    type="text"
                    value={pengajuan.nama_kegiatan}
                    className="w-full p-2 rounded-md border border-gray-300 bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Ketua Pelaksana</p>
                  <input
                    type="text"
                    value={pengajuan.ketua_pelaksana}
                    className="w-full p-2 rounded-md border border-gray-300 bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Tempat Pelaksanaan</p>
                  <input
                    type="text"
                    value={pengajuan.tempat_pelaksanaan}
                    className="w-full p-2 rounded-md border border-gray-300 bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Tanggal Pelaksanaan</p>
                  <input
                    type="text"
                    value={new Date(pengajuan.tanggal_pelaksanaan).toLocaleDateString('id-ID')}
                    className="w-full p-2 rounded-md border border-gray-300 bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Jumlah Peserta</p>
                  <input
                    type="text"
                    value={`${pengajuan.jumlah_peserta} orang`}
                    className="w-full p-2 rounded-md border border-gray-300 bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Anggaran Disetujui</p>
                  <input
                    type="text"
                    value={formatCurrency(pengajuan.anggaran_yang_disetujui)}
                    className="w-full p-2 rounded-md border border-gray-300 bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Dana Digunakan (Editable) */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#0B132B] mb-6">
                Realisasi Anggaran
              </h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <p className="font-semibold text-sm mb-1">Dana Digunakan*</p>
                  <input
                    type="number"
                    name="anggaran_realisasi"
                    value={formData.anggaran_realisasi}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-gray-300"
                    required
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(formData.anggaran_realisasi)}
                  </p>
                </div>
              </div>
            </div>

            {/* LPJ Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#0B132B] mb-6">
                Laporan Pertanggung Jawaban (LPJ)
              </h3>

              {laporan.lpj_file && (
                <div className="mb-4 rounded bg-blue-50 border border-blue-200 p-4">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    File Saat Ini:
                  </p>
                  <a
                    href={`/storage/${laporan.lpj_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Lihat LPJ
                  </a>
                </div>
              )}

              <div>
                <p className="font-semibold text-sm mb-3">Upload LPJ Baru (PDF/DOC/DOCX)</p>
                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-[#0B132B] hover:bg-blue-50 cursor-pointer transition">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'lpj')}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="font-medium text-gray-700">Klik atau drag & drop</p>
                    <p className="text-sm text-gray-500">Dokumen LPJ</p>
                  </div>
                </label>
                {formData.lpjFile && (
                  <div className="mt-4 flex items-center justify-between rounded bg-blue-50 border border-blue-200 p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{formData.lpjFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewFile('lpj', 0)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bukti Pengeluaran */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#0B132B] mb-6">
                Bukti Pengeluaran (Nota/Kwitansi)
              </h3>

              {laporan.bukti_pengeluaran.length > 0 && (
                <div className="mb-6">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    File Saat Ini:
                  </p>
                  <div className="space-y-2">
                    {laporan.bukti_pengeluaran.map((filename) => {
                      const isMarked = formData.buktiPengeluaranHapus.includes(filename);
                      return (
                        <label
                          key={filename}
                          className={`flex items-center gap-3 rounded-lg p-4 border cursor-pointer transition ${
                            isMarked
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isMarked}
                            onChange={() =>
                              toggleDeleteExistingFile('bukti', filename)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-red-600"
                          />
                          <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <a
                            href={`/storage/bukti-pengeluaran/${filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-sm text-blue-600 hover:text-blue-700 truncate"
                          >
                            {filename}
                          </a>
                          {isMarked && (
                            <span className="text-xs font-medium text-red-600">
                              Akan Dihapus
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Centang untuk menghapus file
                  </p>
                </div>
              )}

              <div>
                <p className="font-semibold text-sm mb-3">Upload Bukti Baru</p>
                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-[#0B132B] hover:bg-blue-50 cursor-pointer transition">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'bukti')}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="font-medium text-gray-700">Klik atau drag & drop</p>
                    <p className="text-sm text-gray-500">Foto atau dokumen bukti pengeluaran</p>
                  </div>
                </label>
                {formData.buktiPengeluaran.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.buktiPengeluaran.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg bg-blue-50 border border-blue-200 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewFile('bukti', idx)}
                          className="text-red-600 hover:text-red-700 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dokumentasi */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#0B132B] mb-6">
                Dokumentasi Kegiatan
              </h3>

              {laporan.dokumentasi.length > 0 && (
                <div className="mb-6">
                  <p className="mb-4 text-sm font-medium text-gray-700">
                    Foto Saat Ini:
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    {laporan.dokumentasi.map((filename) => {
                      const isMarked = formData.dokumentasiHapus.includes(filename);
                      return (
                        <div
                          key={filename}
                          className="relative group rounded-lg overflow-hidden"
                        >
                          <img
                            src={`/storage/dokumentasi/${filename}`}
                            alt="dokumentasi"
                            className={`h-32 w-full object-cover transition ${
                              isMarked ? 'opacity-50' : ''
                            }`}
                          />
                          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 cursor-pointer transition">
                            <input
                              type="checkbox"
                              checked={isMarked}
                              onChange={() =>
                                toggleDeleteExistingFile('dokumentasi', filename)
                              }
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </label>
                          {isMarked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-75 rounded-lg">
                              <span className="text-sm font-medium text-white">
                                Akan Dihapus
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Centang untuk menghapus foto
                  </p>
                </div>
              )}

              <div>
                <p className="font-semibold text-sm mb-3">Upload Foto Baru</p>
                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-[#0B132B] hover:bg-blue-50 cursor-pointer transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'dokumentasi')}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Image className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="font-medium text-gray-700">Klik atau drag & drop</p>
                    <p className="text-sm text-gray-500">Foto dokumentasi kegiatan</p>
                  </div>
                </label>
                {formData.dokumentasi.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {formData.dokumentasi.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-lg overflow-hidden"
                      >
                        <img
                          src={dokPreviews[idx]}
                          alt={`preview-${idx}`}
                          className="h-32 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewFile('dokumentasi', idx)}
                          className="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ringkasan & Catatan */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#0B132B] mb-6">
                Laporan Tertulis
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-sm mb-1">
                    Ringkasan Pelaksanaan Kegiatan*
                  </p>
                  <textarea
                    name="ringkasan"
                    value={formData.ringkasan}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full p-2 rounded-md border border-gray-300"
                    placeholder="Jelaskan ringkasan pelaksanaan kegiatan, pencapaian, dan hasil yang diperoleh..."
                    required
                  />
                </div>

                <div>
                  <p className="font-semibold text-sm mb-1">Catatan Tambahan</p>
                  <textarea
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 rounded-md border border-gray-300"
                    placeholder="Catatan tambahan atau informasi lainnya (opsional)..."
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-gray-500 text-white px-8 py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0B132B] text-white px-8 py-2 rounded-lg hover:bg-[#1C2541] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Laporan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
