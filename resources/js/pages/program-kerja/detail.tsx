import React, { useState } from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, router } from '@inertiajs/react';
import { X, ArrowLeft, Edit3, Send, AlertCircle, CheckCircle } from 'lucide-react';

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

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Disetujui':
                return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/25';
            case 'Ditolak':
                return 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-red-500/25';
            case 'Direview':
                return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-blue-500/25';
            case 'Direvisi':
                return 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-orange-500/25';
            case 'Diajukan':
                return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-amber-500/25';
            default:
                return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B132B] to-[#1C2541] bg-clip-text text-transparent">
                        Detail Program Kerja
                    </h1>
                    <p className="text-gray-500 mt-1">Lihat informasi lengkap program kerja</p>
                </div>

                {/* Card Wrapper */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white px-8 py-4">
                        <h2 className="text-lg font-semibold">Informasi Program</h2>
                    </div>

                    {/* Card Body */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nama Program Kerja</p>
                            <p className="text-lg font-medium text-gray-800">{item.programKerja}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nama Kegiatan</p>
                            <p className="text-lg font-medium text-gray-800">{item.kegiatan}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Deskripsi Kegiatan</p>
                            <p className="text-gray-700 leading-relaxed">{item.deskripsiKegiatan}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Jenis Kegiatan</p>
                            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                                {item.jenisKegiatan}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Estimasi Anggaran</p>
                            <p className="text-xl font-bold text-emerald-600">{item.estimasiKegiatan}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Status</p>
                            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${getStatusStyle(item.status)}`}>
                                {item.status}
                            </span>
                        </div>

                        {/* Catatan dari Puskaka */}
                        {item.catatan_puskaka && (
                            <div className="col-span-2 mt-4">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Catatan dari Puskaka</p>
                                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                            <AlertCircle size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{item.catatan_puskaka}</p>
                                            {item.reviewed_at && (
                                                <p className="text-xs text-gray-500 mt-3">Direview pada: {item.reviewed_at}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-10">
                    <Link
                        href="/program-kerja"
                        className="group flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 font-medium"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Kembali
                    </Link>

                   {/* Tombol Edit untuk status Belum Diajukan atau Ditolak */}
                   {(item.status === 'Belum Diajukan' || item.status === 'Ditolak') && (
                     <Link
                       href={`/program-kerja/edit/${item.id}`}
                       className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-medium transform hover:-translate-y-0.5"
                     >
                       <Edit3 size={18} className="group-hover:rotate-12 transition-transform" />
                       Edit
                     </Link>
                   )}

                   {/* Tombol Revisi khusus untuk status Direvisi */}
                   {item.status === 'Direvisi' && (
                     <Link
                       href={`/program-kerja/edit/${item.id}`}
                       className="group flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold transform hover:-translate-y-0.5"
                     >
                       <Edit3 size={18} className="group-hover:rotate-12 transition-transform" />
                       Revisi
                     </Link>
                   )}

                   {/* Tombol Ajukan hanya untuk status Belum Diajukan atau Ditolak */}
                   {(item.status === 'Belum Diajukan' || item.status === 'Ditolak') && (
                     <button
                       onClick={() => setShowConfirmModal(true)}
                       className="group flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 font-semibold transform hover:-translate-y-0.5"
                     >
                       <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                       Ajukan ke Puskaka
                     </button>
                   )}

                </div>

                <div className="text-center text-sm mt-10 py-6 border-t border-gray-200">
                  <p className="text-gray-400">
                    © 2025 Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
                  </p>
                </div>
            </div>

            {/* CONFIRMATION MODAL */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-[420px] transform animate-slideUp">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                                    <Send size={24} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-[#0B132B]">Konfirmasi Pengajuan</h2>
                            </div>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-8">
                            <p className="text-gray-700">
                                Apakah Anda yakin ingin mengajukan program kerja <strong className="text-[#0B132B]">"{item.programKerja}"</strong> ke Puskaka?
                            </p>
                            <p className="text-sm text-gray-500 mt-3 bg-gray-50 p-3 rounded-lg">
                                Program kerja ini akan diteruskan untuk review dan persetujuan oleh Puskaka.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmAjukan}
                                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all font-medium transform hover:-translate-y-0.5"
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
