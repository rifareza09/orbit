import React, { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import { Image as ImageIcon, ChevronDown, ArrowLeft, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrbitAnimation from "@/components/OrbitAnimation";

interface Ormawa {
  id: number;
  name: string;
  logo_url: string;
}

interface TentangOrbitPageProps {
  ormawaList: Ormawa[];
}

export default function TentangOrbitPage({ ormawaList = [] }: TentangOrbitPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Head title="Tentang ORBIT" />

      <style>{`
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: #0B132B; }
        ::-webkit-scrollbar-thumb { background-color: #1C2541; border-radius: 6px; border: 2px solid #0B132B; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; margin: 0; padding: 0; }
        * { box-sizing: border-box; }
      `}</style>

      <div className="min-h-screen w-full overflow-x-hidden font-sans text-[#0B132B] relative">
        <div className="fixed inset-0 w-full h-full -z-10">
            <div
                className="w-full h-full"
                style={{
                    backgroundImage: "url('/images/Background-Full.jpg')",
                    backgroundSize: "100% auto",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top center"
                }}
            ></div>
        </div>

        {/* --- NAVBAR --- */}
        <nav className="bg-[#0B132B] text-white py-3 px-4 sm:px-6 md:px-12 flex justify-between items-center fixed top-0 w-full z-50 shadow-md border-b border-white/10">
          <div className="flex items-center gap-3">
             <span className="font-bold text-lg sm:text-xl tracking-wider">ORBIT</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <button onClick={() => scrollToSection('apa-itu-orbit')} className="hover:text-white transition">Apa itu ORBIT</button>
            <button onClick={() => scrollToSection('visi-misi')} className="hover:text-white transition">Visi & Misi</button>
            <button onClick={() => scrollToSection('tim-section')} className="hover:text-white transition">Tim Pengembang</button>
          </div>

          {/* Desktop Back Button */}
          <div className="hidden md:block">
            <Link href="/" className="bg-[#1C2541] hover:bg-[#2a365c] px-6 py-2 rounded text-sm font-semibold transition border border-gray-600 flex items-center gap-2">
              <ArrowLeft size={16} />
              Kembali
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 bg-[#0B132B] text-white z-50 shadow-2xl md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                  <span className="font-bold text-lg">Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    <Link
                      href="/"
                      className="block w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <button
                      onClick={() => scrollToSection('apa-itu-orbit')}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Apa itu ORBIT
                    </button>
                    <button
                      onClick={() => scrollToSection('visi-misi')}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Visi & Misi
                    </button>
                    <button
                      onClick={() => scrollToSection('tim-section')}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Tim Pengembang
                    </button>
                  </div>
                </nav>

                <div className="p-4 border-t border-white/10">
                  <Link
                    href="/"
                    className="block w-full text-center bg-[#1C2541] hover:bg-[#2a365c] px-6 py-3 rounded text-sm font-semibold transition border border-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ArrowLeft size={16} />
                      Kembali
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SECTION 1: APA ITU ORBIT --- */}
        <div
            id="apa-itu-orbit"
            className="min-h-screen w-full flex items-center justify-center text-center text-white relative z-10"
        >
          {/* Dark Overlay untuk kontras yang lebih baik */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent"></div>

          <div className="max-w-4xl px-4 sm:px-6 pt-20 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
              Apa itu ORBIT?
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 sm:h-1.5 bg-yellow-400 mx-auto mb-6 sm:mb-8 md:mb-10 rounded-full shadow-lg"></div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed opacity-95 drop-shadow-2xl max-w-4xl mx-auto font-light px-2">
              Aplikasi terintegrasi untuk mengelola kegiatan organisasi kemahasiswaan
              Universitas YARSI secara digital, mulai dari perencanaan, pengajuan,
              hingga monitoring dan evaluasi.
            </p>

            <div className="mt-12 sm:mt-16 animate-bounce">
                <button onClick={() => scrollToSection('visi-misi')} className="bg-white/10 p-2 sm:p-3 rounded-full hover:bg-white/20 transition cursor-pointer backdrop-blur-sm border border-white/10">
                    <ChevronDown size={28} className="sm:hidden" />
                    <ChevronDown size={32} className="hidden sm:block" />
                </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: VISI MISI --- */}
        <div
            id="visi-misi"
            className="min-h-screen w-full flex items-center justify-center px-4 py-12 sm:p-6 md:px-16 relative z-10 overflow-hidden"
        >
          <div className="w-full max-w-7xl grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-20 items-center">

            {/* --- Animasi Orbit --- */}
            <div className="flex justify-center items-center h-[300px] sm:h-[350px] md:h-[400px] lg:h-auto order-2 md:order-1">
               <OrbitAnimation ormawaList={ormawaList} />
            </div>

            {/* Visi Misi Cards */}
            <div className="space-y-6 sm:space-y-8 order-1 md:order-2 w-full">
              {/* --- CARD VISI --- */}
              <div className="bg-white/95 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 hover:-translate-y-1 transition-transform duration-300 w-full">
                  <h3 className="text-[#0B132B] font-bold text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4 border-b border-gray-100 pb-3 sm:pb-4">
                    <img
                        src="/images/visi.png"
                        alt="Icon Visi"
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain opacity-80 flex-shrink-0"
                    />
                    Visi
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg border-l-4 border-yellow-400 pl-3 sm:pl-4">
                    Menjadi platform digital terintegrasi yang mendukung pengelolaan organisasi kemahasiswaan secara efektif, transparan, dan berkelanjutan di Universitas YARSI.
                  </p>
              </div>

              {/* --- CARD MISI --- */}
              <div className="bg-white/95 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 hover:-translate-y-1 transition-transform duration-300 w-full">
                  <h3 className="text-[#0B132B] font-bold text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4 border-b border-gray-100 pb-3 sm:pb-4">
                    <img
                        src="/images/misi.png"
                        alt="Icon Misi"
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain opacity-80 flex-shrink-0"
                    />
                    Misi
                  </h3>
                  <ul className="text-gray-700 space-y-2 sm:space-y-3 leading-relaxed text-sm sm:text-base list-disc list-outside pl-4 sm:pl-5">
                      <li>Sistem terpusat untuk perencanaan & pelaporan kegiatan.</li>
                      <li>Monitoring dan evaluasi Puskaka yang akurat.</li>
                      <li>Efisiensi, transparansi, dan akuntabilitas tata kelola.</li>
                      <li>Database kegiatan terstruktur untuk akreditasi.</li>
                  </ul>
              </div>

            </div>
          </div>
        </div>

        {/* --- SECTION 3: TIM PENGEMBANG --- */}
        <div
            id="tim-section"
            className="min-h-screen w-full relative flex items-center justify-center overflow-hidden py-12 sm:py-16 md:py-20 z-10"
        >
            {/* SLIDE 1: Tim Pengembang */}
            <div className="w-full flex flex-col justify-center items-center px-4 sm:px-6">
                <div className="w-full max-w-7xl">
                    <div className="text-center mb-8 sm:mb-12 md:mb-16 relative z-10">
                        <div className="inline-block bg-white/90 backdrop-blur-sm px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-md border border-gray-100">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B132B]">ORBIT Developer Team</h2>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6 sm:gap-8 justify-center items-center">
                            {[

                              {
                                name: "Rifa Reza Fahlevi",
                                nim: "1402023060",
                                role: "Fullstack Developer",
                                photo: "/images/Reza.png",
                                instagram: "https://www.instagram.com/rifareza_/",
                                linkedin: "https://www.linkedin.com/in/rifarezafahlevi",
                                github: "https://github.com/rifareza09"
                              },
                              {
                                name: "Muhammad Raihan",
                                nim: "1402023041",
                                role: "UI/UX & Frontend Developer",
                                photo: "/images/Raihan.png",
                                position: "object-[50%_60%]",
                                instagram: "https://www.instagram.com/raihanyustin/",
                                linkedin: "https://www.linkedin.com/in/muhammad-raihan-yustin/",
                                github: "https://github.com/raihanyustin"
                              },
                              {
                                name: "Rafli Dika Rendra Arifin",
                                nim: "1402023053",
                                role: "Backend Developer",
                                photo: "/images/Rafli.png",
                                instagram: "https://www.instagram.com/nareeenv/",
                                linkedin: "https://www.linkedin.com/in/rafli-dika-a06037290/",
                                github: "https://github.com/rendra-v"
                              },
                            ].map((dev, index) => (
                            <div key={index} className="w-full max-w-[280px] sm:w-72 bg-white rounded-2xl sm:rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden group hover:-translate-y-2 transition-all duration-300 relative z-10">
                                <div className="h-64 sm:h-72 w-full relative overflow-hidden bg-gray-100">
                                    <img
                                        src={dev.photo}
                                        alt={dev.name}
                                        className={`w-full h-full object-cover ${dev.position || ''} group-hover:scale-105 transition-transform duration-500`}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            e.currentTarget.nextElementSibling?.classList.add('flex');
                                        }}
                                    />
                                    <div className="hidden absolute inset-0 items-center justify-center text-gray-300">
                                         <ImageIcon size={64} />
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="p-4 sm:p-5 md:p-6 text-center bg-white relative">
                                    <h3 className="font-bold text-lg sm:text-xl text-[#0B132B] mb-1 leading-tight">
                                        {dev.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 font-medium mb-2 sm:mb-3">
                                        {dev.nim}
                                    </p>
                                    <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gray-50 border border-gray-200 text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-wide mb-3 sm:mb-4">
                                        {dev.role}
                                    </div>
                                    {/* Social Media Links */}
                                    <div className="flex justify-center gap-2 pt-3 sm:pt-4 border-t border-gray-100">
                                        <a
                                            href={dev.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-110"
                                            title="Instagram"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" /></svg>
                                        </a>
                                        <a
                                            href={dev.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-110"
                                            title="LinkedIn"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3" /><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 10v7M15 10v7" /></svg>
                                        </a>
                                        <a
                                            href={dev.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-900 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-gray-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-110"
                                            title="GitHub"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" /></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="bg-[#0B132B] text-white py-6 sm:py-8 md:py-10 text-center text-xs sm:text-sm border-t border-gray-800 relative z-10">
          <p className="opacity-50 px-4">
            © 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
          </p>
        </footer>

      </div>
    </>
  );
}
