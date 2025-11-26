import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";
import { Download, Trash2 } from "lucide-react";

interface Prestasi {
  id: number;
  nama_prestasi: string;
  jenis_prestasi: string;
  tingkat_kejuaraan: string;
  nama_peraih: string;
  tanggal_perolehan: string;
  bukti_file: string | null;
}

interface Props {
  prestasis: Prestasi[];
}

export default function PrestasiPage({ prestasis }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) {
      router.delete(`/prestasi/${id}`);
    }
  };

  const handleDownload = (id: number) => {
    window.location.href = `/prestasi/download/${id}`;
  };

  return (
    <DashboardLayout>
      {/* === KONTEN UTAMA === */}
      <div className="p-8">
        {/* Header + Tombol */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">Prestasi</h1>
          <Link
            href="/prestasi/tambah"
            className="bg-[#0B132B] text-white px-5 py-2 rounded-lg hover:bg-[#1C2541] transition"
          >
            Tambah Prestasi
          </Link>
        </div>

        {/* Empty State */}
        {prestasis.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-24 w-24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada prestasi</h3>
            <p className="text-gray-500 mb-4">Mulai tambahkan prestasi organisasi Anda</p>
            <Link
              href="/prestasi/tambah"
              className="inline-block bg-[#0B132B] text-white px-6 py-2 rounded-lg hover:bg-[#1C2541] transition"
            >
              Tambah Prestasi Pertama
            </Link>
          </div>
        ) : (
          <>
            {/* === TABEL === */}
            <div className="overflow-x-auto rounded-lg shadow bg-white">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-[#0B132B] text-white">
                  <tr>
                    <th className="px-4 py-3">No.</th>
                    <th className="px-4 py-3">Nama Prestasi</th>
                    <th className="px-4 py-3">Jenis Prestasi</th>
                    <th className="px-4 py-3">Tingkat Kejuaraan</th>
                    <th className="px-4 py-3">Nama Peraih</th>
                    <th className="px-4 py-3">Tanggal Perolehan</th>
                    <th className="px-4 py-3">Bukti</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {prestasis.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{item.nama_prestasi}</td>
                      <td className="px-4 py-3">{item.jenis_prestasi}</td>
                      <td className="px-4 py-3">{item.tingkat_kejuaraan}</td>
                      <td className="px-4 py-3">{item.nama_peraih}</td>
                      <td className="px-4 py-3">
                        {new Date(item.tanggal_perolehan).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {item.bukti_file ? (
                          <button
                            onClick={() => handleDownload(item.id)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <Download size={16} />
                            Download
                          </button>
                        ) : (
                          <span className="text-gray-400">Tidak ada</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
