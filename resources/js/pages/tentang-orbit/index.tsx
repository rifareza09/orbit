import React, { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { Image as ImageIcon, ChevronDown, ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import OrbitAnimation from "@/components/OrbitAnimation"; 

export default function TentangOrbitPage() {
  const [currentTeamSlide, setCurrentTeamSlide] = useState(0);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const nextSlide = () => setCurrentTeamSlide(1);
  const prevSlide = () => setCurrentTeamSlide(0);

  return (
    <>
      <Head title="Tentang ORBIT" />

      <style>{`
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: #0B132B; }
        ::-webkit-scrollbar-thumb { background-color: #1C2541; border-radius: 6px; border: 2px solid #0B132B; }
        html { scroll-behavior: smooth; }
      `}</style>
      
      <div className="min-h-screen w-full font-sans text-[#0B132B] relative">
        <div className="absolute top-0 left-0 w-full h-full">
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
        <nav className="bg-[#0B132B] text-white py-4 px-6 md:px-12 flex justify-between items-center fixed top-0 w-full z-50 shadow-md border-b border-white/10">
          <div className="flex items-center gap-3">
             <span className="font-bold text-xl tracking-wider">ORBIT</span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <button onClick={() => scrollToSection('apa-itu-orbit')} className="hover:text-white transition">Apa itu ORBIT</button>
            <button onClick={() => scrollToSection('visi-misi')} className="hover:text-white transition">Visi & Misi</button>
            <button onClick={() => scrollToSection('tim-section')} className="hover:text-white transition">Tim Pengembang</button>
          </div>

          <div>
            <Link href="/" className="bg-[#1C2541] hover:bg-[#2a365c] px-6 py-2 rounded text-sm font-semibold transition border border-gray-600 flex items-center gap-2">
              <ArrowLeft size={16} />
              Kembali
            </Link>
          </div>
        </nav>

        {/* --- SECTION 1: APA ITU ORBIT --- */}
        <div
            id="apa-itu-orbit"
            className="min-h-screen w-full flex items-center justify-center text-center text-white relative z-10"
        >
          <div className="max-w-4xl px-6 pt-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
              Apa itu ORBIT?
            </h2>
            <div className="w-24 h-1.5 bg-yellow-400 mx-auto mb-10 rounded-full shadow-lg"></div>
            <p className="text-xl md:text-2xl leading-relaxed opacity-95 drop-shadow-md max-w-4xl mx-auto font-light">
              Aplikasi terintegrasi untuk mengelola kegiatan organisasi kemahasiswaan
              Universitas YARSI secara digital, mulai dari perencanaan, pengajuan,
              hingga monitoring dan evaluasi.
            </p>

            <div className="mt-16 animate-bounce">
                <button onClick={() => scrollToSection('visi-misi')} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition cursor-pointer backdrop-blur-sm border border-white/10">
                    <ChevronDown size={32} />
                </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: VISI MISI --- */}
        <div
            id="visi-misi"
            className="min-h-screen w-full flex items-center justify-center p-6 md:px-16 relative z-10"
        >
          <div className="w-full max-w-7xl grid md:grid-cols-2 gap-20 items-center">
            
            {/* --- Animasi Orbit --- */}
            <div className="flex justify-center items-center h-[400px] md:h-auto order-2 md:order-1">
               <OrbitAnimation />
            </div>

            {/* Visi Misi Cards */}
            <div className="space-y-8 order-1 md:order-2">
              {/* --- CARD VISI --- */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:-translate-y-1 transition-transform duration-300">
                  <h3 className="text-[#0B132B] font-bold text-3xl mb-4 flex items-center gap-4 border-b border-gray-100 pb-4">
                    <img 
                        src="/images/visi.png"
                        alt="Icon Visi" 
                        className="w-12 h-12 object-contain opacity-80"
                    />
                    Visi
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg border-l-4 border-yellow-400 pl-4">
                    Menjadi platform digital terintegrasi yang mendukung pengelolaan organisasi kemahasiswaan secara efektif, transparan, dan berkelanjutan di Universitas YARSI.
                  </p>
              </div>

              {/* --- CARD MISI --- */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:-translate-y-1 transition-transform duration-300">
                  <h3 className="text-[#0B132B] font-bold text-3xl mb-4 flex items-center gap-4 border-b border-gray-100 pb-4">
                    <img 
                        src="/images/misi.png"
                        alt="Icon Misi" 
                        className="w-12 h-12 object-contain opacity-80"
                    />
                    Misi
                  </h3>
                  <ul className="text-gray-700 space-y-3 leading-relaxed text-base list-disc list-outside pl-5">
                      <li>Sistem terpusat untuk perencanaan & pelaporan kegiatan.</li>
                      <li>Monitoring dan evaluasi Puskaka yang akurat.</li>
                      <li>Efisiensi, transparansi, dan akuntabilitas tata kelola.</li>
                      <li>Database kegiatan terstruktur untuk akreditasi.</li>
                  </ul>
              </div>

            </div>
          </div>
        </div>

        {/* --- SECTION 3: TIM PENGEMBANG & TIM MCL --- */}
        <div
            id="tim-section"
            className="min-h-screen w-full relative flex items-center justify-center overflow-hidden py-20 z-10"
        >
            {/* Tombol Navigasi */}
            {currentTeamSlide === 1 && (
                <button onClick={prevSlide} className="absolute left-4 md:left-10 z-20 bg-white hover:bg-gray-50 p-4 rounded-full border border-gray-200 transition transform hover:scale-110 shadow-lg text-[#0B132B]">
                    <ChevronLeft size={32} />
                </button>
            )}

            {currentTeamSlide === 0 && (
                <button onClick={nextSlide} className="absolute right-4 md:right-10 z-20 bg-white hover:bg-gray-50 p-4 rounded-full border border-gray-200 transition transform hover:scale-110 shadow-lg animate-pulse text-[#0B132B]">
                    <ChevronRight size={32} />
                </button>
            )}

            <div className="flex w-full h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentTeamSlide * 100}%)` }}>
                {/* SLIDE 1: Tim Pengembang */}
                <div className="min-w-full w-full flex flex-col justify-center items-center px-6">
                    <div className="w-full max-w-7xl">
                        <div className="text-center mb-16 relative z-10">
                            <div className="inline-block bg-white/90 backdrop-blur-sm px-10 py-4 rounded-2xl shadow-md border border-gray-100">
                            
                                <h2 className="text-4xl md:text-5xl font-bold text-[#0B132B]">ORBIT Developer Team</h2>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-8 justify-center items-center">
                            {[
                              
                              {
                                name: "Rifa Reza Fahlevi",
                                nim: "1402023060",
                                role: "Fullstack Developer",
                                photo: "/images/Reza.png"
                              },
                              {
                                name: "Muhammad Raihan",
                                nim: "1402023041",
                                role: "UI/UX & Frontend Developer",
                                photo: "/images/Raihan.png",
                                position: "object-[50%_60%]"
                              },
                              {
                                name: "Rafli Dika Narendra",
                                nim: "14020230XX",
                                role: "Backend Developer",
                                photo: "/images/Rafli.png"
                              },
                            ].map((dev, index) => (
                            <div key={index} className="w-72 bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden group hover:-translate-y-2 transition-all duration-300 relative z-10">
                                <div className="h-72 w-full relative overflow-hidden bg-gray-100">
                                    <img 
                                        src={dev.photo} 
                                        alt={dev.name}
                                        className={`w-full h-full object-cover ${dev.position} group-hover:scale-105 transition-transform duration-500`}
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
                                <div className="p-6 text-center bg-white relative">
                                    <h3 className="font-bold text-xl text-[#0B132B] mb-1 leading-tight">
                                        {dev.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium mb-4">
                                        {dev.nim}
                                    </p>
                                    <div className="inline-block px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                        {dev.role}
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SLIDE 2: Tim MCL */}
                <div className="min-w-full w-full flex items-center justify-center px-6 md:px-16">

                    <div className="w-full max-w-7xl bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-gray-200 relative overflow-hidden z-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                        <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                            <div className="flex justify-center">
                                <div className="w-80 h-80 rounded-full border-4 border-dashed border-[#0B132B]/10 flex items-center justify-center bg-gray-50 shadow-inner">
                                    <ImageIcon size={100} className="text-[#0B132B]/20" />
                                </div>
                            </div>

                            <div>
                                <div className="inline-block bg-[#0B132B] text-white border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] rounded-full px-4 py-1.5 text-xs font-bold mb-6 uppercase tracking-wider">
                                    Trek Pengembangan Aplikasi Multiplatform
                                </div>
                                
                                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-[#0B132B]">
                                    Tim MCL
                                </h2>
                                <p className="text-gray-600 text-xl leading-relaxed mb-10 border-l-4 border-yellow-400 pl-6">
                                    Mahasiswa Teknik Informatika Universitas YARSI angkatan 2023. Proyek ini dibuat
                                    sebagai tugas dari mata kuliah Peminatan Trek Pengembangan Aplikasi Multiplatform.
                                </p>

                                <div className="flex gap-8 md:gap-12 border-t border-gray-200 pt-8">
                                    <div>
                                        <div className="text-4xl font-bold text-[#0B132B]">2023</div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mt-1">Angkatan</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-bold text-[#0B132B]">TI</div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mt-1">Jurusan</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-bold text-[#0B132B]">3</div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mt-1">Developer</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="bg-[#0B132B] text-white py-10 text-center text-sm border-t border-gray-800 relative z-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-4">
              
            </div>
            <p className="opacity-50 text-xs">
              © 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}