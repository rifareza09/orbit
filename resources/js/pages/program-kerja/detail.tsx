import React, { useState } from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, router } from '@inertiajs/react';
import { X } from 'lucide-react';

interface ProgramKerjaItem {
    id: number;
    programKerja: string;
    kegiatan: string;
    deskripsiKegiatan: string;
    jenisKegiatan: string;
    estimasiKegiatan: string;
    status: string;
    catatan_puskaka?: string | null;
    reviewed_at?: string | null;
}

export default function DetailProgramKerja({ item }: { item: ProgramKerjaItem }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleDelete = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus program kerja ini?')) {
            router.delete(`/program-kerja/${item.id}`);
        }
    };

    const confirmAjukan = () => {
        setShowConfirmModal(false);
        router.put(`/program-kerja/ajukan/${item.id}`, { status: 'Diajukan' }, {
            onSuccess: () => {
                alert('✅ Program kerja berhasil diajukan ke Puskaka!');
            },
            onError: () => {
                alert('❌ Gagal mengajukan program kerja. Silakan coba lagi.');
            }
        });
    };

    return (
        <DashboardLayout>
            <div className="p-8 bg-[#F5F6FA] min-h-screen">

                {/* Header + Tombol Hapus */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[#0B132B]">
                        Program Kerja
                    </h1>

                    {/* Tombol Hapus */}
                    <button
                        onClick={handleDelete}
                        className="bg-[#8B0000] text-white px-6 py-2 rounded-md hover:bg-red-900 transition"
                    >
                        Hapus
                    </button>
                </div>

                {/* Card Wrapper */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-[#0B132B] text-white px-6 py-3 font-semibold">
                        Detail Program
                    </div>

                    {/* Card Body */}
                    <div className="p-6 grid grid-cols-2 gap-x-10 gap-y-6">
                        <div>
                            <p className="font-bold text-sm text-gray-800">Nama Program Kerja</p>
                            <p className="mt-1 text-gray-800">{item.programKerja}</p>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-gray-800">Nama Kegiatan</p>
                            <p className="mt-1 text-gray-800">{item.kegiatan}</p>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-gray-800">Deskripsi Kegiatan</p>
                            <p className="mt-1 leading-relaxed text-gray-800">{item.deskripsiKegiatan}</p>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-gray-800">Jenis Kegiatan</p>
                            <p className="mt-1 text-gray-800">{item.jenisKegiatan}</p>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-gray-800">Estimasi Anggaran</p>
                            <p className="mt-1 text-gray-800">{item.estimasiKegiatan}</p>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-gray-800">Status</p>
                            <span className={`mt-1 inline-block text-xs font-medium px-3 py-1 rounded-full ${
                                item.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                                item.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                                item.status === 'Direview' ? 'bg-blue-100 text-blue-700' :
                                item.status === 'Direvisi' ? 'bg-orange-100 text-orange-700' :
                                item.status === 'Diajukan' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-200 text-gray-700'
                            }`}>
                                {item.status}
                            </span>
                        </div>

                        {/* Catatan dari Puskaka */}
                        {item.catatan_puskaka && (
                            <div className="col-span-2">
                                <p className="font-bold text-sm text-gray-800">Catatan dari Puskaka</p>
                                <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-gray-800 whitespace-pre-wrap">{item.catatan_puskaka}</p>
                                    {item.reviewed_at && (
                                        <p className="text-xs text-gray-500 mt-2">Direview pada: {item.reviewed_at}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-8 mt-8">
                    <Link
                        href="/program-kerja"
                        className="bg-[#0B132B] text-white px-8 py-2 rounded-lg shadow hover:bg-[#1C2541] transition"
                    >
                        Kembali
                    </Link>

                   {/* Tombol Edit untuk status Belum Diajukan atau Ditolak */}
                   {(item.status === 'Belum Diajukan' || item.status === 'Ditolak') && (
                     <Link
                       href={`/program-kerja/edit/${item.id}`}
                       className="bg-blue-500 text-white px-8 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                     >
                       Edit
                     </Link>
                   )}

                   {/* Tombol Revisi khusus untuk status Direvisi - hanya tombol ini yang muncul */}
                   {item.status === 'Direvisi' && (
                     <Link
                       href={`/program-kerja/edit/${item.id}`}
                       className="bg-orange-500 text-white px-8 py-2 rounded-lg shadow hover:bg-orange-600 transition font-semibold"
                     >
                       Revisi
                     </Link>
                   )}

                   {/* Tombol Ajukan hanya untuk status Belum Diajukan atau Ditolak */}
                   {(item.status === 'Belum Diajukan' || item.status === 'Ditolak') && (
                     <button
                       onClick={() => setShowConfirmModal(true)}
                       className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-2 rounded-lg shadow transition font-semibold"
                     >
                       Ajukan ke Puskaka
                     </button>
                   )}

                </div>

                <div className="text-center text-gray-500 text-sm mt-8">
                    ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
                </div>
            </div>

            {/* CONFIRMATION MODAL */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-[#0B132B]">Konfirmasi Pengajuan</h2>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700">
                                Apakah Anda yakin ingin mengajukan program kerja <strong>"{item.programKerja}"</strong> ke Puskaka?
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                Program kerja ini akan diteruskan untuk review dan persetujuan oleh Puskaka.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmAjukan}
                                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition font-medium"
                            >
                                Ya, Ajukan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
