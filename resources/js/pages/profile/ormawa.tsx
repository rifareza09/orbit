import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Link, Head } from '@inertiajs/react';
import { Image as ImageIcon, Edit2 } from 'lucide-react';

interface UnitInfo { nama: string; periode: string }
interface Pengurus { id: number; jabatan: string; nama: string; prodi: string; npm: string }
interface Jadwal { id: number; divisi: string; hari: string; tempat: string; pukul: string }

interface Props {
  unit: UnitInfo;
  deskripsi: string;
  kepengurusan: Pengurus[];
  jadwal: Jadwal[];
}

export default function OrmawaProfile({ unit, deskripsi, kepengurusan, jadwal }: Props) {
  return (
    <DashboardLayout>
      
      <div className="p-6 md:p-10 bg-[#F5F6FA] min-h-screen font-sans text-[#0B132B]">
        
        {/* 1. Header Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-6 z-10">
            {/* Logo Placeholder */}
            <div className="w-28 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
              <ImageIcon size={40} strokeWidth={1.5} />
            </div>
            
            {/* Info Unit */}
            <div>
              <div className="text-sm font-semibold text-gray-500 mb-1">Unit Kegiatan Mahasiswa</div>
              <h1 className="text-3xl font-bold leading-tight">{unit?.nama || 'Nama Organisasi'}</h1>
              <div className="text-sm text-gray-500 mt-1 font-medium">Periode {unit?.periode}</div>
            </div>
          </div>

          {/* Tombol Edit Profil */}
          <button className="z-10 bg-[#0B132B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152042] transition flex items-center gap-2 shadow-md">
            <Edit2 size={16} />
            Edit Profil
          </button>
        </div>

        {/* 2. Deskripsi Section */}
        <section className="mt-8">
          <div className="bg-[#0B132B] text-white px-6 py-3 rounded-t-xl font-bold text-base shadow-sm">
            Deskripsi
          </div>
          <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl p-6 shadow-sm">
            <p className="text-gray-700 leading-relaxed text-justify text-sm">
              {deskripsi || "Belum ada deskripsi yang ditambahkan."}
            </p>
          </div>
        </section>

        {/* 3. Struktur Kepengurusan */}
        <section className="mt-8">
          <h3 className="font-bold text-lg mb-4 text-[#0B132B]">Struktur Kepengurusan</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#0B132B] text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold w-1/4">Jabatan</th>
                  <th className="px-6 py-4 font-semibold w-1/3">Nama</th>
                  <th className="px-6 py-4 font-semibold">Prodi</th>
                  <th className="px-6 py-4 font-semibold text-right">NPM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {kepengurusan.length > 0 ? (
                  kepengurusan.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3.5 font-medium">{row.jabatan}</td>
                      <td className="px-6 py-3.5">{row.nama}</td>
                      <td className="px-6 py-3.5">{row.prodi}</td>
                      <td className="px-6 py-3.5 text-right font-mono text-gray-600">{row.npm}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">
                      Data kepengurusan belum ditambahkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Jadwal Latihan */}
        <section className="mt-8">
          <h3 className="font-bold text-lg mb-4 text-[#0B132B]">Jadwal Latihan</h3>
          
          {jadwal.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jadwal.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group">
                  {/* Header Card (Dark) */}
                  <div className="bg-[#0B132B] px-5 py-3 border-b border-gray-100">
                    <h4 className="font-bold text-white text-sm">{j.divisi}</h4>
                  </div>
                  {/* Body Card */}
                  <div className="p-5 space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Hari</span>
                      <span className="font-semibold text-gray-800">{j.hari}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Pukul</span>
                      <span className="font-semibold text-gray-800">{j.pukul}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block mb-1">Tempat</span>
                      <span className="text-gray-800 block leading-tight">{j.tempat}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 italic">
              Belum ada jadwal latihan.
            </div>
          )}
        </section>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-12 mb-2 font-medium">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}