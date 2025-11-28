import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Search, ChevronDown } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function ManajemenKegiatan() {
  const [search, setSearch] = useState("");

  // -----------------------------
  // DUMMY DATA
  // -----------------------------
  const kegiatan = [
    { id: 1, nama: "Sesi 1: Dasar-dasar vocal Pitching dan Breathing", ormawa: "Sema FTI", jenis: "Akademik", tanggal: "22/11/2025", status: "Review" },
    { id: 2, nama: "Seminar Kesehatan", ormawa: "Sema Psikologi", jenis: "Akademik", tanggal: "01/01/2001", status: "Ditolak" },
    { id: 3, nama: "Seminar Kesehatan", ormawa: "Sema Psikologi", jenis: "Akademik", tanggal: "01/01/2001", status: "Disetujui" },
    { id: 4, nama: "Seminar Kesehatan", ormawa: "Sema Psikologi", jenis: "Akademik", tanggal: "01/01/2001", status: "Revisi" },
    { id: 5, nama: "Seminar Kesehatan", ormawa: "Sema Psikologi", jenis: "Akademik", tanggal: "01/01/2001", status: "Review" },
    { id: 6, nama: "Seminar Kesehatan", ormawa: "Sema Psikologi", jenis: "Akademik", tanggal: "01/01/2001", status: "Ditolak" },
    { id: 7, nama: "Seminar Kesehatan", ormawa: "Sema Psikologi", jenis: "Akademik", tanggal: "01/01/2001", status: "Disetujui" },
    { id: 8, nama: "Seminar Kesehatan", ormawa: "Sema Psikologi", jenis: "Akademik", tanggal: "01/01/2001", status: "Revisi" },
  ];

  const statusBadge = (status: string) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full text-white";
    switch (status) {
      case "Review":
        return `${base} bg-yellow-500`;
      case "Disetujui":
        return `${base} bg-green-600`;
      case "Ditolak":
        return `${base} bg-red-600`;
      case "Revisi":
        return `${base} bg-orange-500`;
      default:
        return `${base} bg-gray-400`;
    }
  };

  const filtered = kegiatan.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#0B132B]">
          Manajemen Kegiatan
        </h1>

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50">
              Filter Tahun Akademik <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50">
              Filter Ormawa <ChevronDown size={16} />
            </button>
          </div>

          {/* SEARCH INPUT */}
          <div className="flex items-center bg-white border px-4 py-2 rounded-lg shadow-sm w-72 gap-2">
            <input
              type="text"
              placeholder="Cari nama kegiatan..."
              className="w-full outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={20} className="text-gray-500" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* TABLE */}
          <div className="col-span-9 bg-white rounded-xl shadow p-0 overflow-hidden">
            <div className="overflow-y-auto max-h-[600px] scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#0B132B] text-white">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3 text-left">Nama Kegiatan</th>
                    <th className="px-4 py-3 text-left">Ormawa</th>
                    <th className="px-4 py-3 text-left">Jenis</th>
                    <th className="px-4 py-3 text-left">Tanggal</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left"></th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="text-center py-3">{index + 1}</td>
                      <td className="px-4 py-3">{item.nama}</td>
                      <td className="px-4 py-3">{item.ormawa}</td>
                      <td className="px-4 py-3">{item.jenis}</td>
                      <td className="px-4 py-3">{item.tanggal}</td>
                      <td className="px-4 py-3">
                        <span className={statusBadge(item.status)}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                        href={`/manajemen-kegiatan/detail/${item.id}`}
                             className="text-blue-600 underline text-sm"
                                >
                                Lihat
                            </Link>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* STATISTICS PANEL */}
          <div className="col-span-3">
            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <h2 className="font-semibold text-lg">Statistik</h2>

              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span>Total Pengajuan</span>
                  <strong>48</strong>
                </p>
                <p className="flex justify-between">
                  <span>Perlu Direview</span>
                  <strong>18</strong>
                </p>
                <p className="flex justify-between">
                  <span>Disetujui</span>
                  <strong>21</strong>
                </p>
                <p className="flex justify-between">
                  <span>Ditolak</span>
                  <strong>9</strong>
                </p>
              </div>

              <button className="w-full bg-[#0B132B] text-white py-2 rounded-lg hover:bg-[#0A1025] transition">
                Export Data
              </button>

              <button className="w-full border border-[#0B132B] text-[#0B132B] py-2 rounded-lg hover:bg-gray-100 transition">
                Lihat Kalender Kegiatan
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </p>
      </div>
    </DashboardLayout>
  );
}
