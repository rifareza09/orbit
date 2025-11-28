import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Search, ChevronDown } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function EvaluasiLaporanPage() {
  const [search, setSearch] = useState("");

  // -------------------------
  // DUMMY DATA
  // -------------------------
  const laporan = [
    {
      id: 1,
      nama: "Seminar Kesehatan Nasional",
      ormawa: "Sema FTI",
      jenis: "Akademik",
      tanggal: "22/11/2025",
      status: "Menunggu Review",
    },
    {
      id: 2,
      nama: "Pelatihan Kepemimpinan",
      ormawa: "Sema Psikologi",
      jenis: "Sosial",
      tanggal: "10/11/2025",
      status: "Direview",
    },
    {
      id: 3,
      nama: "Lomba Desain Poster",
      ormawa: "YBBC",
      jenis: "Seni",
      tanggal: "05/10/2025",
      status: "Selesai",
    },
    {
      id: 4,
      nama: "Workshop Karier",
      ormawa: "Kongres",
      jenis: "Kewirausahaan",
      tanggal: "20/09/2025",
      status: "Selesai",
    },
    {
      id: 5,
      nama: "Bakti Sosial Peduli Sesama",
      ormawa: "SMAKA",
      jenis: "Sosial",
      tanggal: "14/09/2025",
      status: "Direview",
    },
  ];

  const filtered = laporan.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case "Menunggu Review":
        return `${base} bg-yellow-500 text-white`;
      case "Direview":
        return `${base} bg-blue-500 text-white`;
      case "Selesai":
        return `${base} bg-green-600 text-white`;
      default:
        return `${base} bg-gray-400 text-white`;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-[#0B132B]">
          Evaluasi & Laporan
        </h1>

        {/* STAT CARDS */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-[#E8F8F8] p-6 rounded-xl text-center shadow">
            <h2 className="text-4xl font-bold">100</h2>
            <p className="text-xs font-semibold mt-2 uppercase">
              Kegiatan Terdaftar
            </p>
          </div>
          <div className="bg-[#FFF3D6] p-6 rounded-xl text-center shadow">
            <h2 className="text-4xl font-bold">13</h2>
            <p className="text-xs font-semibold mt-2 uppercase">Laporan Masuk</p>
          </div>
          <div className="bg-[#FFEAC5] p-6 rounded-xl text-center shadow">
            <h2 className="text-4xl font-bold">54</h2>
            <p className="text-xs font-semibold mt-2 uppercase">
              Laporan Direview
            </p>
          </div>
          <div className="bg-[#DEF3FF] p-6 rounded-xl text-center shadow">
            <h2 className="text-4xl font-bold">20</h2>
            <p className="text-xs font-semibold mt-2 uppercase">
              Laporan Selesai
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap justify-between gap-4 items-center">
          <div className="flex items-center gap-4">
            <button className="border rounded-lg px-4 py-2 flex items-center gap-2 bg-white shadow hover:bg-gray-50">
              Filter Tahun Akademik <ChevronDown size={16} />
            </button>

            <button className="border rounded-lg px-4 py-2 flex items-center gap-2 bg-white shadow hover:bg-gray-50">
              Filter Ormawa <ChevronDown size={16} />
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="flex items-center bg-white border px-4 py-2 rounded-lg shadow gap-2 w-72">
            <input
              type="text"
              className="outline-none w-full"
              placeholder="Cari nama kegiatan"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={20} className="text-gray-600" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#0B132B] text-white text-left">
              <tr>
                <th className="px-4 py-3">No.</th>
                <th className="px-4 py-3">Nama Kegiatan</th>
                <th className="px-4 py-3">Ormawa</th>
                <th className="px-4 py-3">Jenis</th>
                <th className="px-4 py-3">Tanggal Pelaksanaan</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
  {filtered.map((item, index) => (
    <tr
      key={item.id}
      className="border-b hover:bg-gray-50 transition"
    >
      <td className="px-4 py-3">{index + 1}</td>
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
          href={`/evaluasi-laporan/detail/${item.id}`}
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

        <p className="text-center text-xs text-gray-500 mt-8">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </p>
      </div>
    </DashboardLayout>
  );
}
