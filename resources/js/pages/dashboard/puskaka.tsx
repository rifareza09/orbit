import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { motion } from "framer-motion";

import {
  BarChart,
  Bar,
  CartesianGrid,
    XAxis,
    Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface ProgramKerja {
  id: number;
  program_kerja: string;
  kegiatan: string;
  deskripsi_kegiatan: string;
  jenis_kegiatan: string;
  estimasi_anggaran: string;
  status: string;
  ormawa: string;
  created_at: string;
}

interface Stat {
  title: string;
  value: number;
  color: string;
}

interface BarChartData {
  name: string;
  total: number;
}

interface PieChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface Props {
  stats: Stat[];
  barData: BarChartData[];
  pieData: PieChartData[];
  programKerjas: ProgramKerja[];
}

export default function PuskakaDashboard({ stats = [], barData = [], pieData = [], programKerjas = [] }: Props) {
  const pieColors = [
    "#A7D0F5",
    "#FAD4AD",
    "#F4B5D1",
    "#C4E8C2",
    "#FFD27F",
    "#9DD6DF",
    "#D2C5F4",
    "#B5E7A0",
    "#FFB6C1",
    "#87CEEB",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-[#0B132B] to-[#1C2541] bg-clip-text text-transparent">
            <span className="text-[#0B132B]">⚡</span> Ringkasan Aktivitas Puskaka
          </h1>
        </motion.div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {stats.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              whileHover={{
                y: -8,
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              className={`${s.color} rounded-xl p-6 shadow-lg text-center relative overflow-hidden group cursor-pointer`}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <motion.h2
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B132B] relative z-10"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {s.value}
              </motion.h2>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-[#0B132B]/70 font-semibold uppercase relative z-10">
                {s.title}
              </p>

              {/* Decorative gradient circle */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-xl" />
            </motion.div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <motion.div
            className="lg:col-span-7 bg-white shadow-lg rounded-xl p-4 sm:p-6 relative overflow-hidden group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{
              boxShadow: "0 20px 40px rgba(11, 19, 43, 0.15)",
              transition: { duration: 0.3 }
            }}
          >
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B132B] via-purple-500 to-[#0B132B]" />

            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📊</span>
              Jumlah Kegiatan per Ormawa
            </h3>

            <div className="h-48 sm:h-56 lg:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                >
                  {/* GRADIENT */}
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9CD878" stopOpacity={1} />
                      <stop offset="100%" stopColor="#7FBA5B" stopOpacity={0.9} />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow
                        dx="0"
                        dy="4"
                        stdDeviation="6"
                        floodColor="#00000020"
                      />
                    </filter>
                  </defs>

                  {/* OPTIONAL GRID */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                  {/* X Axis */}
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#555", fontSize: 12 }}
                    tickMargin={10}
                  />

                  {/* Tooltip */}
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    contentStyle={{
                      borderRadius: "10px",
                      background: "white",
                      borderColor: "#E5E7EB",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                  />

                  {/* BAR */}
                  <Bar
                    dataKey="total"
                    fill="url(#colorBar)"
                    radius={[8, 8, 0, 0]}
                    barSize={45}
                    style={{ filter: "url(#shadow)" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* PIE CHART */}
          <motion.div
            className="lg:col-span-5 bg-white shadow-lg rounded-xl p-4 sm:p-6 relative overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{
              boxShadow: "0 20px 40px rgba(11, 19, 43, 0.15)",
              transition: { duration: 0.3 }
            }}
          >
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🎯</span>
              Persentase Jenis Kegiatan
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.div
                className="w-full sm:w-40 lg:w-48 h-40 sm:h-40 lg:h-48 mx-auto sm:mx-0"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData as any}
                      dataKey="value"
                      outerRadius="80%"
                      innerRadius="50%"
                      paddingAngle={5}
                    >
                      {pieData.map((_, idx) => (
                        <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              <div className="space-y-1.5 sm:space-y-2 flex-1">
                {pieData.map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-2 text-xs sm:text-sm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.span
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: pieColors[idx] }}
                      whileHover={{ scale: 1.3, rotate: 45 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="font-medium flex-1">{item.name}</span>
                    <span className="font-bold text-[#0B132B]">{item.value}%</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* TABLE PROGRAM KERJA */}
        <motion.div
          className="bg-white shadow-lg rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white px-4 sm:px-6 py-3 sm:py-4 relative overflow-hidden">
            <motion.h3
              className="text-base sm:text-lg font-bold flex items-center gap-2 relative z-10"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <span className="text-xl sm:text-2xl">📋</span>
              Semua Program Kerja Ormawa
            </motion.h3>

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-xs sm:text-sm min-w-[800px]">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-[#0B132B]/10">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700 whitespace-nowrap">No</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Ormawa</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Program Kerja</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Kegiatan</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Jenis</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Estimasi Anggaran</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {programKerjas.length > 0 ? (
                  programKerjas.map((pk, idx) => (
                    <motion.tr
                      key={pk.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all cursor-pointer group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.03 }}
                      whileHover={{
                        scale: 1.01,
                        boxShadow: "0 4px 12px rgba(11, 19, 43, 0.08)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 font-medium whitespace-nowrap">{idx + 1}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-[#0B132B] group-hover:text-blue-600 transition-colors whitespace-nowrap">{pk.ormawa}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">{pk.program_kerja}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">{pk.kegiatan}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs rounded-full font-semibold shadow-sm">
                          {pk.jenis_kegiatan}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 font-mono font-semibold whitespace-nowrap">
                        Rp {parseInt(pk.estimasi_anggaran).toLocaleString('id-ID')}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`px-2 sm:px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${
                          pk.status === 'Disetujui' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/25' :
                          pk.status === 'Ditolak' ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-red-500/25' :
                          pk.status === 'Direvisi' ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-orange-500/25' :
                          pk.status === 'Direview' ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-blue-500/25' :
                          pk.status === 'Diajukan' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-amber-500/25' :
                          pk.status === 'Selesai' ? 'bg-gradient-to-r from-purple-400 to-violet-500 text-white shadow-purple-500/25' :
                          'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
                        }`}>
                          {pk.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-500 text-xs whitespace-nowrap">{pk.created_at}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-3 sm:px-6 py-8 sm:py-12 text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <span className="text-4xl sm:text-6xl mb-2 sm:mb-3 block">📭</span>
                        <p className="text-gray-400 italic font-medium text-sm sm:text-base">
                          Belum ada program kerja yang terdaftar
                        </p>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FOOTER */}
        <motion.div
          className="text-center text-sm mt-10 py-6 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-gray-400">
            © 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
