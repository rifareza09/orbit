import React, { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import { Image as ImageIcon, Search, Calendar, MapPin, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface OrmawaItem {
  id: number;
  name: string;
  username: string;
  role: string;
  logo_url?: string | null;
}

interface KegiatanItem {
  id: number;
  nama_kegiatan: string;
  ormawa: string;
  tanggal_pelaksanaan: string;
  tempat_pelaksanaan: string;
  status: string;
}

interface LandingProps {
  ormawas: OrmawaItem[];
  latestKegiatan: KegiatanItem[];
  auth: { user: any };
}

export default function LandingPage({ ormawas = [], latestKegiatan = [], auth }: LandingProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredKegiatan = latestKegiatan.filter(item =>
    item.nama_kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.ormawa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Head title="Selamat Datang" />

      {/* --- CONTAINER UTAMA --- */}
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory font-sans bg-white text-[#0B132B] scroll-smooth">

        {/* NAVBAR (Sticky) */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0B132B] text-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-md"
        >
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection('home')}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src="/images/Logo.png"
              alt="Logo ORBIT"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </motion.div>

          <div className="hidden md:flex gap-8 text-sm font-medium">
            {[
              { id: 'home', label: 'Home' },
              { id: 'daftar-ormawa', label: 'Daftar Ormawa' },
              { id: 'kegiatan', label: 'Kalender Kegiatan' }
            ].map((item, idx) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="hover:text-gray-300 transition"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/tentang-orbit" className="hover:text-gray-300 transition">
                Tentang ORBIT
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {auth?.user ? (
              <Link href="/dashboard" className="bg-white text-[#0B132B] px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition transform hover:scale-105">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="bg-white text-[#0B132B] px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition transform hover:scale-105">
                Login
              </Link>
            )}
          </motion.div>
        </motion.nav>

        {/* --- SECTION 1: HERO (FULL SCREEN) --- */}
        <div
            id="home"
            className="relative min-h-screen w-full flex items-center justify-center text-center text-white snap-start bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B]"
        >
          <motion.div
            className="px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Selamat Datang di<br />ORBIT
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl font-light mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Ormawa Berbasis Informasi Terpadu
            </motion.p>

            <motion.div
              className="text-lg tracking-[0.3em] font-serif opacity-80 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              UNIVERSITAS YARSI
            </motion.div>

            <motion.button
              onClick={() => scrollToSection('daftar-ormawa')}
              className="mt-8 text-white opacity-70 hover:opacity-100 transition"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
            >
                <ChevronDown size={40} />
            </motion.button>
          </motion.div>
        </div>

        {/* --- SECTION 2: DAFTAR ORMAWA (FULL SCREEN) --- */}
        <div
            id="daftar-ormawa"
            className="min-h-screen w-full flex flex-col justify-center items-center bg-white px-6 md:px-16 pt-20 pb-10 snap-start"
        >
          <div className="w-full max-w-6xl">
            <motion.h2
              className="text-center text-3xl md:text-4xl font-bold mb-12 text-[#0B132B]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
                Daftar Organisasi Mahasiswa
            </motion.h2>

            {/* Grid Ormawa Cards */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
                {ormawas.map((item, idx) => (
                <Link key={idx} href={`/ormawa/${item.id}`}>
                  <motion.div
                    className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-all cursor-pointer h-48 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    whileHover={{ y: -8, scale: 1.03 }}
                  >
                      <div className="mb-4">
                        {item.logo_url ? (
                          <img
                            src={item.logo_url}
                            alt={item.name}
                            className="w-20 h-20 object-contain"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                            <ImageIcon size={40} className="text-gray-400" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase text-center mb-1">
                        {item.role === 'ormawa' ? 'ORMAWA' : 'ORGANISASI'}
                      </div>
                      <div className="text-sm font-bold text-center leading-tight text-[#0B132B] line-clamp-2">
                        {item.name}
                      </div>
                  </motion.div>
                </Link>
                ))}

                {ormawas.length === 0 && Array(10).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center h-48 border border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                    <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center mb-4 animate-pulse">
                      <ImageIcon size={40} strokeWidth={1} className="text-gray-400"/>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Unit Kegiatan Mahasiswa</div>
                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                </motion.div>
            ))}
            </motion.div>
          </div>
        </div>

        {/* --- SECTION 3: KEGIATAN ORGANISASI (FULL SCREEN) --- */}
        <div
            id="kegiatan"
            className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 px-6 md:px-16 pt-20 pb-10 snap-start"
        >
          <div className="w-full max-w-5xl">
            <motion.h2
              className="text-center text-3xl md:text-4xl font-bold mb-10 text-[#0B132B]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
                Kegiatan Terbaru
            </motion.h2>

            {/* Search Bar */}
            <motion.div
              className="flex bg-white rounded-full overflow-hidden border border-gray-200 p-1 mb-10 shadow-sm max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className="flex items-center px-4 text-gray-400"><Search size={20} /></div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kegiatan atau organisasi..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 px-2 outline-none"
                />
                <button className="bg-[#0B132B] text-white px-6 py-1 rounded-full text-xs font-bold hover:bg-black transition mx-1">
                  CARI
                </button>
            </motion.div>

            {/* List Kegiatan (Scrollable jika banyak) */}
            <motion.div
              className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
                {(filteredKegiatan.length > 0 ? filteredKegiatan : latestKegiatan).length > 0 ? (
                  (filteredKegiatan.length > 0 ? filteredKegiatan : latestKegiatan).map((item: any, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-lg transition duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      whileHover={{ y: -4 }}
                    >
                        <div className="w-full md:w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 flex-shrink-0">
                            <ImageIcon size={32} />
                        </div>
                        <div className="flex-1 text-center md:text-left w-full">
                            <h3 className="font-bold text-xl text-[#0B132B] mb-1">
                                {item.nama_kegiatan}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium mb-3 uppercase tracking-wide">
                                {item.ormawa}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                                    <Calendar size={16} className="text-[#0B132B]" />
                                    {item.tanggal_pelaksanaan}
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                                    <MapPin size={16} className="text-[#0B132B]" />
                                    {item.tempat_pelaksanaan}
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full text-xs font-bold border border-green-200">
                                Disetujui
                            </span>
                        </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak Ada Kegiatan</h3>
                    <p className="text-gray-500">Belum ada kegiatan yang tersedia saat ini</p>
                  </motion.div>
                )}
            </motion.div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <motion.footer
          className="bg-[#0B132B] text-white py-8 text-center text-sm snap-start"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="opacity-70">
            © 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
          </div>
        </motion.footer>

      </div>
    </>
  );
}
