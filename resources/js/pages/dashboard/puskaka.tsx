import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";

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
        <h1 className="text-3xl font-semibold text-[#0B132B]">
          Ringkasan Aktivitas
        </h1>

        {/* STAT CARDS */}
        <div className="grid md:grid-cols-4 gap-5">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className={`${s.color} rounded-xl p-6 shadow text-center`}
            >
              <h2 className="text-4xl font-extrabold text-[#0B132B]">
                {s.value}
              </h2>
              <p className="text-sm mt-2 text-[#0B132B]/70 font-semibold uppercase">
                {s.title}
              </p>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 bg-white shadow rounded-xl p-6">
  <h3 className="text-lg font-semibold mb-4">
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
</div>


          {/* PIE CHART */}
          <div className="col-span-5 bg-white shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">
              Persentase Jenis Kegiatan
            </h3>

            <div className="flex gap-4">
              <div className="w-48 h-48">
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
              </div>

              <div className="space-y-2">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: pieColors[idx] }}
                    />
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TABLE PROGRAM KERJA */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="bg-[#0B132B] text-white px-6 py-4">
            <h3 className="text-lg font-bold">Semua Program Kerja Ormawa</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
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
                    <tr key={pk.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-600">{idx + 1}</td>
                      <td className="px-6 py-4 font-medium text-[#0B132B]">{pk.ormawa}</td>
                      <td className="px-6 py-4 text-gray-700">{pk.program_kerja}</td>
                      <td className="px-6 py-4 text-gray-700">{pk.kegiatan}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {pk.jenis_kegiatan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-mono">
                        Rp {parseInt(pk.estimasi_anggaran).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          pk.status === 'Diajukan' ? 'bg-yellow-100 text-yellow-700' :
                          pk.status === 'Direview' ? 'bg-blue-100 text-blue-700' :
                          pk.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                          pk.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {pk.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{pk.created_at}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-400 italic">
                      Belum ada program kerja yang terdaftar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-500 mt-10">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </p>
      </div>
    </DashboardLayout>
  );
}
