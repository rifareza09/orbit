import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";
import { Search, FileDown, Calendar } from "lucide-react";

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
}: Props) {
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F6FA]">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#0B132B] mb-6">Evaluasi & Laporan</h2>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200 shadow-sm">
              <div className="text-sm font-semibold text-cyan-700 mb-2 uppercase tracking-wide">
                Kegiatan Terdaftar
              </div>
              <div className="text-4xl font-bold text-[#0B132B]">
                {statistik.kegiatan_terdaftar}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 shadow-sm">
              <div className="text-sm font-semibold text-amber-700 mb-2 uppercase tracking-wide">
                Laporan Masuk
              </div>
              <div className="text-4xl font-bold text-[#0B132B]">
                {statistik.laporan_masuk}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 shadow-sm">
              <div className="text-sm font-semibold text-yellow-700 mb-2 uppercase tracking-wide">
                Laporan Direview
              </div>
              <div className="text-4xl font-bold text-[#0B132B]">
                {statistik.laporan_direview}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
              <div className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wide">
                Laporan Selesai
              </div>
              <div className="text-4xl font-bold text-[#0B132B]">
                {statistik.laporan_selesai}
              </div>
            </div>
          </div>

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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter Ormawa
                </label>
                <select
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
                  {laporanKegiatan.length > 0 ? (
                    laporanKegiatan.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-[#0B132B]">{item.nama_kegiatan}</td>
                        <td className="px-4 py-3 text-gray-700">{item.ormawa}</td>
                        <td className="px-4 py-3 text-gray-700">{item.jenis}</td>
                        <td className="px-4 py-3 text-gray-700">{item.tanggal_pelaksanaan}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                            item.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                            item.status === 'Direview' ? 'bg-blue-100 text-blue-700' :
                            item.status === 'Direvisi' ? 'bg-orange-100 text-orange-700' :
                            item.status === 'Diajukan' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status === 'Menunggu Review' ? 'Menunggu Review' : item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            href={`/evaluasi-laporan/detail/${item.id}`}
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
      </div>
    </DashboardLayout>
  );
}
