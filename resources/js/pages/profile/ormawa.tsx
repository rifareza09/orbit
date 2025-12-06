import React from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { Link } from '@inertiajs/react'

interface UnitInfo { nama: string; periode: string }
interface Pengurus { jabatan: string; nama: string; prodi: string; npm: string }
interface Jadwal { divisi: string; hari: string; tempat: string; pukul: string }

export default function OrmawaProfile({ unit, deskripsi, kepengurusan, jadwal }: { unit: UnitInfo; deskripsi: string; kepengurusan: Pengurus[]; jadwal: Jadwal[] }) {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        {/* Header Card */}
        <div className="bg-white border rounded-2xl shadow-sm p-5 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border grid place-items-center text-gray-400">🖼️</div>
            <div>
              <div className="text-xs text-gray-500">Unit Kegiatan Mahasiswa</div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#0B132B] leading-tight">{unit?.nama || 'UKM'}</h1>
              <div className="text-sm text-gray-500">Periode {unit?.periode}</div>
            </div>
          </div>
          <Link href="/dashboard" className="text-sm px-3 py-2 rounded border text-[#0B132B] hover:bg-gray-50">Kembali</Link>
        </div>

        {/* Deskripsi */}
        <section className="mt-6">
          <div className="text-sm font-medium text-[#0B132B] mb-2">Deskripsi</div>
          <div className="bg-white border rounded-xl p-4 text-sm text-gray-700">{deskripsi}</div>
        </section>

        {/* Struktur Kepengurusan */}
        <section className="mt-6">
          <div className="text-sm font-medium text-[#0B132B] mb-2">Struktur Kepengurusan</div>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0B132B] text-white">
                  <th className="text-left px-4 py-2">Jabatan</th>
                  <th className="text-left px-4 py-2">Nama</th>
                  <th className="text-left px-4 py-2">Prodi</th>
                  <th className="text-left px-4 py-2">NPM</th>
                  <th className="text-right px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kepengurusan?.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2">{row.jabatan}</td>
                    <td className="px-4 py-2">{row.nama}</td>
                    <td className="px-4 py-2">{row.prodi}</td>
                    <td className="px-4 py-2">{row.npm}</td>
                    <td className="px-4 py-2 text-right text-[#0B132B]">
                      <button className="text-xs px-2 py-1 rounded hover:bg-gray-100">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-2">
            <button className="w-8 h-8 rounded-full border grid place-items-center hover:bg-gray-50">+</button>
          </div>
        </section>

        {/* Jadwal Latihan */}
        <section className="mt-6">
          <div className="text-sm font-medium text-[#0B132B] mb-2">Jadwal Latihan</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jadwal?.map((j, i) => (
              <div key={i} className="rounded-xl border bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[#0B132B] font-medium">{j.divisi}</div>
                  <button className="text-gray-400 hover:text-gray-600" title="Hapus">🗑️</button>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="text-gray-500">Hari: </span>
                    <span>{j.hari}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tempat: </span>
                    <span>{j.tempat}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Pukul: </span>
                    <span>{j.pukul}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-dashed bg-white p-4 grid place-items-center text-gray-400">
              <button className="flex items-center gap-2 text-sm text-[#0B132B] hover:underline">
                <span className="text-lg">＋</span> Tambah Jadwal Latihan
              </button>
            </div>
          </div>
        </section>

        {/* Social Media (optional mock) */}
        <section className="mt-6">
          <div className="text-sm font-medium text-[#0B132B] mb-2">Social Media</div>
          <div className="bg-white border rounded-xl p-4 text-sm text-gray-700 space-y-1">
            <div className="font-medium">Instagram</div>
            <div>@smakarayi</div>
            <div>@swarsasmaka</div>
            <div>@cinemavigram</div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-8">©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI</div>
      </div>
    </DashboardLayout>
  )
}
