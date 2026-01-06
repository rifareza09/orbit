import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  FileCheck,
  Image,
  Trophy,
  ChevronLeft,
  ChevronRight,
  UserCircle2,
  Power,
  UsersRound,
  Archive,
  Menu,
  X
} from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { auth }: any = usePage().props;
  const user = auth?.user;
  const role = user?.role;

  // ----------------------------------------------------
  // MENU KHUSUS ADMIN / PUSKAKA
  // ----------------------------------------------------
  const puskakaMenu = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard/puskaka' },
    { name: 'Program Kerja', icon: <FileText size={20} />, href: '/program-kerja/indexPuskaka' },
    { name: 'Manajemen Kegiatan', icon: <FileText size={20} />, href: '/manajemen-kegiatan' },
    { name: 'Evaluasi & Laporan', icon: <FileText size={20} />, href: '/evaluasi-laporan' },
    { name: 'Data Ormawa', icon: <UserCircle2 size={20} />, href: '/data-ormawa' },
    { name: 'Arsip Tahunan', icon: <Archive size={20} />, href: '/puskaka/arsip-tahunan' },
  ];

  // ----------------------------------------------------
  // MENU UNTUK UKM / BEM / KONGRES
  // ----------------------------------------------------
  const normalMenu = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: 'Program Kerja', icon: <FileText size={20} />, href: '/program-kerja' },
    { name: 'Pengajuan Kegiatan', icon: <FileCheck size={20} />, href: '/pengajuan-kegiatan' },
    { name: 'Laporan Kegiatan', icon: <FileCheck size={20} />, href: '/laporan-kegiatan' },
    { name: 'Dokumentasi', icon: <Image size={20} />, href: '/dokumentasi' },
    { name: 'Prestasi', icon: <Trophy size={20} />, href: '/prestasi' },
  ];

  // Pilih menu berdasarkan role
  const menuItems = role === 'puskaka' ? puskakaMenu : normalMenu;

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`bg-[#0B132B] text-white flex flex-col transition-all duration-300 fixed lg:relative inset-y-0 left-0 z-50 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          isMobile && !mobileMenuOpen ? '-translate-x-full' : 'translate-x-0'
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center px-4 py-4 border-b border-white/10">
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute left-2 p-2 rounded-lg hover:bg-white/10 transition lg:hidden"
            >
              <X size={20} />
            </button>
          )}
          <img
            src="/images/Logo.png"
            alt="Orbit Logo"
            className={`transition-all duration-300 object-contain ${
              collapsed ? 'h-10 w-10' : 'h-12 w-auto max-w-[180px]'
            }`}
          />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-2 p-2 rounded-lg hover:bg-white/10 transition hidden lg:block"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition"
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 bg-red-600 hover:bg-red-700 transition rounded-lg"
          >
            <Power size={18} />
            {!collapsed && <span>Logout</span>}
          </button>

          {!collapsed && (
            <p className="text-center text-xs mt-3 opacity-70">© 2025 Orbit</p>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto w-full">

        {/* TOP NAVBAR */}
        <div className="w-full bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 py-3 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition lg:hidden"
            >
              <Menu size={24} className="text-[#0B132B]" />
            </button>
            <img
              src="/images/LogoYARSI.png"
              alt="Logo YARSI"
              className="h-8 lg:h-10 object-contain"
            />
          </div>

          <Link href="/profil" prefetch className="flex items-center gap-2 lg:gap-3 bg-white px-2 lg:px-4 py-2 rounded-full shadow-sm hover:shadow-md transition">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-[#0B132B] text-sm lg:text-base">{user?.name}</p>
              <p className="text-xs lg:text-sm text-gray-500">{user?.role?.toUpperCase()}</p>
            </div>
            <UserCircle2 size={32} className="text-[#0B132B] lg:w-10 lg:h-10" />
          </Link>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
