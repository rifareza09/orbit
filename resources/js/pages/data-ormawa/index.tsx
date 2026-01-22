import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ChevronDown, Search, Plus, X, RotateCw, Copy, Check, Power } from "lucide-react";
import { Link, usePage, router } from "@inertiajs/react";
import axios from "@/lib/axios";

interface Ormawa {
  id: number;
  nama: string;
  username: string;
  jenis: string;
  ketua: string;
  anggota: number;
  status: string;
  periode: string | null;
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
  const [showResetModal, setShowResetModal] = useState(false);
  const [showEditPeriodeModal, setShowEditPeriodeModal] = useState(false);
  const [selectedOrmawaForReset, setSelectedOrmawaForReset] = useState<Ormawa | null>(null);
  const [selectedOrmawaForEditPeriode, setSelectedOrmawaForEditPeriode] = useState<Ormawa | null>(null);
  const [newPeriode, setNewPeriode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'ukm',
    periode: '2025/2026',
  });

  const filtered = dataOrmawa.filter((o) =>
    o.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOrmawa = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/ormawa/create', formData, {
      onSuccess: () => {
        setShowModal(false);
        setFormData({ name: '', username: '', password: '', role: 'ukm', periode: '2025/2026' });
      },
      onError: () => {
        alert('Gagal menambah ormawa');
      }
    });
  };

  const handleResetAkun = (ormawa: Ormawa) => {
    setSelectedOrmawaForReset(ormawa);
    setShowResetModal(true);
  };

  const handleEditPeriode = (ormawa: Ormawa) => {
    setSelectedOrmawaForEditPeriode(ormawa);
    setNewPeriode(ormawa.periode || '2025/2026');
    setShowEditPeriodeModal(true);
  };

  const confirmEditPeriode = () => {
    if (!selectedOrmawaForEditPeriode || !newPeriode) return;

    router.post(`/ormawa/update-periode/${selectedOrmawaForEditPeriode.id}`, {
      periode: newPeriode,
    }, {
      onSuccess: () => {
        setShowEditPeriodeModal(false);
        setSelectedOrmawaForEditPeriode(null);
        setNewPeriode("");
      },
      onError: () => {
        alert('Gagal mengubah periode');
      }
    });
  };

  const confirmResetAkun = () => {
    if (!selectedOrmawaForReset) return;
    
    if (!inputNewPassword || inputNewPassword.length < 8) {
      alert('Password harus minimal 8 karakter');
      return;
    }

    axios.post(`/ormawa/reset-akun/${selectedOrmawaForReset.id}`, {
      newPassword: inputNewPassword,
    })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setNewPassword(inputNewPassword);
          setInputNewPassword("");
        }
      })
      .catch((error) => {
        alert('Gagal mereset akun: ' + (error.response?.data?.message || error.message));
      });
  };

  const copyToClipboard = () => {
    if (!newPassword) return;
    
    navigator.clipboard.writeText(newPassword)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        alert('Gagal menyalin password. Silakan copy manual.');
      });
  };

  const handleToggleStatus = (ormawa: Ormawa) => {
    const newStatus = ormawa.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    const message = `Apakah Anda yakin ingin mengubah status ${ormawa.nama} menjadi "${newStatus}"?`;

    if (!globalThis.confirm(message)) return;

    setIsTogglingStatus(true);

    axios.post(`/ormawa/toggle-status/${ormawa.id}`, {
      status: newStatus,
    })
      .then(() => {
        router.reload();
      })
      .catch((error) => {
        alert('Gagal mengubah status: ' + (error.response?.data?.error || error.response?.data?.message || error.message));
      })
      .finally(() => {
        setIsTogglingStatus(false);
      });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-semibold text-[#0B132B] mb-6">
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
                    <td className="px-4 py-3">{org.jenis.toUpperCase()}</td>
                    <td className="px-4 py-3">{org.ketua}</td>
                    <td className="px-4 py-3">
                      {String(org.anggota).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(org)}
                        disabled={isTogglingStatus}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition ${
                          org.status === "Aktif"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title="Klik untuk mengubah status"
                      >
                        <Power size={14} />
                        {org.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/data-ormawa/detail/${org.id}`}
                          className="text-blue-600 underline text-sm hover:text-blue-800"
                        >
                          Lihat
                        </Link>
                        <button
                          onClick={() => handleEditPeriode(org)}
                          className="text-purple-600 underline text-sm hover:text-purple-800"
                          title="Ubah periode"
                        >
                          Edit Periode
                        </button>
                        <button
                          onClick={() => handleResetAkun(org)}
                          className="text-orange-600 underline text-sm hover:text-orange-800 flex items-center gap-1"
                          title="Reset akun dan password"
                        >
                          <RotateCw size={14} />
                          Reset
                        </button>
                      </div>
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

            <button
              onClick={() => { globalThis.location.href = '/data-ormawa/export'; }}
              className="w-full bg-[#0B132B] text-white px-4 py-2 rounded-lg hover:bg-[#0A1025] transition"
            >
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
                  <label htmlFor="nama-org" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Organisasi
                  </label>
                  <input
                    id="nama-org"
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
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
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
                  <label htmlFor="jenis-ormawa" className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Ormawa
                  </label>
                  <select
                    id="jenis-ormawa"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                  >
                    <option value="UKM">UKM</option>
                    <option value="BEM">BEM</option>
                    <option value="Kongres">Kongres</option>
                  </select>
                </div>

                {/* Periode */}
                <div>
                  <label htmlFor="periode" className="block text-sm font-medium text-gray-700 mb-1">
                    Periode
                  </label>
                  <select
                    id="periode"
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                  >
                    <option value="2025/2026">2025/2026</option>
                    <option value="2026/2027">2026/2027</option>
                    <option value="2027/2028">2027/2028</option>
                    <option value="2028/2029">2028/2029</option>
                    <option value="2029/2030">2029/2030</option>
                    <option value="2030/2031">2030/2031</option>
                    <option value="2031/2032">2031/2032</option>
                    <option value="2032/2033">2032/2033</option>
                    <option value="2033/2034">2033/2034</option>
                    <option value="2034/2035">2034/2035</option>
                    <option value="2035/2036">2035/2036</option>
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

        {/* MODAL EDIT PERIODE */}
        {showEditPeriodeModal && selectedOrmawaForEditPeriode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#0B132B]">Edit Periode Ormawa</h2>
                <button
                  onClick={() => {
                    setShowEditPeriodeModal(false);
                    setSelectedOrmawaForEditPeriode(null);
                    setNewPeriode("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  Anda akan mengubah periode untuk <strong>{selectedOrmawaForEditPeriode.nama}</strong>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Periode saat ini: <strong>{selectedOrmawaForEditPeriode.periode || 'Belum diatur'}</strong>
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="periode-edit" className="block text-sm font-medium text-gray-700 mb-2">
                  Periode Baru <span className="text-red-500">*</span>
                </label>
                <select
                  id="periode-edit"
                  value={newPeriode}
                  onChange={(e) => setNewPeriode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                  required
                >
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                  <option value="2027/2028">2027/2028</option>
                  <option value="2028/2029">2028/2029</option>
                  <option value="2029/2030">2029/2030</option>
                  <option value="2030/2031">2030/2031</option>
                  <option value="2031/2032">2031/2032</option>
                  <option value="2032/2033">2032/2033</option>
                  <option value="2033/2034">2033/2034</option>
                  <option value="2034/2035">2034/2035</option>
                  <option value="2035/2036">2035/2036</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditPeriodeModal(false);
                    setSelectedOrmawaForEditPeriode(null);
                    setNewPeriode("");
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={confirmEditPeriode}
                  className="flex-1 bg-[#0B132B] text-white py-2 rounded-lg hover:bg-[#1C2541] transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL RESET AKUN */}
        {showResetModal && selectedOrmawaForReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#0B132B]">Reset Akun Ormawa</h2>
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setNewPassword("");
                    setCopied(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
               </button>
              </div>

              {!newPassword ? (
                <div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700">
                      Anda akan mereset akun <strong>{selectedOrmawaForReset.nama}</strong>
                    </p>
                    <ul className="text-sm text-gray-700 mt-3 space-y-2">
                      <li>✓ Password akan direset ke password baru</li>
                      <li>✓ Data program kerja yang belum selesai akan dihapus</li>
                      <li>✓ Data pengajuan kegiatan yang belum selesai akan dihapus</li>
                      <li>✓ Data laporan kegiatan yang belum selesai akan dihapus</li>
                      <li className="font-semibold text-green-700">✓ Data yang sudah disetujui/selesai tetap tersimpan di Puskaka</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="new-password-input" className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="new-password-input"
                      type="text"
                      value={inputNewPassword}
                      onChange={(e) => setInputNewPassword(e.target.value)}
                      placeholder="Masukkan password baru (min. 8 karakter)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowResetModal(false);
                        setInputNewPassword("");
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={confirmResetAkun}
                      disabled={!inputNewPassword || inputNewPassword.length < 8}
                      className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCw size={18} />
                      Reset Akun
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800 font-semibold mb-2">✓ Akun berhasil direset!</p>
                    <p className="text-sm text-gray-700">
                      Berikan password baru ini kepada ketua {selectedOrmawaForReset.nama}
                    </p>
                  </div>

                  <div>
                    <div>
                      <label htmlFor="reset-username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        id="reset-username"
                        type="text"
                        value={selectedOrmawaForReset.username}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                      />
                    </div>

                    <div className="mt-3">
                      <label htmlFor="reset-password" className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                      <div className="flex gap-2">
                        <input
                          id="reset-password"
                          type="text"
                          value={newPassword}
                          disabled
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 font-mono"
                        />
                        <button
                          onClick={copyToClipboard}
                          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
                            copied
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {copied ? (
                            <>
                              <Check size={18} />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={18} />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      💡 <strong>Tips:</strong> Catat atau copy password ini sebelum menutup dialog. Password ini hanya ditampilkan sekali.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowResetModal(false);
                      setNewPassword("");
                      setCopied(false);
                    }}
                    className="w-full mt-4 bg-[#0B132B] text-white py-2 rounded-lg hover:bg-[#1C2541] transition"
                  >
                    Selesai
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
