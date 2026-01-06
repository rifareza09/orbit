import React from "react";
import { Link, Head } from "@inertiajs/react";
import { Image as ImageIcon, ChevronDown, ArrowLeft } from "lucide-react";

export default function TentangOrbitPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Head title="Tentang ORBIT" />

      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory font-sans text-[#0B132B] scroll-smooth">

        {/* NAVBAR (Sticky) */}
        <nav className="bg-[#0B132B] text-white py-4 px-6 md:px-12 flex justify-between items-center fixed top-0 w-full z-50 shadow-md">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <img
                src="/images/Logo.png"
                alt="Logo ORBIT"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <button onClick={() => scrollToSection('apa-itu-orbit')} className="hover:text-white transition">Apa itu ORBIT</button>
            <button onClick={() => scrollToSection('visi-misi')} className="hover:text-white transition">Visi & Misi</button>
            <button onClick={() => scrollToSection('tim-pengembang')} className="hover:text-white transition">Tim Pengembang</button>
          </div>

          <div>
            <Link href="/" className="bg-[#1C2541] hover:bg-[#2a365c] px-6 py-2 rounded text-sm font-semibold transition border border-gray-600 flex items-center gap-2">
              <ArrowLeft size={16} />
              Kembali
            </Link>
          </div>
        </nav>

        {/* --- SECTION 1: APA ITU ORBIT (FULL SCREEN WITH BACKGROUND) --- */}
        <div
            id="apa-itu-orbit"
            className="relative min-h-screen w-full flex items-center justify-center text-center text-white snap-start"
        >
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: "url('/images/background.png')", filter: "brightness(0.5)" }}
          ></div>
          <div className="relative z-10 px-4 mt-16 max-w-5xl">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight drop-shadow-lg">
              Apa itu ORBIT?
            </h2>
            <p className="text-lg md:text-xl leading-relaxed opacity-95 drop-shadow-md max-w-4xl mx-auto">
              adalah aplikasi terintegrasi untuk mengelola kegiatan organisasi kemahasiswaan
              Universitas YARSI secara digital, mulai dari perencanaan program kerja, pengajuan
              dan pelaporan kegiatan, hingga monitoring dan evaluasi oleh Puskaka, sehingga
              proses administrasi menjadi lebih efisien, transparan, dan terdokumentasi.
            </p>

            {/* Scroll Indicator */}
            <button onClick={() => scrollToSection('visi-misi')} className="mt-16 animate-bounce text-white opacity-70 hover:opacity-100 transition">
                <ChevronDown size={48} />
            </button>
          </div>
        </div>

        {/* --- SECTION 2: LOGO & VISI MISI (WHITE BACKGROUND) --- */}
        <div
            id="visi-misi"
            className="min-h-screen w-full flex items-center justify-center bg-white px-6 md:px-16 pt-20 pb-10 snap-start"
        >
          <div className="w-full max-w-7xl grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Logo ORBIT Besar */}
            <div className="flex justify-center md:justify-start">
              <img
                src="/images/LogoOrbitBlack.png"
                alt="Logo ORBIT"
                className="h-48 md:h-64 object-contain"
              />
            </div>

            {/* Right: Visi & Misi Cards */}
            <div className="space-y-6">
              {/* Card Visi */}
              <div className="bg-[#0B132B] text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3">Visi</h3>
                <p className="text-sm leading-relaxed">
                  Menjadi platform digital terintegrasi yang mendukung pengelolaan organisasi kemahasiswaan secara efektif, transparan, dan berkelanjutan di Universitas YARSI
                </p>
              </div>

              {/* Card Misi */}
              <div className="bg-[#0B132B] text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3">Misi</h3>
                <ol className="text-sm space-y-2 leading-relaxed list-decimal list-inside">
                  <li>Menyediakan sistem terpusat untuk perencanaan, pengajuan, pelaksanaan, dan pelaporan kegiatan organisasi mahasiswa.</li>
                  <li>Mendukung monitoring dan evaluasi kegiatan Ormawa oleh Puskaka secara akurat dan terdokumentasi.</li>
                  <li>Meningkatkan efisiensi, transparansi, dan akuntabilitas dalam tata kelola kegiatan kemahasiswaan.</li>
                  <li>Menyediakan data kegiatan yang terstruktur dan berkelanjutan sebagai pendukung evaluasi dan akreditasi.</li>
                  <li>Menghadirkan aplikasi yang mudah digunakan dan adaptif terhadap kebutuhan organisasi institusi.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <button onClick={() => scrollToSection('tim-pengembang')} className="animate-bounce text-[#0B132B] opacity-50 hover:opacity-100 transition">
                <ChevronDown size={48} />
            </button>
          </div>
        </div>

        {/* --- SECTION 3: TIM PENGEMBANG ORBIT (FULL SCREEN) --- */}
        <div
            id="tim-pengembang"
            className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 px-6 md:px-16 pt-20 pb-10 snap-start"
        >
          <div className="w-full max-w-7xl">
            <h2 className="text-center text-4xl md:text-5xl font-bold mb-20 text-[#0B132B]">
              Tim Pengembang ORBIT
            </h2>

            {/* Tim Cards Carousel */}
            <div className="relative flex items-center justify-center mb-16">
              {/* Left Arrow */}
              <button className="absolute left-0 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition border border-gray-200 hover:bg-gray-50">
                <ChevronDown size={28} className="rotate-90 text-[#0B132B]" />
              </button>

              {/* Cards Container */}
              <div className="flex gap-8 justify-center items-stretch px-16">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden w-72 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                    <div className="bg-gray-200 h-56 flex items-center justify-center">
                      <ImageIcon size={64} className="text-gray-400" />
                    </div>
                    <div className="p-8 text-center">
                      <h3 className="font-bold text-xl mb-2 text-[#0B132B]">Nama</h3>
                      <p className="text-sm text-gray-500 mb-6 font-medium">NIM</p>
                      <button className="bg-[#0B132B] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#1C2541] transition shadow-md hover:shadow-lg">
                        Jobdesk
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button className="absolute right-0 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition border border-gray-200 hover:bg-gray-50">
                <ChevronDown size={28} className="-rotate-90 text-[#0B132B]" />
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center">
              <button onClick={() => scrollToSection('kami-adalah-tim')} className="animate-bounce text-[#0B132B] opacity-50 hover:opacity-100 transition">
                  <ChevronDown size={40} />
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 4: KAMI ADALAH TIM MCL (FULL SCREEN) --- */}
        <div
            id="kami-adalah-tim"
            className="min-h-screen w-full flex items-center justify-center bg-white px-6 md:px-16 pt-20 pb-10 snap-start"
        >
          <div className="w-full max-w-7xl grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Gambar Placeholder */}
            <div className="bg-gray-200 rounded-3xl h-[450px] flex items-center justify-center border-2 border-gray-300 shadow-xl">
              <ImageIcon size={100} className="text-gray-400" />
            </div>

            {/* Right: Content */}
            <div>
              <div className="inline-block border-2 border-[#0B132B] rounded-full px-6 py-2 text-xs font-bold mb-8 uppercase tracking-wider">
                PENGEMBANGAN APLIKASI MULTIPLATFORM
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-[#0B132B] leading-tight">
                Kami Adalah Tim<br/>MCL
              </h2>
              <p className="text-gray-700 text-base leading-relaxed mb-10">
                Mahasiswa Teknik Informatika Universitas YARSI, angkatan 2023. Proyek ini dibuat
                sebagai tugas dari mata kuliah Peminatan Trek Pengembangan Aplikasi Multiplatform.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="text-4xl font-bold text-[#0B132B] mb-2">3</div>
                  <div className="text-sm text-gray-500 font-medium">Developer</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="text-4xl font-bold text-[#0B132B] mb-2">2023</div>
                  <div className="text-sm text-gray-500 font-medium">Angkatan</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="text-2xl font-bold text-[#0B132B] mb-2">Informatika</div>
                  <div className="text-sm text-gray-500 font-medium">Jurusan</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="bg-[#0B132B] text-white py-10 text-center text-sm snap-start">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-4">
              <img
                src="/images/LogoOrbitBlack.png"
                alt="Logo ORBIT"
                className="h-12 mx-auto mb-4 opacity-80"
              />
            </div>
            <p className="opacity-70 mb-2">
              ORBIT - Ormawa Berbasis Informasi Terpadu
            </p>
            <p className="opacity-60 text-xs">
              © 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
