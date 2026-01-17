import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";
import { Plus, Trash2, Award, FileText } from "lucide-react";

interface Prestasi {
  id: number;
  nama_prestasi: string;
  jenis_prestasi: string;
  tingkat_kejuaraan: string;
  nama_peraih: string;
  tanggal_perolehan: string;
  bukti_path: string | null;
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

  const getJenisBadgeColor = (jenis: string) => {
    const jenis_lower = jenis.toLowerCase();
    if (jenis_lower.includes('akademik')) return 'bg-blue-100 text-blue-800';
    if (jenis_lower.includes('olahraga')) return 'bg-green-100 text-green-800';
    if (jenis_lower.includes('seni')) return 'bg-purple-100 text-purple-800';
    if (jenis_lower.includes('sosial')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-20">
          <div>
            <h1 className="text-3xl font-bold text-[#0B132B] flex items-center gap-2">
              <Award size={32} />
              Prestasi
            </h1>
            <p className="text-gray-600 text-sm mt-1">Kelola daftar prestasi organisasi Anda</p>
          </div>
          <Link
            href="/prestasi/tambah"
            className="bg-[#0B132B] text-white px-6 py-3 rounded-lg hover:bg-[#1C2541] transition font-medium flex items-center gap-2 cursor-pointer"
          >
            <Plus size={20} />
            Tambah Prestasi
          </Link>
        </div>

        {/* Empty State */}
        {prestasis.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-16 text-center">
            <Award size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada prestasi</h3>
            <p className="text-gray-500 mb-6">Mulai tambahkan prestasi organisasi Anda untuk membangun reputasi</p>
            <Link
              href="/prestasi/tambah"
              className="inline-block bg-[#0B132B] text-white px-8 py-3 rounded-lg hover:bg-[#1C2541] transition font-medium"
            >
              Tambah Prestasi Pertama
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {prestasis.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition hover:border-[#0B132B]"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#0B132B] mb-2">{item.nama_prestasi}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getJenisBadgeColor(item.jenis_prestasi)}`}>
                        {item.jenis_prestasi}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        {item.tingkat_kejuaraan}
                      </span>
                    </div>
                  </div>
                  <Award size={24} className="text-gray-300" />
                </div>

                {/* Details */}
                <div className="space-y-3 mb-5 text-sm border-t border-b py-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama Peraih:</span>
                    <span className="font-semibold text-gray-800">{item.nama_peraih}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Perolehan:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(item.tanggal_perolehan).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {item.bukti_path ? (
                    <button
                      onClick={() => handleDownload(item.id)}
                      className="flex-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-medium flex items-center justify-center gap-2 text-sm"
                    >
                      <FileText size={16} />
                      Lihat Bukti
                    </button>
                  ) : (
                    <div className="flex-1 bg-gray-50 text-gray-500 px-4 py-2 rounded-lg text-center text-sm font-medium">
                      Tidak ada bukti
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-12">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>
    </DashboardLayout>
  );
}
