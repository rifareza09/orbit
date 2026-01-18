import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";
import { Search, FileDown } from "lucide-react";

interface LaporanKegiatan {
  id: number;
  nama_kegiatan: string;
  ormawa: string;
  jenis: string;
  tanggal_pelaksanaan: string;
  status: string;
  anggaran_disetujui: number;
  anggaran_realisasi: number;
  created_at: string;
}

interface Statistik {
  kegiatan_terdaftar: number;
  laporan_masuk: number;
  laporan_direview: number;
  laporan_selesai: number;
}

interface Filters {
  tahun_akademik: string | null;
  ormawa: string | null;
  search: string | null;
}

interface Props {
  laporanKegiatan: LaporanKegiatan[];
  statistik: Statistik;
  filters: Filters;
  ormawaList: string[];
  tahunList: number[];
}

export default function EvaluasiLaporanIndex({
  laporanKegiatan = [],
  statistik,
  filters,
  ormawaList = [],
  tahunList = []
}: Readonly<Props>) {
  const [tahunFilter, setTahunFilter] = useState(filters.tahun_akademik || '');
  const [ormawaFilter, setOrmawaFilter] = useState(filters.ormawa || '');
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  const handleFilter = () => {
    router.get('/evaluasi-laporan', {
      tahun_akademik: tahunFilter || undefined,
      ormawa: ormawaFilter || undefined,
      search: searchQuery || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleReset = () => {
    setTahunFilter('');
    setOrmawaFilter('');
    setSearchQuery('');
    router.get('/evaluasi-laporan');
  };

  const handleExport = () => {
    // Build query params from current filters
    const params = new URLSearchParams();
    if (tahunFilter) params.append('tahun_akademik', tahunFilter);
    if (ormawaFilter) params.append('ormawa', ormawaFilter);
    if (searchQuery) params.append('search', searchQuery);

    const queryString = params.toString();
    const exportUrl = '/evaluasi-laporan/export' + (queryString ? '?' + queryString : '');

    // Trigger download
    globalThis.location.href = exportUrl;
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Selesai':
        return 'bg-gradient-to-r from-purple-400 to-violet-500 text-white shadow-purple-500/25';
      case 'Disetujui':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/25';
      case 'Direview':
        return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-blue-500/25';
      case 'Direvisi':
        return 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-orange-500/25';
      case 'Diajukan':
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-amber-500/25';
      default:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B132B] to-[#1C2541] bg-clip-text text-transparent">
            Evaluasi & Laporan
          </h1>
          <p className="text-gray-500 mt-1">Kelola dan evaluasi laporan kegiatan dari semua ORMAWA</p>
        </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-cyan-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">📊</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-cyan-600 mb-1 uppercase tracking-wide">
                    Kegiatan Terdaftar
                  </div>
                  <div className="text-3xl font-bold text-[#0B132B]">
                    {statistik.kegiatan_terdaftar}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">📄</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wide">
                    Laporan Masuk
                  </div>
                  <div className="text-3xl font-bold text-[#0B132B]">
                    {statistik.laporan_masuk}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">👀</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-yellow-600 mb-1 uppercase tracking-wide">
                    Laporan Direview
                  </div>
                  <div className="text-3xl font-bold text-[#0B132B]">
                    {statistik.laporan_direview}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">✅</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">
                    Laporan Selesai
                  </div>
                  <div className="text-3xl font-bold text-[#0B132B]">
                    {statistik.laporan_selesai}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Filter Tahun Akademik */}
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="tahun-filter" className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter Tahun Akademik
                </label>
                <select
                  id="tahun-filter"
                  value={tahunFilter}
                  onChange={(e) => setTahunFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent bg-white"
                >
                  <option value="">Semua Tahun</option>
                  {tahunList.map(tahun => (
                    <option key={tahun} value={tahun}>{tahun}</option>
                  ))}
                </select>
              </div>

              {/* Filter Ormawa */}
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="ormawa-filter" className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter Ormawa
                </label>
                <select
                  id="ormawa-filter"
                  value={ormawaFilter}
                  onChange={(e) => setOrmawaFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent bg-white"
                >
                  <option value="">Semua Ormawa</option>
                  {ormawaList.map(ormawa => (
                    <option key={ormawa} value={ormawa}>{ormawa}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <label htmlFor="search-input" className="block text-sm font-semibold text-gray-700 mb-2">
                  Cari nama kegiatan
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                    placeholder="Ketik nama kegiatan..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleFilter}
                  className="px-6 py-2.5 bg-[#0B132B] hover:bg-[#1C2541] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  Filter
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleExport}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
                >
                  <FileDown size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-[#0B132B] to-[#1C2541]">
                    <th className="px-5 py-4 text-white font-semibold w-12">No.</th>
                    <th className="px-5 py-4 text-white font-semibold">Nama Kegiatan</th>
                    <th className="px-5 py-4 text-white font-semibold">Ormawa</th>
                    <th className="px-5 py-4 text-white font-semibold">Jenis</th>
                    <th className="px-5 py-4 text-white font-semibold">Tanggal Pelaksanaan</th>
                    <th className="px-5 py-4 text-white font-semibold">Status</th>
                    <th className="px-5 py-4 text-white font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {laporanKegiatan.length > 0 ? (
                    laporanKegiatan.map((item, index) => (
                      <tr key={item.id} className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                        <td className="px-5 py-4 font-medium text-gray-600">{index + 1}</td>
                        <td className="px-5 py-4 font-medium text-[#0B132B]">{item.nama_kegiatan}</td>
                        <td className="px-5 py-4 text-gray-700">{item.ormawa}</td>
                        <td className="px-5 py-4 text-gray-700">{item.jenis}</td>
                        <td className="px-5 py-4 text-gray-700">{item.tanggal_pelaksanaan}</td>
                        <td className="px-5 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <Link
                            href={`/evaluasi-laporan/detail/${item.id}`}
                            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                          >
                            Lihat Detail
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">
                        {filters.search || filters.ormawa || filters.tahun_akademik
                          ? 'Tidak ada data yang sesuai dengan filter'
                          : 'Belum ada laporan kegiatan'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8">
            ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
          </div>
      </div>
    </DashboardLayout>
  );
}
