import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { Archive, Calendar, User, FileText, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface ArsipDetail {
  id: number;
  nama_ormawa: string;
  tahun_arsip: number;
  tanggal_reset: string;
  reset_by: string;
  catatan: string | null;
  data_program_kerja: any[];
  data_pengajuan_kegiatan: any[];
  data_laporan_kegiatan: any[];
}

interface Props {
  arsip: ArsipDetail;
}

export default function ArsipTahunanDetail({ arsip }: Props) {
  const [expandedSection, setExpandedSection] = useState<'programKerja' | 'pengajuan' | 'laporan' | null>('programKerja');

  const toggleSection = (section: 'programKerja' | 'pengajuan' | 'laporan') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <DashboardLayout>
      <Head title={`Arsip ${arsip.nama_ormawa} ${arsip.tahun_arsip}`} />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/puskaka/arsip-tahunan"
            className="inline-flex items-center gap-2 text-[#0B132B] hover:underline mb-4"
          >
            <ChevronLeft size={20} />
            Kembali ke Daftar Arsip
          </Link>

          <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Archive size={32} />
                  <h1 className="text-3xl font-bold">{arsip.nama_ormawa}</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Tahun Arsip: {arsip.tahun_arsip}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Tanggal Reset: {arsip.tanggal_reset}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Reset Oleh: {arsip.reset_by}</span>
                  </div>
                </div>
                {arsip.catatan && (
                  <div className="mt-4 bg-white/10 rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-semibold">Catatan:</span> {arsip.catatan}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Program Kerja</p>
                <p className="text-3xl font-bold text-[#0B132B]">{arsip.data_program_kerja.length}</p>
                <p className="text-xs text-gray-500 mt-1">Item diarsipkan</p>
              </div>
              <FileText className="text-blue-500 opacity-20" size={48} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pengajuan Kegiatan</p>
                <p className="text-3xl font-bold text-[#0B132B]">{arsip.data_pengajuan_kegiatan.length}</p>
                <p className="text-xs text-gray-500 mt-1">Item diarsipkan</p>
              </div>
              <FileText className="text-green-500 opacity-20" size={48} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Laporan Kegiatan</p>
                <p className="text-3xl font-bold text-[#0B132B]">{arsip.data_laporan_kegiatan.length}</p>
                <p className="text-xs text-gray-500 mt-1">Item diarsipkan</p>
              </div>
              <FileText className="text-orange-500 opacity-20" size={48} />
            </div>
          </div>
        </div>

        {/* Program Kerja */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <button
            onClick={() => toggleSection('programKerja')}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-[#0B132B]">
                Program Kerja ({arsip.data_program_kerja.length})
              </h2>
            </div>
            {expandedSection === 'programKerja' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          
          {expandedSection === 'programKerja' && (
            <div className="border-t border-gray-200">
              {arsip.data_program_kerja.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {arsip.data_program_kerja.map((pk, idx) => (
                    <div key={idx} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-[#0B132B] mb-1">{pk.program_kerja}</h3>
                          <p className="text-sm text-gray-600">{pk.kegiatan}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          pk.status === 'Diajukan' ? 'bg-yellow-100 text-yellow-700' :
                          pk.status === 'Direvisi' ? 'bg-orange-100 text-orange-700' :
                          pk.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {pk.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Estimasi Anggaran:</span>
                          <span className="font-semibold text-[#0B132B] ml-2">
                            {formatCurrency(pk.estimasi_anggaran)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Dibuat:</span>
                          <span className="font-semibold text-[#0B132B] ml-2">{pk.created_at}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <p>Tidak ada program kerja yang diarsipkan</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pengajuan Kegiatan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <button
            onClick={() => toggleSection('pengajuan')}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-green-500" size={24} />
              <h2 className="text-xl font-bold text-[#0B132B]">
                Pengajuan Kegiatan ({arsip.data_pengajuan_kegiatan.length})
              </h2>
            </div>
            {expandedSection === 'pengajuan' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          
          {expandedSection === 'pengajuan' && (
            <div className="border-t border-gray-200">
              {arsip.data_pengajuan_kegiatan.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {arsip.data_pengajuan_kegiatan.map((pengajuan, idx) => (
                    <div key={idx} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-[#0B132B] mb-1">{pengajuan.nama_kegiatan}</h3>
                          <p className="text-sm text-gray-600">{pengajuan.deskripsi}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          pengajuan.status === 'Diajukan' ? 'bg-yellow-100 text-yellow-700' :
                          pengajuan.status === 'Direvisi' ? 'bg-orange-100 text-orange-700' :
                          pengajuan.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {pengajuan.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Ketua:</span>
                          <p className="font-semibold text-[#0B132B]">{pengajuan.ketua_pelaksana}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Tempat:</span>
                          <p className="font-semibold text-[#0B132B]">{pengajuan.tempat_pelaksanaan}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Tanggal:</span>
                          <p className="font-semibold text-[#0B132B]">{pengajuan.tanggal_pelaksanaan}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Peserta:</span>
                          <p className="font-semibold text-[#0B132B]">{pengajuan.jumlah_peserta} orang</p>
                        </div>
                      </div>
                      {pengajuan.item_pengajuan_dana && pengajuan.item_pengajuan_dana.length > 0 && (
                        <div className="mt-3 bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Item Pengajuan Dana ({pengajuan.item_pengajuan_dana.length})
                          </p>
                          <div className="space-y-1 text-xs">
                            {pengajuan.item_pengajuan_dana.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between">
                                <span>{item.nama_item} ({item.quantity}x)</span>
                                <span className="font-semibold">{formatCurrency(item.harga_satuan * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <p>Tidak ada pengajuan kegiatan yang diarsipkan</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Laporan Kegiatan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <button
            onClick={() => toggleSection('laporan')}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-orange-500" size={24} />
              <h2 className="text-xl font-bold text-[#0B132B]">
                Laporan Kegiatan ({arsip.data_laporan_kegiatan.length})
              </h2>
            </div>
            {expandedSection === 'laporan' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          
          {expandedSection === 'laporan' && (
            <div className="border-t border-gray-200">
              {arsip.data_laporan_kegiatan.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {arsip.data_laporan_kegiatan.map((laporan, idx) => (
                    <div key={idx} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-[#0B132B] mb-1">{laporan.nama_kegiatan}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Ringkasan:</span> {laporan.ringkasan}
                          </p>
                          {laporan.catatan && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Catatan:</span> {laporan.catatan}
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          laporan.status === 'Diajukan' ? 'bg-yellow-100 text-yellow-700' :
                          laporan.status === 'Direvisi' ? 'bg-orange-100 text-orange-700' :
                          laporan.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {laporan.status}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Dibuat:</span>
                        <span className="font-semibold text-[#0B132B] ml-2">{laporan.created_at}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <p>Tidak ada laporan kegiatan yang diarsipkan</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
