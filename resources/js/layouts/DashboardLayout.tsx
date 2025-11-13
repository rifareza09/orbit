import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  FileCheck,
  Image,
  Trophy,
  ChevronLeft,
  ChevronRight,
  UserCircle2,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: 'Program Kerja', icon: <FileText size={20} />, href: '/program-kerja' },
    { name: 'Pengajuan Kegiatan', icon: <FileCheck size={20} />, href: '/pengajuan-kegiatan' },
    { name: 'Laporan Kegiatan', icon: <FileCheck size={20} />, href: '/laporan-kegiatan' },
    { name: 'Dokumentasi', icon: <Image size={20} />, href: '/dokumentasi' },
    { name: 'Prestasi', icon: <Trophy size={20} />, href: '/prestasi' },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-[#0B132B] text-white flex flex-col transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header Sidebar */}
        <div className="relative flex items-center justify-center px-4 py-4 border-b border-white/10">
          <img
            src="/images/logo.png"
            alt="Orbit Logo"
            className={`transition-all duration-300 object-contain ${
              collapsed ? 'w-10' : 'w-32'
            }`}
          />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-2 p-2 rounded-lg hover:bg-white/10 transition"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/10 text-center text-sm opacity-75">
          {!collapsed && '© 2025 Orbit'}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
        {/* NAVBAR di atas main */}
        <div className="w-full bg-white shadow-sm flex items-center justify-between px-8 py-3 border-b">
          {/* Logo YARSI */}
          <img
            src="/images/LogoYARSI.png"
            alt="Logo YARSI"
            className="h-10 object-contain"
          />

          {/* Profil baru */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition">
            <div className="text-right">
              <p className="font-medium text-[#0B132B] leading-tight">LDK</p>
              <p className="text-sm text-gray-500 leading-tight">UKM</p>
            </div>
            <UserCircle2 size={40} className="text-[#0B132B]" />
          </div>
        </div>

        {/* Isi halaman */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
