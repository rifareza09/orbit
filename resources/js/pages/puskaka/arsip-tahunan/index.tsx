import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Archive, Search, Eye, Trash2, FileText, Calendar, User } from 'lucide-react';

interface Arsip {
  id: number;
  nama_ormawa: string;
  tahun_arsip: number;
  tanggal_reset: string;
  reset_by: string;
  jumlah_program_kerja: number;
  jumlah_pengajuan: number;
  jumlah_laporan: number;
  catatan: string | null;
}

interface Props {
  arsip: {
    data: Arsip[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  ormawaList: Array<{ id: number; name: string }>;
  availableYears: number[];
  filters: {
    ormawa_id?: number;
    tahun?: number;
  };
}

export default function ArsipTahunanIndex({ arsip, ormawaList, availableYears, filters }: Props) {
  const [searchOrmawa, setSearchOrmawa] = useState(filters.ormawa_id?.toString() || '');
  const [searchTahun, setSearchTahun] = useState(filters.tahun?.toString() || '');

  const handleFilter = () => {
    router.get('/puskaka/arsip-tahunan', {
      ormawa_id: searchOrmawa || undefined,
      tahun: searchTahun || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleReset = () => {
    setSearchOrmawa('');
    setSearchTahun('');
    router.get('/puskaka/arsip-tahunan');
  };

  const handleDelete = (id: number, namaOrmawa: string, tahun: number) => {
    if (confirm(`Apakah Anda yakin ingin menghapus arsip ${namaOrmawa} (${tahun})?`)) {
      router.delete(`/puskaka/arsip-tahunan/${id}`, {
        preserveScroll: true,
      });
    }
  };

  return (
    <DashboardLayout>
      <Head title="Arsip Tahunan" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#0B132B] p-3 rounded-lg">
              <Archive className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0B132B]">Arsip Tahunan</h1>
              <p className="text-sm text-gray-600">Data ormawa yang telah direset</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filter Ormawa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Ormawa
              </label>
              <select
                value={searchOrmawa}
                onChange={(e) => setSearchOrmawa(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
              >
                <option value="">Semua Ormawa</option>
                {ormawaList.map((ormawa) => (
                  <option key={ormawa.id} value={ormawa.id}>
                    {ormawa.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Tahun */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Tahun
              </label>
              <select
                value={searchTahun}
                onChange={(e) => setSearchTahun(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
              >
                <option value="">Semua Tahun</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-end gap-2">
              <button
                onClick={handleFilter}
                className="flex-1 bg-[#0B132B] text-white px-4 py-2 rounded-lg hover:bg-[#1C2541] transition flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Filter
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Arsip</p>
                <p className="text-2xl font-bold text-[#0B132B]">{arsip.total}</p>
              </div>
              <Archive className="text-[#0B132B] opacity-20" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Program Kerja</p>
                <p className="text-2xl font-bold text-[#0B132B]">
                  {arsip.data.reduce((sum, item) => sum + item.jumlah_program_kerja, 0)}
                </p>
              </div>
              <FileText className="text-blue-500 opacity-20" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pengajuan</p>
                <p className="text-2xl font-bold text-[#0B132B]">
                  {arsip.data.reduce((sum, item) => sum + item.jumlah_pengajuan, 0)}
                </p>
              </div>
              <FileText className="text-green-500 opacity-20" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Laporan</p>
                <p className="text-2xl font-bold text-[#0B132B]">
                  {arsip.data.reduce((sum, item) => sum + item.jumlah_laporan, 0)}
                </p>
              </div>
              <FileText className="text-orange-500 opacity-20" size={32} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0B132B] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ormawa</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tahun</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal Reset</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Reset Oleh</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Data Diarsipkan</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {arsip.data.length > 0 ? (
                  arsip.data.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm">
                        {(arsip.current_page - 1) * arsip.per_page + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Archive size={16} className="text-[#0B132B]" />
                          <span className="font-medium text-[#0B132B]">{item.nama_ormawa}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {item.tahun_arsip}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.tanggal_reset}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          {item.reset_by}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3 text-sm">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            PK: {item.jumlah_program_kerja}
                          </span>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                            Pgj: {item.jumlah_pengajuan}
                          </span>
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            Lap: {item.jumlah_laporan}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/puskaka/arsip-tahunan/${item.id}`}
                            className="text-blue-600 hover:text-blue-800 transition p-2 hover:bg-blue-50 rounded"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.nama_ormawa, item.tahun_arsip)}
                            className="text-red-600 hover:text-red-800 transition p-2 hover:bg-red-50 rounded"
                            title="Hapus Arsip"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      <Archive size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="text-lg font-medium">Tidak ada arsip</p>
                      <p className="text-sm">Arsip akan muncul setelah reset akun ormawa</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {arsip.last_page > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {(arsip.current_page - 1) * arsip.per_page + 1} - {Math.min(arsip.current_page * arsip.per_page, arsip.total)} dari {arsip.total} arsip
              </p>
              <div className="flex gap-2">
                {Array.from({ length: arsip.last_page }, (_, i) => i + 1).map((page) => (
                  <Link
                    key={page}
                    href={`/puskaka/arsip-tahunan?page=${page}${filters.ormawa_id ? `&ormawa_id=${filters.ormawa_id}` : ''}${filters.tahun ? `&tahun=${filters.tahun}` : ''}`}
                    className={`px-3 py-1 rounded ${
                      page === arsip.current_page
                        ? 'bg-[#0B132B] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
