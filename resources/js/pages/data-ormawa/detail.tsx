import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Link, Head } from '@inertiajs/react';
import { Image as ImageIcon, ArrowLeft, PieChart as PieIcon, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// --- TIPE DATA ---
interface UnitInfo {
  nama: string;
  periode: string;
  logo_url?: string | null;
}

interface Pengurus {
  id: number;
  jabatan: string;
  nama: string;
  prodi: string;
  npm: string;
}

interface Jadwal {
  id: number;
  divisi: string;
  hari: string;
  tempat: string;
  pukul: string;
}

interface Proposal {
  id: number;
  nama_kegiatan: string;
  program_kerja: string;
  tanggal_pelaksanaan: string;
  status: string;
}

interface DetailProps {
  unit: UnitInfo;
  deskripsi: string;
  kepengurusan: Pengurus[];
  jadwal: Jadwal[];
  proposals?: Proposal[];
}

export default function DetailDataOrmawa({ unit, deskripsi, kepengurusan, jadwal, proposals = [] }: DetailProps) {

  // --- LOGIKA HITUNG STATISTIK UNTUK PIE CHART ---
  const stats = [
    { name: 'Diajukan', value: proposals.filter(p => p.status === 'Diajukan' || p.status === 'Direview').length, color: '#FBBF24' }, // Kuning
    { name: 'Disetujui', value: proposals.filter(p => p.status === 'Disetujui').length, color: '#10B981' }, // Hijau
    { name: 'Ditolak', value: proposals.filter(p => p.status === 'Ditolak').length, color: '#EF4444' }, // Merah
    { name: 'Revisi', value: proposals.filter(p => p.status === 'Direvisi').length, color: '#F97316' }, // Orange
  ];

  // Fungsi Export ke Excel
  const handleExport = () => {
    // Ambil ID dari URL atau props
    const urlParams = new URLSearchParams(window.location.search);
    const id = window.location.pathname.split('/').pop();

    window.location.href = `/data-ormawa/detail/${id}/export`;
  };

  return (
    <DashboardLayout>
      <Head title={`Detail - ${unit?.nama}`} />

      <div className="p-6 md:p-10 bg-[#F5F6FA] min-h-screen font-sans text-[#0B132B]">

        {/* HEADER CARD */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex items-center justify-between relative overflow-hidden mb-8">
          <div className="flex items-center gap-6 z-10">
            <div className="w-28 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
              {unit?.logo_url ? (
                <img src={unit.logo_url} alt="Logo" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <ImageIcon size={40} strokeWidth={1.5} />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500 mb-1">Detail Organisasi</div>
              <h1 className="text-3xl font-bold leading-tight">{unit?.nama || 'Nama Ormawa'}</h1>
              <div className="text-sm text-gray-500 mt-1 font-medium">Periode {unit?.periode || '-'}</div>
            </div>
          </div>

          {/* BUTTON GROUP (EXPORT & KEMBALI) */}
          <div className="z-10 flex items-center gap-3">
            {/* Tombol Export */}
            <button
                onClick={handleExport}
                className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
            >
                <Download size={16} />
                Export Data
            </button>

            {/* Tombol Kembali */}
            <Link
                href="/data-ormawa"
                className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"
            >
                <ArrowLeft size={16} />
                Kembali
            </Link>
          </div>
        </div>

        {/* --- LAYOUT UTAMA (GRID 2 KOLOM) --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* KOLOM KIRI (CONTENT UTAMA) - Lebar 2/3 */}
          <div className="xl:col-span-2 space-y-8">

            {/* 1. Deskripsi */}
            <section>
              <div className="bg-[#0B132B] text-white px-6 py-3 rounded-t-xl font-bold text-base shadow-sm">Deskripsi</div>
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl p-6 shadow-sm">
                <p className="text-gray-700 leading-relaxed text-justify text-sm">{deskripsi || "Tidak ada deskripsi."}</p>
              </div>
            </section>

            {/* 2. Kegiatan Sedang Diajukan */}
            <section>
              <h3 className="font-bold text-lg mb-4 text-[#0B132B]">Kegiatan Sedang Diajukan</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#0B132B] text-white">
                    <tr>
                      <th className="px-6 py-4 font-semibold w-16 text-center">No</th>
                      <th className="px-6 py-4 font-semibold">Nama Kegiatan</th>
                      <th className="px-6 py-4 font-semibold">Tanggal</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {proposals.length > 0 ? proposals.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3.5 text-center">{idx + 1}</td>
                        <td className="px-6 py-3.5 font-medium">{item.nama_kegiatan}</td>
                        <td className="px-6 py-3.5 text-gray-600">{item.tanggal_pelaksanaan}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${item.status === 'Disetujui' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/25' :
                              item.status === 'Ditolak' ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-red-500/25' :
                              item.status === 'Direvisi' ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-orange-500/25' :
                              item.status === 'Direview' ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-blue-500/25' :
                              item.status === 'Diajukan' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-amber-500/25' :
                              item.status === 'Selesai' ? 'bg-gradient-to-r from-purple-400 to-violet-500 text-white shadow-purple-500/25' :
                              'bg-gradient-to-r from-gray-300 to-gray-400 text-white'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">Belum ada kegiatan yang diajukan.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3. Struktur Kepengurusan */}
            <section>
              <h3 className="font-bold text-lg mb-4 text-[#0B132B]">Struktur Kepengurusan</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#0B132B] text-white">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Jabatan</th>
                      <th className="px-6 py-4 font-semibold">Nama</th>
                      <th className="px-6 py-4 font-semibold">Prodi</th>
                      <th className="px-6 py-4 font-semibold text-right">NPM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {kepengurusan?.length > 0 ? kepengurusan.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3.5 font-medium">{row.jabatan}</td>
                        <td className="px-6 py-3.5">{row.nama}</td>
                        <td className="px-6 py-3.5">{row.prodi}</td>
                        <td className="px-6 py-3.5 text-right font-mono text-gray-600">{row.npm}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">Data belum diisi.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Jadwal Latihan */}
            <section>
              <h3 className="font-bold text-lg mb-4 text-[#0B132B]">Jadwal Latihan</h3>
              {jadwal?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {jadwal.map((j, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                      <div className="bg-[#0B132B] px-5 py-3 border-b border-gray-100">
                        <h4 className="font-bold text-white text-sm">{j.divisi}</h4>
                      </div>
                      <div className="p-5 space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Hari</span><span className="font-semibold">{j.hari}</span></div>
                        <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Pukul</span><span className="font-semibold">{j.pukul}</span></div>
                        <div><span className="text-gray-500 block mb-1">Tempat</span><span className="font-semibold block">{j.tempat}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 italic">Belum ada jadwal.</div>
              )}
            </section>
          </div>

          {/* KOLOM KANAN (SIDEBAR STATISTIK) - Lebar 1/3 */}
          <div className="xl:col-span-1 space-y-6">

            {/* PIE CHART SECTION */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="font-bold text-[#0B132B] mb-6 flex items-center gap-2 border-b pb-4">
                <PieIcon size={20} /> Statistik Pengajuan
              </h3>

              <div className="h-64 w-full">
                {stats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                    <div className="bg-gray-100 p-4 rounded-full mb-3"><PieIcon size={32} className="opacity-20"/></div>
                    <p className="text-sm italic">Belum ada proposal diajukan</p>
                  </div>
                )}
              </div>

              {/* Angka Detail */}
              {stats.length > 0 && (
                <div className="mt-6 space-y-3">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></span>
                        <span className="text-gray-600 font-medium">{stat.name}</span>
                      </div>
                      <span className="font-bold text-[#0B132B] bg-gray-100 px-2 py-0.5 rounded">{stat.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-12 mb-2 font-medium">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
