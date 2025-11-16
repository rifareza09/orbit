import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link } from "@inertiajs/react";
import { Plus, Upload, Calendar } from "lucide-react";

export default function BuatProposal() {
    const [proposal, setProposal] = useState<File | null>(null);

    const [form, setForm] = useState({
        namaKegiatan: "Open Recruitment dan Pelatihan Dasar Sinematografi",
        ketuaPelaksana: "Muhammad Raihan",
        tempatPelaksanaan: "Universitas YARSI",
        tanggalPelaksanaan: "29/12/2025",
    });

    const [pengajuanDana, setPengajuanDana] = useState([
        { id: 1, nama: "", jumlah: "" },
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addDana = () => {
        setPengajuanDana([
            ...pengajuanDana,
            { id: Date.now(), nama: "", jumlah: "" },
        ]);
    };

    const updateDana = (id: number, field: string, value: string) => {
        setPengajuanDana(
            pengajuanDana.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen p-10 bg-[#F5F6FA]">

                {/* TITLE */}
                <h1 className="text-2xl font-bold text-[#0B132B] mb-6">
                    Pengajuan Kegiatan
                </h1>

                {/* CARD */}
                <div className="bg-white shadow-xl rounded-xl overflow-hidden border">

                    {/* HEADER DARK */}
                    <div className="bg-[#0B132B] text-white px-6 py-3">
                        <h2 className="text-lg font-semibold">Buat Proposal Kegiatan</h2>
                    </div>

                    {/* INNER CONTENT */}
                    <div className="p-8">

                        <div className="grid grid-cols-2 gap-x-10 gap-y-6">

                            {/* Nama Kegiatan */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Nama Kegiatan</p>
                                <input
                                    type="text"
                                    name="namaKegiatan"
                                    value={form.namaKegiatan}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-gray-100"
                                />
                            </div>

                            {/* Ketua Pelaksana */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Ketua Pelaksana</p>
                                <input
                                    type="text"
                                    name="ketuaPelaksana"
                                    value={form.ketuaPelaksana}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-gray-100"
                                />
                            </div>

                            {/* Tempat Pelaksanaan */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Tempat Pelaksanaan</p>
                                <input
                                    type="text"
                                    name="tempatPelaksanaan"
                                    value={form.tempatPelaksanaan}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-white"
                                />
                            </div>

                            {/* Tanggal Pelaksanaan */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Tanggal Pelaksanaan</p>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="tanggalPelaksanaan"
                                        value={form.tanggalPelaksanaan}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded-md border border-gray-300 bg-white"
                                    />
                                    <Calendar
                                        size={18}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Proposal Upload */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Proposal (pdf)</p>
                                <label className="w-full flex items-center justify-center gap-2 p-2 border border-gray-400 rounded-md cursor-pointer hover:bg-gray-100">
                                    <Upload size={18} />
                                    <span>Upload</span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={(e) =>
                                            setProposal(e.target.files?.[0] || null)
                                        }
                                    />
                                </label>
                            </div>

                            {/* Pengajuan Dana */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Pengajuan Dana</p>

                                <div className="space-y-3">
                                    {pengajuanDana.map((item) => (
                                        <div key={item.id} className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nama pengajuan"
                                                value={item.nama}
                                                onChange={(e) =>
                                                    updateDana(item.id, "nama", e.target.value)
                                                }
                                                className="flex-1 p-2 border border-gray-300 rounded-md"
                                            />

                                            <input
                                                type="number"
                                                placeholder="Jumlah (Rp)"
                                                value={item.jumlah}
                                                onChange={(e) =>
                                                    updateDana(item.id, "jumlah", e.target.value)
                                                }
                                                className="w-40 p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    ))}

                                    <button
                                        onClick={addDana}
                                        className="flex items-center gap-1 text-sm font-medium bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                                    >
                                        <Plus size={16} /> Tambah
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-6 mt-10 mr-10">
                    <Link
                        href="/pengajuan-kegiatan"
                        className="px-10 py-2 rounded-md bg-[#0B132B] text-white hover:bg-[#1C2541]"
                    >
                        Batal
                    </Link>

                    <button className="px-10 py-2 rounded-md bg-[#0B132B] text-white hover:bg-[#1C2541]">
                        Simpan
                    </button>
                </div>

                <p className="text-center text-gray-500 text-sm mt-16">
                    ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
                </p>
            </div>
        </DashboardLayout>
    );
}
