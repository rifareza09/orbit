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

export default function PuskakaDashboard() {
  // Dummy Statistik
  const stats = [
    { title: "Program Kerja Terdaftar", value: 100, color: "bg-[#DDF4F4]" },
    { title: "Menunggu Review", value: 13, color: "bg-[#FFF1D7]" },
    { title: "Kegiatan Disetujui", value: 54, color: "bg-[#FFE8C7]" },
    { title: "Laporan Masuk", value: 20, color: "bg-[#DFF1FF]" },
  ];

  // Dummy Bar Chart
  const barData = [
    { name: "KONGRES", total: 22 },
    { name: "BEM", total: 14 },
    { name: "SMAKA", total: 11 },
    { name: "LDK", total: 20 },
    { name: "IMASI", total: 13 },
    { name: "VOYAGE", total: 9 },
    { name: "YBBC", total: 12 },
    { name: "KREASI", total: 10 },
    { name: "LPM", total: 8 },
    { name: "TDM", total: 7 },
  ];

  // Dummy Pie Chart
  const pieData = [
    { name: "Akademik", value: 25 },
    { name: "Sosial", value: 21 },
    { name: "Keagamaan", value: 17 },
    { name: "Kewirausahaan", value: 12 },
    { name: "Seni", value: 10 },
    { name: "Olahraga", value: 9 },
    { name: "Lainnya", value: 6 },
  ];

  const pieColors = [
    "#A7D0F5",
    "#FAD4AD",
    "#F4B5D1",
    "#C4E8C2",
    "#FFD27F",
    "#9DD6DF",
    "#D2C5F4",
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
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
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

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-500 mt-10">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </p>
      </div>
    </DashboardLayout>
  );
}
