import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ChevronDown, Search, Plus, X } from "lucide-react";
import { Link, usePage, router } from "@inertiajs/react";

interface Ormawa {
  id: number;
  nama: string;
  jenis: string;
  ketua: string;
  anggota: number;
  status: string;
}

export default function DataOrmawaPage() {
  const { dataOrmawa = [], stats = { total: 0, aktif: 0, nonaktif: 0 } } = usePage<{
    dataOrmawa?: Ormawa[];
    stats?: {
      total: number;
      aktif: number;
      nonaktif: number;
    };
  }>().props;
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'ukm',
  });

  const filtered = dataOrmawa.filter((o) =>
    o.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOrmawa = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/ormawa/create', formData, {
      onSuccess: () => {
        setShowModal(false);
        setFormData({ name: '', username: '', password: '', role: 'ukm' });
      },
      onError: () => {
        alert('Gagal menambah ormawa');
      }
    });
  };

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

          <div className="flex gap-3">
            {/* Tombol Tambah Ormawa */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#0B132B] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-[#1C2541] transition"
            >
              <Plus size={18} />
              Tambah Ormawa
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
                {stats.total}
              </p>
            </div>

            <div>
              <p className="text-gray-700">Ormawa Aktif</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.aktif}
              </p>
            </div>

            <div>
              <p className="text-gray-700">Ormawa Nonaktif</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.nonaktif}
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

        {/* MODAL TAMBAH ORMAWA */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#0B132B]">Tambah Ormawa Baru</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddOrmawa} className="space-y-4">
                {/* Nama Organisasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Organisasi
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: LDK Kahfi"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                    required
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Contoh: ldk"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimal 8 karakter"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                    required
                  />
                </div>

                {/* Jenis Ormawa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Ormawa
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                  >
                    <option value="ukm">UKM</option>
                    <option value="bem">BEM</option>
                    <option value="kongres">Kongres</option>
                  </select>
                </div>

                {/* Tombol */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#0B132B] text-white py-2 rounded-lg hover:bg-[#1C2541] transition"
                  >
                    Tambah
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
