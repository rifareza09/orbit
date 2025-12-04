import React, { useEffect, useMemo, useRef, useState } from 'react';
import FancyBackground from '@/components/FancyBackground';
import { Link } from '@inertiajs/react';

interface PhotoItem {
  id: number;
  nama_kegiatan: string;
  tanggal?: string | null;
  foto_url: string | null;
}

interface ScheduleItem {
  id: number;
  kegiatan: string;
  waktu?: string | null;
}

interface ShowcaseItem {
  user: { id: number; name: string; username?: string; role?: string };
  photos: PhotoItem[];
  schedules: ScheduleItem[];
}

const DUMMY_IMAGES = [
  'https://images.unsplash.com/photo-1515165562835-c4c7b0d93a66?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509228468518-12fbb85f798f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520975922215-cdc962e34f01?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520975592531-dc59e0e63f5e?q=80&w=800&auto=format&fit=crop',
];

function getPlaceholder(index: number) {
  return DUMMY_IMAGES[index % DUMMY_IMAGES.length];
}

export default function LandingPage({ showcases, canRegister }: { showcases: ShowcaseItem[]; canRegister: boolean }) {
  // Reveal on scroll (IntersectionObserver)
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = containerRef.current ?? document;
    const els = Array.from(
      (root instanceof Document ? root : root.ownerDocument)!.querySelectorAll('[data-reveal]'),
    ) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Helper: generate pleasant dummy schedules when none present
  const withDummySchedules = useMemo(() => {
    const presets = [
      { kegiatan: 'Latihan Rutin', waktu: 'Setiap Selasa 19:00' },
      { kegiatan: 'Briefing Mingguan', waktu: 'Setiap Jumat 16:00' },
      { kegiatan: 'Sparring/Simulasi', waktu: 'Minggu ke-2 09:00' },
    ];
    return showcases.map((sc, idx) => {
      if (sc.schedules && sc.schedules.length > 0) return sc;
      const dummy = presets.map((p, i) => ({ id: i + 1, ...p }));
      return { ...sc, schedules: dummy };
    });
  }, [showcases]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-white to-gray-50 relative">
      <FancyBackground className="absolute inset-0 -z-10" />
      {/* Subtle gradient blobs */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-56 w-56 rounded-full bg-[#0B132B]/10 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute top-40 -right-10 h-56 w-56 rounded-full bg-[#5BC0BE]/10 blur-3xl animate-pulse" />
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#0B132B] font-bold text-xl">Orbit</span>
            <span className="text-sm text-gray-500">Etalase Ormawa</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-[#0B132B] hover:underline">Home</Link>
            <Link href="/ormawa" className="text-sm text-[#0B132B] hover:underline">Daftar Ormawa</Link>
            <Link href="/kalender" className="text-sm text-[#0B132B] hover:underline">Kalender Kegiatan</Link>
            <Link href="/tentang" className="text-sm text-[#0B132B] hover:underline">Tentang Orbit</Link>
          </nav>
          <div className="flex items-center gap-3">
            {canRegister && (
              <Link href="/register" className="text-sm px-3 py-2 rounded text-[#0B132B] hover:bg-gray-100">Daftar</Link>
            )}
            <Link href="/login" className="bg-[#0B132B] text-white text-sm px-4 py-2 rounded hover:bg-[#1C2541]">Masuk</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div data-reveal className="opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#0B132B] tracking-tight">Etalase Ormawa Kampus</h1>
            <p className="text-gray-600 mt-2">Lihat dokumentasi kegiatan dan jadwal latihan terbaru dari setiap Ormawa.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="inline-flex items-center rounded-lg bg-[#0B132B] text-white text-sm px-4 py-2 hover:bg-[#1C2541]">Masuk</Link>
            {canRegister && (
              <Link href="/register" className="inline-flex items-center rounded-lg border border-[#0B132B] text-[#0B132B] text-sm px-4 py-2 hover:bg-gray-100">Daftar</Link>
            )}
          </div>
        </div>
      </section>

      {/* Showcases Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {withDummySchedules.map((sc, idx) => (
            <TiltCard key={sc.user.id} index={idx}>
              {/* Card Header */}
              <div className="px-5 py-4 bg-[#0B132B] text-white flex items-center justify-between">
                <div>
                  <div className="font-semibold text-base">{sc.user.name}</div>
                  {sc.user.username && (
                    <div className="text-xs opacity-80">@{sc.user.username}</div>
                  )}
                </div>
                {sc.user.role && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">{sc.user.role}</span>
                )}
              </div>

              {/* Photos */}
              <div className="p-5">
                {/* Interactive slider for documentation */}
                <DocumentationSlider photos={sc.photos} />
              </div>

              {/* Schedules */}
              <div className="px-5 pb-5">
                <div className="font-medium text-[#0B132B] mb-2">Jadwal Latihan / Kegiatan</div>
                <ul className="space-y-2">
                  {sc.schedules.map((s) => (
                    <li key={s.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-700">{s.kegiatan}</span>
                      <span className="text-xs text-gray-500">{s.waktu || '-'}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5">
                <Link
                  href="/login"
                  className="w-full inline-flex justify-center items-center rounded-lg bg-[#0B132B] text-white text-sm px-4 py-2 hover:bg-[#1C2541]"
                >
                  Masuk untuk melihat detail
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-500">© {new Date().getFullYear()} Orbit. Dibangun dengan Laravel + React + Inertia.</div>
      </footer>
    </div>
  );
}

function DocumentationSlider({ photos }: { photos: PhotoItem[] }) {
  const items = photos.length > 0
    ? photos.map((p, i) => ({
        key: p.id,
        src: p.foto_url || getPlaceholder(i),
        alt: p.nama_kegiatan,
        caption: p.nama_kegiatan,
      }))
    : Array.from({ length: 4 }).map((_, i) => ({
        key: i,
        src: getPlaceholder(i),
        alt: 'Placeholder',
        caption: 'Kegiatan Ormawa',
      }));

  const [index, setIndex] = useState(0);

  // Auto-play every 4 seconds
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const [progress, setProgress] = useState(0); // 0 - 100

  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = () => {
    stop();
    progressRef.current = 0;
    setProgress(0);
    timerRef.current = window.setInterval(() => {
      progressRef.current += 100 / 40; // ~4s to reach 100
      if (progressRef.current >= 100) {
        progressRef.current = 0;
        setIndex((prev) => (prev + 1) % items.length);
      }
      setProgress(progressRef.current);
    }, 100);
  };

  useEffect(() => {
    start();
    return stop;
  }, [items.length, index]);

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="relative" onMouseEnter={stop} onMouseLeave={start}>
      {/* Slider viewport */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
        {items.map((it, i) => (
          <img
            key={it.key}
            src={it.src}
            alt={it.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        {/* Caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="text-white text-sm">{items[index]?.caption}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <button onClick={prev} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60">‹</button>
        <button onClick={next} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60">›</button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div className="h-1 bg-[#5BC0BE] transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>

      {/* Dots */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-[#0B132B]' : 'bg-gray-300'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function TiltCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * -6; // tilt range
    const ry = (x - 0.5) * 6;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  };
  return (
    <div
      data-reveal
      className="opacity-0 translate-y-4 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${Math.min(index * 60, 240)}ms` }}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden transition will-change-transform hover:shadow-lg"
      >
        {children}
      </div>
    </div>
  );
}
