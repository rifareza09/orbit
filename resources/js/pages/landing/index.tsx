import React from "react";
import { Link, Head } from "@inertiajs/react";
import { Image as ImageIcon, Search, Calendar, MapPin, ChevronDown } from "lucide-react";

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
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Head title="Selamat Datang" />

      {/* --- UPDATE 1: CONTAINER UTAMA (SNAP SCROLL) --- */}
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory font-sans bg-white text-[#0B132B] scroll-smooth">

        {/* NAVBAR (Sticky) */}
        <nav className="bg-[#0B132B] text-white py-4 px-6 md:px-12 flex justify-between items-center fixed top-0 w-full z-50 shadow-md">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <img
              src="/images/Logo.png"
              alt="Logo ORBIT"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <button onClick={() => scrollToSection('home')} className="hover:text-white transition">Home</button>
            <button onClick={() => scrollToSection('daftar-ormawa')} className="hover:text-white transition">Daftar Ormawa</button>
            <button onClick={() => scrollToSection('kegiatan')} className="hover:text-white transition">Kalender Kegiatan</button>
            <Link href="/tentang-orbit" className="hover:text-white transition">Tentang ORBIT</Link>
          </div>

          <div>
            {auth?.user ? (
              <Link href="/dashboard" className="bg-[#1C2541] hover:bg-[#2a365c] px-6 py-2 rounded text-sm font-semibold transition border border-gray-600">Dashboard</Link>
            ) : (
              <Link href="/login" className="bg-[#1C2541] hover:bg-[#2a365c] px-6 py-2 rounded text-sm font-semibold transition border border-gray-600">Login</Link>
            )}
          </div>
        </nav>

        {/* --- SECTION 1: HERO (FULL SCREEN) --- */}
        <div
            id="home"
            className="relative min-h-screen w-full flex items-center justify-center text-center text-white snap-start"
        >
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: "url('/images/background.png')", filter: "brightness(0.4)" }}
          ></div>
          <div className="relative z-10 px-4 mt-16"> {/* mt-16 kompensasi navbar */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
              Selamat Datang di ORBIT!
            </h1>
            <p className="text-xl md:text-3xl font-light opacity-90 drop-shadow-md">
              Ormawa Berbasis Informasi Terpadu
            </p>
            <div className="mt-6 text-2xl tracking-[0.2em] font-serif opacity-90">
              UNIVERSITAS YARSI
            </div>

            {/* Scroll Indicator */}
            <button onClick={() => scrollToSection('daftar-ormawa')} className="mt-16 animate-bounce text-white opacity-70 hover:opacity-100 transition">
                <ChevronDown size={48} />
            </button>
          </div>
        </div>

        {/* --- SECTION 2: DAFTAR ORMAWA (FULL SCREEN) --- */}
        <div
            id="daftar-ormawa"
            className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 px-6 md:px-16 pt-20 pb-10 snap-start"
        >
          <div className="w-full max-w-7xl">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-12 text-[#0B132B]">
                Daftar Organisasi Mahasiswa Universitas YARSI
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {ormawas.map((item, idx) => (
                <Link key={idx} href={`/ormawa/${item.id}`}>
                  <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-xl transition-all cursor-pointer group h-48 border border-gray-200 transform hover:-translate-y-1">
                      <div className="mb-4 text-gray-400 group-hover:text-[#0B132B] transition">
                        {item.logo_url ? (
                          <img
                            src={item.logo_url}
                            alt={item.name}
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <ImageIcon size={48} strokeWidth={1} />
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase text-center mb-1 tracking-wider">
                        {item.role === 'ormawa' ? 'ORMAWA' : 'ORGANISASI'}
                      </div>
                      <div className="text-sm font-bold text-center leading-tight text-[#0B132B] line-clamp-2">
                        {item.name}
                      </div>
                  </div>
                </Link>
                ))}

                {ormawas.length === 0 && Array(10).fill(0).map((_, i) => (
                <div key={i} className="bg-[#F3F4F6] rounded-xl p-6 flex flex-col items-center justify-center h-48 border border-gray-200">
                    <ImageIcon size={48} strokeWidth={1} className="text-gray-400 mb-4"/>
                    <div className="text-xs text-gray-500">Unit Kegiatan Mahasiswa</div>
                    <div className="text-sm font-bold text-center">Nama Organisasi</div>
                </div>
            ))}
            </div>
          </div>
        </div>

        {/* --- SECTION 3: KEGIATAN ORGANISASI (FULL SCREEN) --- */}
        <div
            id="kegiatan"
            className="min-h-screen w-full flex flex-col justify-center items-center bg-white px-6 md:px-16 pt-20 pb-10 snap-start"
        >
          <div className="w-full max-w-5xl">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-10 text-[#0B132B]">
                Kegiatan Terbaru
            </h2>

            {/* Search Bar */}
            <div className="flex bg-[#F3F4F6] rounded-full overflow-hidden border border-gray-200 p-1 mb-10 shadow-sm max-w-3xl mx-auto">
                <div className="flex items-center px-4 text-gray-400"><Search size={20} /></div>
                <input type="text" placeholder="Cari kegiatan..." className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 px-2 outline-none" />
                <button className="bg-[#0B132B] text-white px-6 py-1 rounded-full text-xs font-bold hover:bg-black transition mx-1">CARI</button>
            </div>

            {/* List Kegiatan (Scrollable jika banyak) */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {latestKegiatan.length > 0 ? (
                  latestKegiatan.map((item: any, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition duration-300">
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
                    </div>
                  ))
                ) : (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                        <div className="w-full md:w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0"></div>
                        <div className="flex-1 w-full space-y-2">
                            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                  ))
                )}
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="bg-[#0B132B] text-white py-8 text-center text-sm snap-start">
          <div className="opacity-70">
            © 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
          </div>
        </footer>

      </div>
    </>
  );
}
