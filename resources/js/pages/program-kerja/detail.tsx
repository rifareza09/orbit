import React from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link, router } from '@inertiajs/react';

interface ProgramKerjaItem {
    id: number;
    programKerja: string;
    kegiatan: string;
    deskripsiKegiatan: string;
    jenisKegiatan: string;
    estimasiKegiatan: string;
    status: string;
}

export default function DetailProgramKerja({ item }: { item: ProgramKerjaItem }) {

    const handleDelete = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus program kerja ini?')) {
            router.delete(`/program-kerja/${item.id}`);
        }
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
                            <span className="mt-1 inline-block bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                                {item.status}
                            </span>
                        </div>
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

                   <Link
    href={`/program-kerja/edit/${item.id}`} // Pastikan URL mengarah ke rute edit dengan ID
    className="bg-[#0B132B] text-white px-8 py-2 rounded-lg shadow hover:bg-[#1C2541] transition"
>
    Edit
</Link>

                </div>

                <div className="text-center text-gray-500 text-sm mt-8">
                    ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
                </div>
            </div>
        </DashboardLayout>
    );
}
