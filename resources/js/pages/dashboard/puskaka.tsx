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
      <div className="space-y-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] bg-clip-text text-transparent">
            ⚡ Ringkasan Aktivitas Puskaka
          </h1>
        </motion.div>

        {/* STAT CARDS */}
        <div className="grid md:grid-cols-4 gap-5">
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
                className="text-4xl font-extrabold text-[#0B132B] relative z-10"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {s.value}
              </motion.h2>
              <p className="text-sm mt-2 text-[#0B132B]/70 font-semibold uppercase relative z-10">
                {s.title}
              </p>
              
              {/* Decorative gradient circle */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-xl" />
            </motion.div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-12 gap-6">
          <motion.div 
            className="col-span-7 bg-white shadow-lg rounded-xl p-6 relative overflow-hidden group"
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
            
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Jumlah Kegiatan per Ormawa
            </h3>

            <div className="h-64">
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
            className="col-span-5 bg-white shadow-lg rounded-xl p-6 relative overflow-hidden"
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
            
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Persentase Jenis Kegiatan
            </h3>

            <div className="flex gap-4">
              <motion.div 
                className="w-48 h-48"
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

              <div className="space-y-2">
                {pieData.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex items-center gap-2 text-sm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.span
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: pieColors[idx] }}
                      whileHover={{ scale: 1.3, rotate: 45 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-auto font-bold text-[#0B132B]">{item.value}%</span>
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
          <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white px-6 py-4 relative overflow-hidden">
            <motion.h3 
              className="text-lg font-bold flex items-center gap-2 relative z-10"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <span className="text-2xl">📋</span>
              Semua Program Kerja Ormawa
            </motion.h3>
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-[#0B132B]/10">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">No</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Ormawa</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Program Kerja</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Kegiatan</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Jenis</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Estimasi Anggaran</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Tanggal</th>
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
                      <td className="px-6 py-4 text-gray-600 font-medium">{idx + 1}</td>
                      <td className="px-6 py-4 font-bold text-[#0B132B] group-hover:text-blue-600 transition-colors">{pk.ormawa}</td>
                      <td className="px-6 py-4 text-gray-700">{pk.program_kerja}</td>
                      <td className="px-6 py-4 text-gray-700">{pk.kegiatan}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs rounded-full font-semibold shadow-sm">
                          {pk.jenis_kegiatan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-mono font-semibold">
                        Rp {parseInt(pk.estimasi_anggaran).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${
                          pk.status === 'Diajukan' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700' :
                          pk.status === 'Direview' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700' :
                          pk.status === 'Disetujui' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700' :
                          pk.status === 'Ditolak' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700' :
                          'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700'
                        }`}>
                          {pk.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{pk.created_at}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <span className="text-6xl mb-3 block">📭</span>
                        <p className="text-gray-400 italic font-medium">
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
        <motion.p 
          className="text-center text-xs text-gray-500 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </motion.p>
      </div>
    </DashboardLayout>
  );
}
