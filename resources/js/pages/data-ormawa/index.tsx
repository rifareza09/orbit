import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ChevronDown, Search, Plus, X, RotateCw, Copy, Check, Power, Eye, Edit, KeyRound, Trash2 } from "lucide-react";
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
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showResetAkunModal, setShowResetAkunModal] = useState(false);
  const [showEditPeriodeModal, setShowEditPeriodeModal] = useState(false);
  const [showConfirmResetAkun, setShowConfirmResetAkun] = useState(false);
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

  const handleResetPassword = (ormawa: Ormawa) => {
    setSelectedOrmawaForReset(ormawa);
    setShowResetPasswordModal(true);
  };

  const handleResetAkun = (ormawa: Ormawa) => {
    setSelectedOrmawaForReset(ormawa);
    setShowConfirmResetAkun(true);
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

  const confirmResetPassword = () => {
    if (!selectedOrmawaForReset) return;

    if (!inputNewPassword || inputNewPassword.length < 8) {
      alert('Password harus minimal 8 karakter');
      return;
    }

    axios.post(`/ormawa/reset-password/${selectedOrmawaForReset.id}`, {
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
        alert('Gagal mereset password: ' + (error.response?.data?.message || error.message));
      });
  };

  const confirmResetAkun = () => {
    if (!selectedOrmawaForReset) return;

    if (!inputNewPassword || inputNewPassword.length < 8) {
      alert('Password harus minimal 8 karakter');
      return;
    }

    setShowConfirmResetAkun(false);

    axios.post(`/ormawa/reset-akun/${selectedOrmawaForReset.id}`, {
      newPassword: inputNewPassword,
    })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setNewPassword(inputNewPassword);
          setInputNewPassword("");
          setShowResetAkunModal(true);
        }
      })
      .catch((error) => {
        alert('Gagal mereset akun: ' + (error.response?.data?.message || error.message));
      });
  };

  const copyToClipboard = () => {
    if (!newPassword) return;

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(newPassword)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error('Clipboard API failed:', err);
          // Fallback to old method
          copyToClipboardFallback(newPassword);
        });
    } else {
      // Fallback for older browsers
      copyToClipboardFallback(newPassword);
    }
  };

  const copyToClipboardFallback = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        alert('Gagal menyalin password. Silakan copy manual.');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      alert('Gagal menyalin password. Silakan copy manual.');
    }

    document.body.removeChild(textArea);
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
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#0B132B] mb-4 sm:mb-6">
          Data Organisasi Mahasiswa
        </h1>

        {/* FILTER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <button className="w-full sm:w-auto border bg-white rounded-lg px-3 sm:px-4 py-2 flex items-center justify-center sm:justify-start gap-2 shadow hover:bg-gray-50 text-sm sm:text-base">
            Filter Tahun Kepengurusan <ChevronDown size={16} />
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Tombol Tambah Ormawa */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto bg-[#0B132B] text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow hover:bg-[#1C2541] transition text-sm sm:text-base font-medium"
            >
              <Plus size={18} />
              Tambah Ormawa
            </button>

            {/* Search */}
            <div className="flex items-center bg-white border px-3 sm:px-4 py-2 rounded-lg shadow gap-2 w-full sm:w-72">
              <input
                type="text"
                className="outline-none w-full text-sm sm:text-base"
                placeholder="Cari nama kegiatan"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={20} className="text-gray-600" />
            </div>
          </div>
        </div>

        {/* TABLE + STATISTIK */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* TABLE */}
          <div className="flex-1 bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[1000px]">
              <thead className="bg-[#0B132B] text-white text-left">
                <tr>
                  <th className="px-2 sm:px-4 py-3 whitespace-nowrap">No.</th>
                  <th className="px-2 sm:px-4 py-3 whitespace-nowrap">Nama Organisasi</th>
                  <th className="px-2 sm:px-4 py-3 whitespace-nowrap">Jenis</th>
                  <th className="px-2 sm:px-4 py-3 whitespace-nowrap">Ketua</th>
                  <th className="px-2 sm:px-4 py-3 whitespace-nowrap">Jumlah Anggota</th>
                  <th className="px-2 sm:px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-4 py-3 text-center whitespace-nowrap">Lihat</th>
                  <th className="px-2 sm:px-4 py-3 text-center whitespace-nowrap">Edit Periode</th>
                  <th className="px-2 sm:px-4 py-3 text-center whitespace-nowrap">Reset Password</th>
                  <th className="px-2 sm:px-4 py-3 text-center whitespace-nowrap">Reset Akun</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((org, index) => (
                  <tr
                    key={org.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">{index + 1}</td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">{org.nama}</td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">{org.jenis.toUpperCase()}</td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">{org.ketua}</td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {String(org.anggota).padStart(2, "0")}
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(org)}
                        disabled={isTogglingStatus}
                        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition ${
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
                    <td className="px-2 sm:px-4 py-3 text-center whitespace-nowrap">
                      <Link
                        href={`/data-ormawa/detail/${org.id}`}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        title="Lihat detail ormawa"
                      >
                        <Eye size={14} />
                        <span className="hidden sm:inline">Lihat</span>
                      </Link>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleEditPeriode(org)}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                        title="Ubah periode kepengurusan"
                      >
                        <Edit size={14} />
                        <span className="hidden lg:inline">Edit Periode</span>
                        <span className="lg:hidden">Edit</span>
                      </button>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleResetPassword(org)}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition"
                        title="Reset password saja"
                      >
                        <KeyRound size={14} />
                        <span className="hidden lg:inline">Reset Password</span>
                        <span className="lg:hidden">Reset</span>
                      </button>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleResetAkun(org)}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition"
                        title="Reset akun (hapus semua data dan reset password)"
                      >
                        <Trash2 size={14} />
                        <span className="hidden lg:inline">Reset Akun</span>
                        <span className="lg:hidden">Reset</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
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
          <div className="w-full lg:w-64 bg-white p-4 sm:p-6 rounded-xl shadow space-y-4">
            <h3 className="font-semibold text-base sm:text-lg">Statistik</h3>

            <div>
              <p className="text-gray-700 text-sm sm:text-base">Total Organisasi Mahasiswa</p>
              <p className="text-2xl sm:text-3xl font-bold">
                {stats.total}
              </p>
            </div>

            <div>
              <p className="text-gray-700 text-sm sm:text-base">Ormawa Aktif</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {stats.aktif}
              </p>
            </div>

            <div>
              <p className="text-gray-700 text-sm sm:text-base">Ormawa Nonaktif</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {stats.nonaktif}
              </p>
            </div>

            <button
              onClick={() => { globalThis.location.href = '/data-ormawa/export'; }}
              className="w-full bg-[#0B132B] text-white px-4 py-2.5 text-sm sm:text-base rounded-lg hover:bg-[#0A1025] transition font-medium"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#0B132B]">Tambah Ormawa Baru</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} className="sm:hidden" />
                  <X size={24} className="hidden sm:block" />
                </button>
              </div>

              <form onSubmit={handleAddOrmawa} className="space-y-3 sm:space-y-4">
                {/* Nama Organisasi */}
                <div>
                  <label htmlFor="nama-org" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Nama Organisasi
                  </label>
                  <input
                    id="nama-org"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: LDK Kahfi"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                    required
                  />
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Contoh: ldk"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimal 8 karakter"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                    required
                  />
                </div>

                {/* Jenis Ormawa */}
                <div>
                  <label htmlFor="jenis-ormawa" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Jenis Ormawa
                  </label>
                  <select
                    id="jenis-ormawa"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                  >
                    <option value="UKM">UKM</option>
                    <option value="BEM">BEM</option>
                    <option value="Kongres">Kongres</option>
                  </select>
                </div>

                {/* Periode */}
                <div>
                  <label htmlFor="periode" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Periode
                  </label>
                  <select
                    id="periode"
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
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
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#0B132B] text-white py-2 rounded-lg hover:bg-[#1C2541] transition text-sm sm:text-base font-medium"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base sm:text-lg font-bold text-[#0B132B]">Edit Periode Ormawa</h2>
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

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowEditPeriodeModal(false);
                    setSelectedOrmawaForEditPeriode(null);
                    setNewPeriode("");
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={confirmEditPeriode}
                  className="flex-1 bg-[#0B132B] text-white py-2 rounded-lg hover:bg-[#1C2541] transition text-sm sm:text-base font-medium"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL KONFIRMASI RESET AKUN */}
        {showConfirmResetAkun && selectedOrmawaForReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base sm:text-lg font-bold text-red-600">⚠️ Konfirmasi Reset Akun</h2>
                <button
                  onClick={() => {
                    setShowConfirmResetAkun(false);
                    setSelectedOrmawaForReset(null);
                    setInputNewPassword("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} className="sm:hidden" />
                  <X size={24} className="hidden sm:block" />
                </button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4">
                <p className="text-xs sm:text-sm text-red-800 font-semibold mb-2">
                  Anda akan mereset SELURUH AKUN untuk <strong>{selectedOrmawaForReset.nama}</strong>
                </p>
                <p className="text-xs sm:text-sm text-red-700 mb-2 sm:mb-3">
                  Tindakan ini akan menghapus:
                </p>
                <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                  <li>❌ Program kerja yang belum disetujui</li>
                  <li>❌ Pengajuan kegiatan yang belum disetujui</li>
                  <li>❌ Laporan kegiatan yang belum disetujui</li>
                  <li>❌ Password akan direset</li>
                  <li className="font-semibold text-green-700 mt-2">✓ Data yang sudah disetujui tetap tersimpan</li>
                </ul>
              </div>

              <div className="mb-4">
                <label htmlFor="confirm-password-input" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirm-password-input"
                  type="text"
                  value={inputNewPassword}
                  onChange={(e) => setInputNewPassword(e.target.value)}
                  placeholder="Masukkan password baru (min. 8 karakter)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-2 sm:p-3 mb-4">
                <p className="text-xs text-yellow-800">
                  ⚠️ <strong>PERHATIAN:</strong> Tindakan ini tidak dapat dibatalkan!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowConfirmResetAkun(false);
                    setSelectedOrmawaForReset(null);
                    setInputNewPassword("");
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={confirmResetAkun}
                  disabled={!inputNewPassword || inputNewPassword.length < 8}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
                >
                  <RotateCw size={16} className="sm:hidden" />
                  <RotateCw size={18} className="hidden sm:block" />
                  Ya, Reset Akun
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL RESET PASSWORD */}
        {showResetPasswordModal && selectedOrmawaForReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base sm:text-lg font-bold text-[#0B132B]">Reset Password Ormawa</h2>
                <button
                  onClick={() => {
                    setShowResetPasswordModal(false);
                    setNewPassword("");
                    setCopied(false);
                    setInputNewPassword("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} className="sm:hidden" />
                  <X size={24} className="hidden sm:block" />
               </button>
              </div>

              {!newPassword ? (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4">
                    <p className="text-xs sm:text-sm text-gray-700">
                      Anda akan mereset password untuk <strong>{selectedOrmawaForReset.nama}</strong>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      ✓ Hanya password yang akan direset
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      ✓ Semua data tetap tersimpan
                    </p>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="new-password-input" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Password Baru <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="new-password-input"
                      type="text"
                      value={inputNewPassword}
                      onChange={(e) => setInputNewPassword(e.target.value)}
                      placeholder="Masukkan password baru (min. 8 karakter)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        setShowResetPasswordModal(false);
                        setInputNewPassword("");
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base font-medium"
                    >
                      Batal
                    </button>
                    <button
                      onClick={confirmResetPassword}
                      disabled={!inputNewPassword || inputNewPassword.length < 8}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
                    >
                      <RotateCw size={16} className="sm:hidden" />
                      <RotateCw size={18} className="hidden sm:block" />
                      Reset Password
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4">
                    <p className="text-xs sm:text-sm text-green-800 font-semibold mb-2">✓ Password berhasil direset!</p>
                    <p className="text-xs sm:text-sm text-gray-700">
                      Berikan password baru ini kepada ketua {selectedOrmawaForReset.nama}
                    </p>
                  </div>

                  <div>
                    <div>
                      <label htmlFor="reset-username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        id="reset-username"
                        type="text"
                        value={selectedOrmawaForReset.username}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    </div>

                    <div className="mt-3">
                      <label htmlFor="reset-password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          id="reset-password"
                          type="text"
                          value={newPassword}
                          disabled
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base bg-gray-50 text-gray-700 font-mono"
                        />
                        <button
                          onClick={copyToClipboard}
                          className={`px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition text-sm sm:text-base whitespace-nowrap ${
                            copied
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {copied ? (
                            <>
                              <Check size={16} className="sm:hidden" />
                              <Check size={18} className="hidden sm:block" />
                              <span className="hidden sm:inline">Copied!</span>
                              <span className="sm:hidden">OK</span>
                            </>
                          ) : (
                            <>
                              <Copy size={16} className="sm:hidden" />
                              <Copy size={18} className="hidden sm:block" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      💡 <strong>Tips:</strong> Catat atau copy password ini sebelum menutup dialog. Password ini hanya ditampilkan sekali.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowResetPasswordModal(false);
                      setNewPassword("");
                      setCopied(false);
                      setInputNewPassword("");
                    }}
                    className="w-full mt-4 bg-[#0B132B] text-white py-2 rounded-lg hover:bg-[#1C2541] transition text-sm sm:text-base font-medium"
                  >
                    Selesai
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL RESET AKUN - HASIL */}
        {showResetAkunModal && selectedOrmawaForReset && newPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base sm:text-lg font-bold text-[#0B132B]">Reset Akun Berhasil</h2>
                <button
                  onClick={() => {
                    setShowResetAkunModal(false);
                    setNewPassword("");
                    setCopied(false);
                    setInputNewPassword("");
                    setSelectedOrmawaForReset(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} className="sm:hidden" />
                  <X size={24} className="hidden sm:block" />
               </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4">
                <p className="text-xs sm:text-sm text-green-800 font-semibold mb-2">✓ Akun berhasil direset!</p>
                <p className="text-xs sm:text-sm text-gray-700">
                  Berikan password baru ini kepada ketua {selectedOrmawaForReset.nama}
                </p>
              </div>

              <div>
                <div>
                  <label htmlFor="reset-akun-username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    id="reset-akun-username"
                    type="text"
                    value={selectedOrmawaForReset.username}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base bg-gray-50 text-gray-700"
                  />
                </div>

                <div className="mt-3">
                  <label htmlFor="reset-akun-password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id="reset-akun-password"
                      type="text"
                      value={newPassword}
                      disabled
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base bg-gray-50 text-gray-700 font-mono"
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition text-sm sm:text-base whitespace-nowrap ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check size={16} className="sm:hidden" />
                          <Check size={18} className="hidden sm:block" />
                          <span className="hidden sm:inline">Copied!</span>
                          <span className="sm:hidden">OK</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="sm:hidden" />
                          <Copy size={18} className="hidden sm:block" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  💡 <strong>Tips:</strong> Catat atau copy password ini sebelum menutup dialog. Password ini hanya ditampilkan sekali.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowResetAkunModal(false);
                  setNewPassword("");
                  setCopied(false);
                  setInputNewPassword("");
                  setSelectedOrmawaForReset(null);
                  router.reload();
                }}
                className="w-full mt-4 bg-[#0B132B] text-white py-2 rounded-lg hover:bg-[#1C2541] transition text-sm sm:text-base font-medium"
              >
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
