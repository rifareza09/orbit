import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ChevronDown, Search } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function DataOrmawaPage() {
  const [search, setSearch] = useState("");

  // ---------------------
  // DUMMY DATA ORMAWA
  // ---------------------
  const dataOrmawa = [
    { id: 1, nama: "Kongres KM", jenis: "Kongres", ketua: "-", anggota: 0, status: "Non-Aktif" },
    { id: 2, nama: "Kabinet Galasnava", jenis: "BEM", ketua: "Phalosa", anggota: 0, status: "Aktif" },
    { id: 3, nama: "Smarakaryadhwani", jenis: "UKM", ketua: "Divia Alya", anggota: 0, status: "Aktif" },
    { id: 4, nama: "LDK Kahfi", jenis: "UKM", ketua: "Annisa", anggota: 0, status: "Aktif" },
    { id: 5, nama: "Imasi", jenis: "UKM", ketua: "?", anggota: 0, status: "Aktif" },
    { id: 6, nama: "Voyage", jenis: "UKM", ketua: "?", anggota: 0, status: "Aktif" },
    { id: 7, nama: "YBBC", jenis: "UKM", ketua: "?", anggota: 0, status: "Aktif" },
    { id: 8, nama: "Kreasi", jenis: "UKM", ketua: "?", anggota: 0, status: "Non-Aktif" },
    { id: 9, nama: "LPM", jenis: "UKM", ketua: "?", anggota: 0, status: "Non-Aktif" },
    { id: 10, nama: "TDM", jenis: "UKM", ketua: "?", anggota: 0, status: "Non-Aktif" },
  ];

  const filtered = dataOrmawa.filter((o) =>
    o.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#0B132B]">
          Data Organisasi Mahasiswa
        </h1>

        {/* FILTER */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <button className="border bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow hover:bg-gray-50">
            Filter Tahun Kepengurusan <ChevronDown size={16} />
          </button>

          {/* Search */}
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

        {/* TABLE + STATISTIK */}
        <div className="flex gap-6">
          {/* TABLE */}
          <div className="flex-1 bg-white rounded-xl shadow p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#0B132B] text-white text-left">
                <tr>
                  <th className="px-4 py-3">No.</th>
                  <th className="px-4 py-3">Nama Organisasi</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Ketua</th>
                  <th className="px-4 py-3">Jumlah Anggota</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((org, index) => (
                  <tr
                    key={org.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{org.nama}</td>
                    <td className="px-4 py-3">{org.jenis}</td>
                    <td className="px-4 py-3">{org.ketua}</td>
                    <td className="px-4 py-3">
                      {String(org.anggota).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`${
                          org.status === "Aktif"
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }`}
                      >
                        {org.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/data-ormawa/detail/${org.id}`}
                        className="text-blue-600 underline text-sm"
                      >
                        Lihat
                      </Link>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-gray-500 py-6 italic"
                    >
                      Tidak ada data organisasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* STATISTIK */}
          <div className="w-64 bg-white p-6 rounded-xl shadow space-y-4">
            <h3 className="font-semibold text-lg">Statistik</h3>

            <div>
              <p className="text-gray-700">Total Organisasi Mahasiswa</p>
              <p className="text-3xl font-bold">
                {dataOrmawa.length}
              </p>
            </div>

            <div>
              <p className="text-gray-700">Ormawa Aktif</p>
              <p className="text-2xl font-bold text-green-600">
                {dataOrmawa.filter((o) => o.status === "Aktif").length}
              </p>
            </div>

            <div>
              <p className="text-gray-700">Ormawa Nonaktif</p>
              <p className="text-2xl font-bold text-red-600">
                {dataOrmawa.filter((o) => o.status !== "Aktif").length}
              </p>
            </div>

            <button className="w-full bg-[#0B132B] text-white px-4 py-2 rounded-lg hover:bg-[#0A1025] transition">
              Export Data
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </p>
      </div>
    </DashboardLayout>
  );
}
