import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";
import { Search, Calendar, FileDown } from "lucide-react";

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
    // Implement export functionality
    alert('Fitur export akan segera tersedia');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F6FA]">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#0B132B] mb-6">Manajemen Kegiatan</h2>

          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                  {/* Filter Tahun Akademik */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter Tahun Akademik
                    </label>
                    <select
                      value={tahunFilter}
                      onChange={(e) => setTahunFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
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
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                        placeholder="Ketik nama kegiatan..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleFilter}
                      className="px-6 py-2 bg-[#0B132B] hover:bg-[#1C2541] text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Filter
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0B132B] text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold w-12">No.</th>
                        <th className="px-4 py-3 text-left font-semibold">Nama Kegiatan</th>
                        <th className="px-4 py-3 text-left font-semibold">Ormawa</th>
                        <th className="px-4 py-3 text-left font-semibold">Jenis</th>
                        <th className="px-4 py-3 text-left font-semibold">Tanggal Pelaksanaan</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pengajuanKegiatan.length > 0 ? (
                        pengajuanKegiatan.map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                            <td className="px-4 py-3 font-medium text-[#0B132B]">{item.nama_kegiatan}</td>
                            <td className="px-4 py-3 text-gray-700">{item.ormawa}</td>
                            <td className="px-4 py-3 text-gray-700">{item.jenis}</td>
                            <td className="px-4 py-3 text-gray-700">{item.tanggal_pelaksanaan}</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.status_review === 'Disetujui' ? 'bg-green-100 text-green-700' :
                                item.status_review === 'Ditolak' ? 'bg-red-100 text-red-700' :
                                item.status_review === 'Direview' ? 'bg-blue-100 text-blue-700' :
                                item.status_review === 'Direvisi' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {item.status_review === 'Direview' ? 'Review' :
                                 item.status_review === 'Direvisi' ? 'Revisi' :
                                 item.status_review}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Link
                                href={`/manajemen-kegiatan/detail/${item.id}`}
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-semibold transition-colors"
                              >
                                Lihat
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">
                            {filters.search || filters.ormawa || filters.tahun_akademik
                              ? 'Tidak ada data yang sesuai dengan filter'
                              : 'Belum ada pengajuan kegiatan'}
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
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="bg-[#0B132B] text-white px-4 py-3 font-bold text-sm">
                  Statistik
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="text-xs text-blue-600 font-semibold mb-1">Total Pengajuan</div>
                    <div className="text-3xl font-bold text-[#0B132B]">{statistik.total_pengajuan}</div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                    <div className="text-xs text-yellow-600 font-semibold mb-1">Perlu Direview</div>
                    <div className="text-3xl font-bold text-[#0B132B]">{statistik.perlu_direview}</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="text-xs text-green-600 font-semibold mb-1">Disetujui</div>
                    <div className="text-3xl font-bold text-[#0B132B]">{statistik.disetujui}</div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <div className="text-xs text-red-600 font-semibold mb-1">Ditolak</div>
                    <div className="text-3xl font-bold text-[#0B132B]">{statistik.ditolak}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleExport}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <FileDown size={18} />
                Export Data
              </button>

              <button
                onClick={() => alert('Fitur kalender akan segera tersedia')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                Lihat Kalender Kegiatan
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8">
            ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
