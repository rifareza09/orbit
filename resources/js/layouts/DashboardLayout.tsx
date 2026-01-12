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
import NotificationBell from '@/components/NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.div
        initial={false}
        animate={{
          width: collapsed ? '5rem' : '16rem',
          x: isMobile && !mobileMenuOpen ? '-100%' : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white flex flex-col fixed lg:relative inset-y-0 left-0 z-50 shadow-2xl`}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center px-4 py-6 border-b border-white/10">
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute left-2 p-2 rounded-xl hover:bg-white/10 transition lg:hidden"
            >
              <X size={20} />
            </motion.button>
          )}
          <motion.img
            src="/images/Logo.png"
            alt="Orbit Logo"
            animate={{
              height: collapsed ? '2.5rem' : '3rem',
              width: collapsed ? '2.5rem' : 'auto'
            }}
            transition={{ duration: 0.3 }}
            className="object-contain max-w-[180px]"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-2 p-2 rounded-xl hover:bg-white/20 transition hidden lg:block bg-white/10"
          >
            <motion.div
              animate={{ rotate: collapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft size={20} />
            </motion.div>
          </motion.button>
        </div>

        {/* MENU */}
        <nav className="flex-1 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, idx) => (
            <Link key={item.name} href={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.15)' }}
                className="flex items-center gap-3 px-4 py-3.5 transition-all rounded-lg mx-2 my-1 relative overflow-hidden group"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#dc2626' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 bg-red-600 hover:bg-red-700 transition rounded-xl shadow-lg relative overflow-hidden group"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Power size={18} />
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-semibold"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </motion.button>

          <AnimatePresence>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                className="text-center text-xs mt-3"
              >
                © 2025 Orbit
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-y-auto w-full">

        {/* TOP NAVBAR */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white shadow-lg flex items-center justify-between px-4 lg:px-8 py-4 border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition lg:hidden"
            >
              <Menu size={24} className="text-[#0B132B]" />
            </motion.button>
            <motion.img
              whileHover={{ scale: 1.05, rotate: 5 }}
              src="/images/LogoYARSI.png"
              alt="Logo YARSI"
              className="h-10 lg:h-12 object-contain cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            {/* Notification Bell */}
            <NotificationBell />

            {/* User Profile dengan Foto */}
            <Link href="/profil" prefetch>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-3 lg:px-4 py-2 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-200 cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-bold text-[#0B132B] text-sm lg:text-base"
                  >
                    {user?.name}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs lg:text-sm text-gray-600 font-medium"
                  >
                    {user?.role?.toUpperCase()}
                  </motion.p>
                </div>

                {/* Foto Profil atau Icon Default */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {user?.logo_url || user?.profile_photo_url ? (
                    <div className="relative">
                      <img
                        src={user?.logo_url || user?.profile_photo_url}
                        alt={user?.name}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
