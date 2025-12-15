import React, { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { ArrowLeft, Calendar, MapPin, FileText, Image as ImageIcon, Clock, Award } from "lucide-react";

interface Ormawa {
  id: number;
  name: string;
  username: string;
  role: string;
  deskripsi?: string;
}

interface Kegiatan {
  id: number;
  nama_kegiatan: string;
  tanggal_pelaksanaan: string;
  tempat_pelaksanaan: string;
  deskripsi: string;
}

interface JadwalLatihan {
  id: number;
  divisi: string;
  hari: string;
  pukul: string;
  tempat: string;
}

interface Dokumentasi {
  id: number;
  nama_kegiatan: string;
  tanggal_kegiatan: string;
  foto_url: string | null;
}

interface Prestasi {
  id: number;
  nama_prestasi: string;
  jenis_prestasi: string;
  tingkat_kejuaraan: string;
  nama_peraih: string;
  tanggal_perolehan: string;
  bukti_path: string | null;
}

interface Props {
  ormawa: Ormawa;
  kegiatan: Kegiatan[];
  jadwalLatihan: JadwalLatihan[];
  dokumentasi: Dokumentasi[];
  prestasi: Prestasi[];
}

export default function OrmawaDetail({ ormawa, kegiatan = [], jadwalLatihan = [], dokumentasi = [], prestasi = [] }: Props) {
  const [activeTab, setActiveTab] = useState<"kegiatan" | "jadwal" | "dokumentasi" | "prestasi">("kegiatan");

  return (
    <>
      <Head title={`${ormawa.name} - ORBIT`} />

      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-[#0B132B] text-white py-4 px-6 md:px-12 flex items-center gap-4 sticky top-0 z-50 shadow-md">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
          <img src="/images/Logo.png" alt="Logo ORBIT" className="w-35 h-8 ml-4" />
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{ormawa.name}</h1>
            <p className="text-gray-300 text-lg capitalize mb-3">{ormawa.role}</p>
            {ormawa.deskripsi && (
              <p className="text-gray-200 text-base max-w-2xl">{ormawa.deskripsi}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b sticky top-16 z-40">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("kegiatan")}
                className={`py-4 px-2 font-semibold border-b-2 transition ${
                  activeTab === "kegiatan"
                    ? "border-[#0B132B] text-[#0B132B]"
                    : "border-transparent text-gray-600 hover:text-[#0B132B]"
                }`}
              >
                Kegiatan ({kegiatan.length})
              </button>
              <button
                onClick={() => setActiveTab("jadwal")}
                className={`py-4 px-2 font-semibold border-b-2 transition ${
                  activeTab === "jadwal"
                    ? "border-[#0B132B] text-[#0B132B]"
                    : "border-transparent text-gray-600 hover:text-[#0B132B]"
                }`}
              >
                Jadwal Latihan ({jadwalLatihan.length})
              </button>
              <button
                onClick={() => setActiveTab("dokumentasi")}
                className={`py-4 px-2 font-semibold border-b-2 transition ${
                  activeTab === "dokumentasi"
                    ? "border-[#0B132B] text-[#0B132B]"
                    : "border-transparent text-gray-600 hover:text-[#0B132B]"
                }`}
              >
                Dokumentasi ({dokumentasi.length})
              </button>
              <button
                onClick={() => setActiveTab("prestasi")}
                className={`py-4 px-2 font-semibold border-b-2 transition ${
                  activeTab === "prestasi"
                    ? "border-[#0B132B] text-[#0B132B]"
                    : "border-transparent text-gray-600 hover:text-[#0B132B]"
                }`}
              >
                Prestasi ({prestasi.length})
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
          {/* Tab: Kegiatan */}
          {activeTab === "kegiatan" && (
            <div className="space-y-6">
              {kegiatan.length > 0 ? (
                kegiatan.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#0B132B] mb-2">{item.nama_kegiatan}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-[#0B132B]" />
                            {item.tanggal_pelaksanaan}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-[#0B132B]" />
                            {item.tempat_pelaksanaan}
                          </div>
                        </div>
                      </div>
                    </div>
                    {item.deskripsi && (
                      <p className="text-gray-700 leading-relaxed">{item.deskripsi}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Tidak ada kegiatan yang disetujui</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Jadwal Latihan */}
          {activeTab === "jadwal" && (
            <div>
              {jadwalLatihan.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jadwalLatihan.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#0B132B] text-white rounded-lg p-4 text-center min-w-[80px]">
                          <p className="text-xs font-semibold text-gray-300 mb-1">HARI</p>
                          <p className="text-lg font-bold capitalize">{item.hari.slice(0, 3)}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#0B132B] mb-2">{item.divisi}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Clock size={16} className="text-[#0B132B]" />
                            <span className="font-semibold">{item.pukul}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={16} className="text-[#0B132B]" />
                            <span>{item.tempat}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Tidak ada jadwal latihan</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Dokumentasi */}
          {activeTab === "dokumentasi" && (
            <div>
              {dokumentasi.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dokumentasi.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-200 group">
                      <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                        {item.foto_url ? (
                          <img
                            src={item.foto_url}
                            alt={item.nama_kegiatan}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <ImageIcon size={48} className="text-gray-400" />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-[#0B132B] mb-2 line-clamp-2">{item.nama_kegiatan}</h4>
                        <p className="text-sm text-gray-600">{item.tanggal_kegiatan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Tidak ada dokumentasi</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Prestasi */}
          {activeTab === "prestasi" && (
            <div className="space-y-6">
              {prestasi.length > 0 ? (
                prestasi.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-200">
                    <div className="flex items-start gap-4 mb-4">
                      <Award size={32} className="text-[#0B132B] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#0B132B] mb-2">{item.nama_prestasi}</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Jenis Prestasi</p>
                            <p className="text-gray-700">{item.jenis_prestasi}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Tingkat Kejuaraan</p>
                            <p className="text-gray-700">{item.tingkat_kejuaraan}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Nama Peraih</p>
                            <p className="text-gray-700">{item.nama_peraih}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                            <Calendar size={16} className="text-[#0B132B]" />
                            <span className="font-semibold">{item.tanggal_perolehan}</span>
                          </div>
                        </div>
                      </div>
                      {item.bukti_path && (
                        <a
                          href={item.bukti_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 inline-flex items-center gap-2 bg-[#0B132B] text-white px-4 py-2 rounded-lg hover:bg-[#1C2541] transition text-sm font-semibold"
                        >
                          <FileText size={16} />
                          Lihat Bukti
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <Award size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Tidak ada prestasi</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-[#0B132B] text-white py-8 text-center text-sm mt-12">
          <p className="opacity-80 mb-2">© 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI</p>
          <p className="text-xs opacity-60">ORBIT - Ormawa Berbasis Informasi Terpadu</p>
        </footer>
      </div>
    </>
  );
}
