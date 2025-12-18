import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Link, Head, router } from '@inertiajs/react';
import { Image as ImageIcon, Edit2, Trash2, Eye, Lock, X, Eye as EyeIcon, EyeOff } from 'lucide-react';

interface UnitInfo { nama: string; periode: string }
interface Pengurus { id: number; jabatan: string; nama: string; prodi: string; npm: string }
interface Jadwal { id: number; divisi: string; hari: string; tempat: string; pukul: string }

interface Props {
  unit: UnitInfo;
  deskripsi: string;
  kepengurusan: Pengurus[];
  jadwal: Jadwal[];
  logo_url?: string | null;
  isPuskaka?: boolean;
}

export default function OrmawaProfile({ unit, deskripsi, kepengurusan, jadwal, logo_url, isPuskaka = false }: Props) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data kepengurusan ini?')) {
      router.delete(`/profile/kepengurusan/${id}`);
    }
  };

  const handleDeleteJadwal = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal latihan ini?')) {
      router.delete(`/profile/jadwal-latihan/${id}`);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordForm.currentPassword) {
      setPasswordError('Password saat ini wajib diisi');
      return;
    }
    if (!passwordForm.newPassword) {
      setPasswordError('Password baru wajib diisi');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password baru minimal 8 karakter');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    setIsSubmittingPassword(true);

    fetch('/profile/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
        new_password_confirmation: passwordForm.confirmPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Gagal mengubah password');
          });
        }
        return response.json();
      })
      .then((data) => {
        setPasswordSuccess('Password berhasil diubah!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 2000);
      })
      .catch((error) => {
        setPasswordError(error.message || 'Gagal mengubah password');
      })
      .finally(() => {
        setIsSubmittingPassword(false);
      });
  };

  return (
    <DashboardLayout>

      <div className="p-4 md:p-6 lg:p-10 bg-[#F5F6FA] min-h-screen font-sans text-[#0B132B]">

        {/* 1. Header Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-4 md:gap-6 z-10 flex-1">
            {/* Logo */}
            <div className="w-20 h-20 md:w-28 md:h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden flex-shrink-0">
              {logo_url ? (
                <img src={logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <ImageIcon size={32} strokeWidth={1.5} className="md:w-10 md:h-10" />
              )}
            </div>

            {/* Info Unit */}
            <div className="flex-1 min-w-0">
              <div className="text-xs md:text-sm font-semibold text-gray-500 mb-1">
                {isPuskaka ? 'Profil Administrator' : 'Unit Kegiatan Mahasiswa'}
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight truncate">{unit?.nama || 'Nama Organisasi'}</h1>
              <div className="text-xs md:text-sm text-gray-500 mt-1 font-medium">Periode {unit?.periode || '-'}</div>
            </div>
          </div>

          {/* Tombol Actions */}
          <div className="flex flex-row lg:flex-col gap-2 z-10 w-full lg:w-auto">
            {/* Tombol Edit Profil */}
            <Link
              href="/profil/edit"
              className="bg-[#0B132B] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-[#152042] transition flex items-center justify-center gap-2 shadow-md flex-1 lg:flex-initial"
            >
              <Edit2 size={16} />
              <span className="hidden sm:inline">Edit Profil</span>
            </Link>

            {/* Tombol Ubah Password */}
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-blue-600 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md flex-1 lg:flex-initial"
            >
              <Lock size={16} />
              <span className="hidden sm:inline">Ubah Password</span>
            </button>
          </div>
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

        {/* 3. Struktur Kepengurusan - Hidden for Puskaka */}
        {!isPuskaka && (
        <section className="mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <h3 className="font-bold text-base md:text-lg text-[#0B132B]">Struktur Kepengurusan</h3>
            <Link
              href="/profile/kepengurusan/create"
              className="bg-[#0B132B] text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-[#152042] transition flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Tambah Pengurus
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[640px]">
                <thead className="bg-[#0B132B] text-white">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-1/4">Jabatan</th>
                    <th className="px-6 py-4 font-semibold w-1/3">Nama</th>
                    <th className="px-6 py-4 font-semibold">Prodi</th>
                    <th className="px-6 py-4 font-semibold text-right">NPM</th>
                    <th className="px-6 py-4 font-semibold text-center w-28">Aksi</th>
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
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/profile/kepengurusan/${row.id}`}
                            className="text-blue-600 hover:text-blue-800 transition p-1.5 hover:bg-blue-50 rounded"
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/profile/kepengurusan/${row.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-800 transition p-1.5 hover:bg-yellow-50 rounded"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="text-red-600 hover:text-red-800 transition p-1.5 hover:bg-red-50 rounded"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">
                      Data kepengurusan belum ditambahkan.
                    </td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>
          </div>
        </section>
        )}

        {/* 4. Jadwal Latihan - Hidden for Puskaka */}
        {!isPuskaka && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-[#0B132B]">Jadwal Latihan</h3>
            <Link
              href="/profile/jadwal-latihan/create"
              className="bg-[#0B132B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152042] transition flex items-center gap-2 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Tambah Jadwal
            </Link>
          </div>

          {jadwal.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jadwal.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group">
                  {/* Header Card (Dark) */}
                  <div className="bg-[#0B132B] px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{j.divisi}</h4>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/profile/jadwal-latihan/${j.id}`}
                        className="text-blue-300 hover:text-blue-100 transition p-1 hover:bg-white/10 rounded"
                        title="Lihat Detail"
                      >
                        <Eye size={14} />
                      </Link>
                      <Link
                        href={`/profile/jadwal-latihan/${j.id}/edit`}
                        className="text-yellow-300 hover:text-yellow-100 transition p-1 hover:bg-white/10 rounded"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button
                        onClick={() => handleDeleteJadwal(j.id)}
                        className="text-red-300 hover:text-red-100 transition p-1 hover:bg-white/10 rounded"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-12 mb-2 font-medium">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>

        {/* MODAL UBAH PASSWORD */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#0B132B] flex items-center gap-2">
                  <Lock size={20} />
                  Ubah Password
                </h2>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {passwordSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-semibold">✓ {passwordSuccess}</p>
                </div>
              )}

              {passwordError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 font-semibold">✗ {passwordError}</p>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Password Saat Ini */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Saat Ini
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      placeholder="Masukkan password saat ini"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.current ? (
                        <EyeOff size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Baru */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      placeholder="Minimal 8 karakter"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.new ? (
                        <EyeOff size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Konfirmasi Password Baru */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      placeholder="Ulangi password baru"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Tombol */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPassword}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isSubmittingPassword ? 'Mengubah...' : 'Ubah Password'}
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
