import React, { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { ArrowLeft, Calendar, MapPin, FileText, Image as ImageIcon, Clock, Award, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

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

interface Kepengurusan {
  id: number;
  jabatan: string;
  nama: string;
  prodi: string;
  npm: string;
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
  kepengurusan: Kepengurusan[];
}

export default function OrmawaDetail({ ormawa, kegiatan = [], jadwalLatihan = [], dokumentasi = [], prestasi = [], kepengurusan = [] }: Props) {
  const [activeTab, setActiveTab] = useState<"kegiatan" | "jadwal" | "dokumentasi" | "prestasi">("kegiatan");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageType, setImageType] = useState<"dokumentasi" | "prestasi">("dokumentasi");

  const dokumentasiWithPhoto = dokumentasi.filter(item => item.foto_url);
  const prestasiWithPhoto = prestasi.filter(item => item.bukti_path);

  const openImageModal = (id: number, type: "dokumentasi" | "prestasi") => {
    const list = type === "dokumentasi" ? dokumentasiWithPhoto : prestasiWithPhoto;
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      setImageType(type);
      setSelectedImageIndex(index);
    }
  };

  const closeImageModal = () => setSelectedImageIndex(null);

  const showPrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const showNextImage = () => {
    const list = imageType === "dokumentasi" ? dokumentasiWithPhoto : prestasiWithPhoto;
    if (selectedImageIndex !== null && selectedImageIndex < list.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const currentList = imageType === "dokumentasi" ? dokumentasiWithPhoto : prestasiWithPhoto;
  const selectedItem = selectedImageIndex !== null ? currentList[selectedImageIndex] : null;

  return (
    <>
      <Head title={`${ormawa.name}`} />

      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-[#0B132B] text-white py-5 px-6 md:px-12 flex items-center gap-4 sticky top-0 z-50 shadow-md">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
          <img src="/images/OrbitWhite.png" alt="Logo ORBIT" className="h-12 w-auto object-contain ml-4" />
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{ormawa.name}</h1>
            <p className="text-gray-300 text-lg capitalize mb-3">{ormawa.role.toUpperCase()}</p>
          </div>
        </div>

        {/* Deskripsi & Struktur Kepengurusan */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 space-y-8">
          {/* Deskripsi */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="bg-[#0B132B] p-2 rounded-lg">
                <FileText size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B132B]">Deskripsi Organisasi</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">
              {ormawa.deskripsi || 'Organisasi mahasiswa yang aktif mengadakan kegiatan.'}
            </p>
          </div>

          {/* Struktur Kepengurusan */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Struktur Kepengurusan</h2>
              </div>
            </div>

            {kepengurusan.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kepengurusan.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-[#0B132B]/30 transition-all duration-300"
                    >
                      {/* Jabatan Badge */}
                      <div className="bg-[#0B132B] text-white px-3 py-1.5 rounded-md inline-block text-sm font-semibold mb-3">
                        {item.jabatan}
                      </div>

                      {/* Nama */}
                      <h3 className="text-lg font-bold text-[#0B132B] mb-2 line-clamp-2">
                        {item.nama}
                      </h3>

                      {/* Prodi */}
                      <div className="flex items-start gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mt-0.5 flex-shrink-0">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.prodi}</p>
                      </div>

                      {/* NPM */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <line x1="19" x2="19" y1="8" y2="14"></line>
                          <line x1="22" x2="16" y1="11" y2="11"></line>
                        </svg>
                        <p className="text-sm font-mono text-gray-700 font-medium">{item.npm}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-4">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <p className="text-gray-500 text-lg">Belum ada data kepengurusan</p>
              </div>
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
                    <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-200">
                      <div
                        className="w-full h-40 bg-gray-200 relative overflow-hidden cursor-pointer group"
                        onClick={() => item.foto_url && openImageModal(item.id, "dokumentasi")}
                      >
                        {item.foto_url ? (
                          <>
                            <img
                              src={item.foto_url}
                              alt={item.nama_kegiatan}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 flex items-center justify-center">
                              <ZoomIn className="text-white" size={32} />
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <ImageIcon size={48} />
                          </div>
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
                        <button
                          onClick={() => openImageModal(item.id, "prestasi")}
                          className="flex-shrink-0 inline-flex items-center gap-2 bg-[#0B132B] text-white px-4 py-2 rounded-lg hover:bg-[#1C2541] transition text-sm font-semibold"
                        >
                          <FileText size={16} />
                          Lihat Bukti
                        </button>
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

        {/* Image Lightbox Modal */}
        {selectedImageIndex !== null && selectedItem && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition"
              >
                <X size={24} />
              </button>

              {/* Previous Button */}
              {selectedImageIndex > 0 && (
                <button
                  onClick={showPrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition"
                >
                  <ChevronLeft size={32} />
                </button>
              )}

              {/* Next Button */}
              {selectedImageIndex < currentList.length - 1 && (
                <button
                  onClick={showNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition"
                >
                  <ChevronRight size={32} />
                </button>
              )}

              {/* Image */}
              <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={imageType === "dokumentasi" ? (selectedItem as Dokumentasi).foto_url! : (selectedItem as Prestasi).bukti_path!}
                  alt={imageType === "dokumentasi" ? (selectedItem as Dokumentasi).nama_kegiatan : (selectedItem as Prestasi).nama_prestasi}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="p-4 bg-gray-50">
                  <h3 className="font-bold text-lg text-[#0B132B]">
                    {imageType === "dokumentasi" ? (selectedItem as Dokumentasi).nama_kegiatan : (selectedItem as Prestasi).nama_prestasi}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {imageType === "dokumentasi" ? (selectedItem as Dokumentasi).tanggal_kegiatan : (selectedItem as Prestasi).tanggal_perolehan}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedImageIndex + 1} / {currentList.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-[#0B132B] text-white py-8 text-center text-sm mt-12">
          <p className="opacity-80 mb-2">© 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI</p>
          <p className="text-xs opacity-60">ORBIT - Ormawa Berbasis Informasi Terpadu</p>
        </footer>
      </div>
    </>
  );
}
