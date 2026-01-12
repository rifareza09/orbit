import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";
import { Search, Calendar, FileDown, Eye, Building2, ClipboardList, Filter, RotateCcw, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

interface PengajuanKegiatan {
  id: number;
  nama_kegiatan: string;
  ormawa: string;
  jenis: string;
  program_kerja: string;
  ketua_pelaksana: string;
  tanggal_pelaksanaan: string;
  total_anggaran: string;
  status_review: string;
  reviewed_at: string | null;
}

interface Statistik {
  total_pengajuan: number;
  perlu_direview: number;
  disetujui: number;
  ditolak: number;
}

interface Filters {
  tahun_akademik: string | null;
  ormawa: string | null;
  search: string | null;
}

interface Props {
  pengajuanKegiatan: PengajuanKegiatan[];
  statistik: Statistik;
  filters: Filters;
  ormawaList: string[];
  tahunList: number[];
}

export default function ManajemenKegiatanIndex({
  pengajuanKegiatan = [],
  statistik,
  filters,
  ormawaList = [],
  tahunList = []
}: Props) {
  const [tahunFilter, setTahunFilter] = useState(filters.tahun_akademik || '');
  const [ormawaFilter, setOrmawaFilter] = useState(filters.ormawa || '');
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  const handleFilter = () => {
    router.get('/manajemen-kegiatan', {
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
    router.get('/manajemen-kegiatan');
  };

  const handleExport = () => {
    alert('Fitur export akan segera tersedia');
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Disetujui':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/25';
      case 'Ditolak':
        return 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-red-500/25';
      case 'Direview':
        return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-blue-500/25';
      case 'Direvisi':
        return 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-orange-500/25';
      default:
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-amber-500/25';
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B132B] to-[#1C2541] bg-clip-text text-transparent">
              Manajemen Kegiatan
            </h1>
            <p className="text-gray-500 mt-1">Review dan kelola pengajuan kegiatan dari Ormawa</p>
          </div>

          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                  {/* Filter Tahun Akademik */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter Tahun Akademik
                    </label>
                    <select
                      value={tahunFilter}
                      onChange={(e) => setTahunFilter(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-800 hover:border-gray-300 transition-colors"
                    >
                      <option value="">Semua Tahun</option>
                      {tahunList.map(tahun => (
                        <option key={tahun} value={tahun}>{tahun}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Ormawa */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter Ormawa
                    </label>
                    <select
                      value={ormawaFilter}
                      onChange={(e) => setOrmawaFilter(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-800 hover:border-gray-300 transition-colors"
                    >
                      <option value="">Semua Ormawa</option>
                      {ormawaList.map(ormawa => (
                        <option key={ormawa} value={ormawa}>{ormawa}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search */}
                  <div className="flex-1 min-w-[250px]">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cari nama kegiatan
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                        placeholder="Ketik nama kegiatan..."
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-800 placeholder-gray-400 hover:border-gray-300 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleFilter}
                      className="group px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                      <Filter size={16} className="group-hover:rotate-12 transition-transform" />
                      Filter
                    </button>
                    <button
                      onClick={handleReset}
                      className="group px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 border border-gray-200"
                    >
                      <RotateCcw size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#0B132B] to-[#1C2541]">
                        <th className="px-4 py-4 text-left text-white font-semibold w-12">No.</th>
                        <th className="px-4 py-4 text-left text-white font-semibold">Nama Kegiatan</th>
                        <th className="px-4 py-4 text-left text-white font-semibold">Ormawa</th>
                        <th className="px-4 py-4 text-left text-white font-semibold">Jenis</th>
                        <th className="px-4 py-4 text-left text-white font-semibold">Tanggal</th>
                        <th className="px-4 py-4 text-left text-white font-semibold">Status</th>
                        <th className="px-4 py-4 text-center text-white font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pengajuanKegiatan.length > 0 ? (
                        pengajuanKegiatan.map((item, index) => (
                          <tr key={item.id} className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                            <td className="px-4 py-4 text-gray-600 font-medium">{index + 1}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                  <ClipboardList size={18} className="text-white" />
                                </div>
                                <span className="font-semibold text-gray-800">{item.nama_kegiatan}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Building2 size={16} className="text-gray-400" />
                                {item.ormawa}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                {item.jenis}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar size={16} className="text-gray-400" />
                                {item.tanggal_pelaksanaan}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusStyle(item.status_review)}`}>
                                {item.status_review === 'Direview' ? 'Review' :
                                 item.status_review === 'Direvisi' ? 'Revisi' :
                                 item.status_review}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <Link
                                href={`/manajemen-kegiatan/detail/${item.id}`}
                                className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                              >
                                <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                                Lihat
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                                <ClipboardList size={32} className="text-gray-400" />
                              </div>
                              <p className="text-gray-500 font-medium">
                                {filters.search || filters.ormawa || filters.tahun_akademik
                                  ? 'Tidak ada data yang sesuai dengan filter'
                                  : 'Belum ada pengajuan kegiatan'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar Statistics */}
            <div className="w-80 space-y-4">
              {/* Statistik Card */}
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white px-5 py-4 font-bold text-sm flex items-center gap-2">
                  <TrendingUp size={18} />
                  Statistik
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 hover:bg-blue-100 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <ClipboardList size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-blue-600 font-semibold">Total Pengajuan</div>
                        <div className="text-2xl font-bold text-gray-800">{statistik.total_pengajuan}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 hover:bg-amber-100 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                        <Clock size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-amber-600 font-semibold">Perlu Direview</div>
                        <div className="text-2xl font-bold text-gray-800">{statistik.perlu_direview}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-100 hover:bg-green-100 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <CheckCircle size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-green-600 font-semibold">Disetujui</div>
                        <div className="text-2xl font-bold text-gray-800">{statistik.disetujui}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-xl p-4 border border-red-100 hover:bg-red-100 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                        <XCircle size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-red-600 font-semibold">Ditolak</div>
                        <div className="text-2xl font-bold text-gray-800">{statistik.ditolak}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleExport}
                className="group w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <FileDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
                Export Data
              </button>

              <button
                onClick={() => alert('Fitur kalender akan segera tersedia')}
                className="group w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-3.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
                Lihat Kalender Kegiatan
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm mt-10 py-6 border-t border-gray-200">
            <p className="text-gray-400">
              © 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
