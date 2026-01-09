import React, { useMemo } from 'react';
import { Image as ImageIcon } from "lucide-react";

// --- KONFIGURASI DATA ---
// Ganti path ini dengan logo UKM asli Anda nanti
const ukmLogos = [
  '/images/Logo-Yarsi.png', 
  '/images/Logo-Yarsi.png',
  '/images/Logo-Yarsi.png',
  '/images/Logo-Yarsi.png',
  '/images/Logo-Yarsi.png',
  '/images/Logo-Yarsi.png',
  '/images/Logo-Yarsi.png',
  '/images/Logo-Yarsi.png',
  '/images/Logo-Yarsi.png',
  '/images/Logo-Yarsi.png',
];

export default function OrbitAnimation() {
  
  // Fungsi Pseudo-Random: Menghasilkan angka acak (0.0 - 1.0) yang stabil berdasarkan input
  // Kita pakai ini agar posisi tidak berubah-ubah saat re-render (menghindari glitch)
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const orbitItems = useMemo(() => {
    return ukmLogos.map((logo, index) => {
      // Kita gunakan index sebagai "seed" untuk mengacak
      const r1 = seededRandom(index);       // Acak 1 (untuk Radius)
      const r2 = seededRandom(index + 100); // Acak 2 (untuk Durasi)
      const r3 = seededRandom(index + 600); // Acak 3 (untuk Posisi Awal)
      
      // 1. RADIUS ACAK (Jarak dari Matahari)
      // Min: 110px, Max: 230px (Variasi sangat luas)
      const minRadius = 150;
      const maxRadius = 300;
      const radius = minRadius + (r1 * (maxRadius - minRadius));

      // 2. KECEPATAN ACAK (Durasi Satu Putaran)
      // Antara 20 detik sampai 50 detik
      const minSpeed = 50;
      const maxSpeed = 100;
      const duration = minSpeed + (r2 * (maxSpeed - minSpeed));

      // 3. POSISI AWAL ACAK (Delay)
      // Mulai dari 0% sampai 100% lintasan (Benar-benar tersebar)
      const delay = -1 * (r3 * duration);

      // 4. UKURAN ACAK
      // Antara 35px sampai 60px
      const size = 40 + (seededRandom(index + 300) * 25);

      return {
        logo,
        radius: `${radius}px`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        size: size,
      };
    });
  }, []);

  return (
    <div className="relative flex items-center justify-center w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
      
      {/* 1. MATAHARI (LOGO YARSI - CENTER) */}
      <div className="absolute z-20 bg-white rounded-full p-4 shadow-[0_0_60px_rgba(255,255,255,0.6)] w-24 h-24 md:w-32 md:h-32 flex items-center justify-center border-4 border-white/30 backdrop-blur-sm">
        <img 
            src="/images/logo-yarsi.png" 
            alt="YARSI" 
            className="w-full h-full object-contain"
            onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
        />
        <div className="hidden font-bold text-[#0B132B] text-center text-xs">UNIV YARSI</div>
      </div>

      {/* 2. GARIS LINTASAN ORBIT (Hiasan Latar Belakang) */}
      {/* Dibuat beberapa lapis agar terlihat seperti tata surya */}
      <div className="absolute w-[35%] h-[35%] border border-dashed border-gray-400/30 rounded-full z-0 animate-spin-slow"></div>
      <div className="absolute w-[60%] h-[60%] border border-dashed border-gray-400/20 rounded-full z-0 animate-spin-reverse-slow"></div>
      <div className="absolute w-[85%] h-[85%] border border-dashed border-gray-400/10 rounded-full z-0 animate-spin-slow"></div>

      {/* 3. ITEM LOGO (PLANET) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {orbitItems.map((item, index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center"
            style={{
              // @ts-ignore (Mengirim variabel ke CSS)
              "--orbit-radius": item.radius,
              animation: `orbitRotate ${item.duration} linear infinite`,
              animationDelay: item.delay,
            }}
          >
            {/* WRAPPER LOGO */}
            <div 
              className="absolute bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 flex items-center justify-center hover:scale-125 hover:z-50 hover:bg-white transition-all cursor-pointer pointer-events-auto p-1.5"
              style={{
                width: `${item.size}px`,
                height: `${item.size}px`,
                // Dorong keluar sejauh radius acak tadi
                transform: `translateX(var(--orbit-radius))`,
                // Counter Rotate agar gambar tidak terbalik
                animation: `counterRotate ${item.duration} linear infinite`,
                animationDelay: item.delay,
              }}
            >
                <img 
                  src={item.logo} 
                  alt={`UKM ${index}`}
                  className="w-full h-full object-contain hover:rotate-12 transition-transform"
                  onError={(e) => e.currentTarget.style.display = 'none'} 
                />
                {!item.logo && <ImageIcon size={20} className="text-gray-400"/>}
            </div>
          </div>
        ))}
      </div>

      {/* --- CSS KHUSUS --- */}
      <style>{`
        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes counterRotate {
          from { transform: translateX(var(--orbit-radius)) rotate(0deg); }
          to { transform: translateX(var(--orbit-radius)) rotate(-360deg); }
        }

        .animate-spin-slow { animation: orbitRotate 120s linear infinite; }
        .animate-spin-reverse-slow { animation: orbitRotate 140s linear infinite reverse; }
      `}</style>
    </div>
  );
}